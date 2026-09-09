import type {
  LanguageModelV3,
  LanguageModelV3CallOptions,
  LanguageModelV3FinishReason,
  LanguageModelV3Message,
  LanguageModelV3StreamPart,
  LanguageModelV3Usage,
} from "@ai-sdk/provider";

type OpenAiChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type AvalaiChatModelConfig = {
  apiKey: string;
  baseURL: string;
  modelId: string;
};

function emptyUsage(): LanguageModelV3Usage {
  return {
    inputTokens: {
      total: undefined,
      noCache: undefined,
      cacheRead: undefined,
      cacheWrite: undefined,
    },
    outputTokens: {
      total: undefined,
      text: undefined,
      reasoning: undefined,
    },
  };
}

function usageFromProvider(raw: unknown): LanguageModelV3Usage {
  if (!raw || typeof raw !== "object") {
    return emptyUsage();
  }

  const usage = raw as {
    prompt_tokens?: number;
    completion_tokens?: number;
  };

  return {
    inputTokens: {
      total: usage.prompt_tokens,
      noCache: undefined,
      cacheRead: undefined,
      cacheWrite: undefined,
    },
    outputTokens: {
      total: usage.completion_tokens,
      text: usage.completion_tokens,
      reasoning: undefined,
    },
  };
}

function mapFinishReason(raw: string | null | undefined): LanguageModelV3FinishReason {
  if (raw === "length") {
    return { unified: "length", raw: raw ?? undefined };
  }
  if (raw === "content_filter") {
    return { unified: "content-filter", raw: raw ?? undefined };
  }
  if (raw === "tool_calls") {
    return { unified: "tool-calls", raw: raw ?? undefined };
  }
  if (raw === "stop" || raw === "stop_sequence") {
    return { unified: "stop", raw: raw ?? undefined };
  }
  return { unified: "other", raw: raw ?? undefined };
}

function textFromParts(
  parts: Array<{ type: string; text?: string }>,
): string {
  return parts
    .filter((part) => part.type === "text" && typeof part.text === "string")
    .map((part) => part.text as string)
    .join("\n");
}

function toOpenAiMessages(
  prompt: LanguageModelV3Message[],
): OpenAiChatMessage[] {
  const messages: OpenAiChatMessage[] = [];

  for (const message of prompt) {
    if (message.role === "system") {
      messages.push({ role: "system", content: message.content });
      continue;
    }

    if (message.role === "user") {
      const content = textFromParts(message.content);
      if (content) {
        messages.push({ role: "user", content });
      }
      continue;
    }

    if (message.role === "assistant") {
      const content = textFromParts(message.content);
      if (content) {
        messages.push({ role: "assistant", content });
      }
    }
  }

  return messages;
}

async function* iterateSseData(
  body: ReadableStream<Uint8Array>,
): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) {
          continue;
        }

        const data = trimmed.slice("data:".length).trim();
        if (data === "[DONE]") {
          return;
        }

        yield data;
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export function createAvalaiChatModel(
  config: AvalaiChatModelConfig,
): LanguageModelV3 {
  const completionsUrl = `${config.baseURL.replace(/\/$/, "")}/chat/completions`;

  async function postChat(stream: boolean, options: LanguageModelV3CallOptions) {
    const response = await fetch(completionsUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.modelId,
        stream,
        messages: toOpenAiMessages(options.prompt),
      }),
      signal: options.abortSignal,
    });

    if (!response.ok) {
      throw new Error(`AvalAI request failed (${response.status}).`);
    }

    return response;
  }

  return {
    specificationVersion: "v3",
    provider: "avalai",
    modelId: config.modelId,
    supportedUrls: {},

    async doGenerate(options) {
      const response = await postChat(false, options);
      const payload = (await response.json()) as {
        id?: string;
        model?: string;
        choices?: Array<{
          finish_reason?: string | null;
          message?: { content?: string | null };
        }>;
        usage?: unknown;
      };

      const text = payload.choices?.[0]?.message?.content ?? "";
      const finish = mapFinishReason(payload.choices?.[0]?.finish_reason);

      return {
        content: text ? [{ type: "text" as const, text }] : [],
        finishReason: finish,
        usage: usageFromProvider(payload.usage),
        warnings: [],
        response: {
          id: payload.id,
          modelId: payload.model ?? config.modelId,
        },
      };
    },

    async doStream(options) {
      const response = await postChat(true, options);
      const body = response.body;
      if (!body) {
        throw new Error("AvalAI request failed (empty stream).");
      }

      const textId = "text-1";
      let started = false;
      let finishReason: LanguageModelV3FinishReason = {
        unified: "other",
        raw: undefined,
      };
      let usage = emptyUsage();

      const stream = new ReadableStream<LanguageModelV3StreamPart>({
        async start(controller) {
          controller.enqueue({ type: "stream-start", warnings: [] });

          try {
            for await (const data of iterateSseData(body)) {
              let chunk: {
                id?: string;
                model?: string;
                choices?: Array<{
                  finish_reason?: string | null;
                  delta?: { content?: string | null };
                }>;
                usage?: unknown;
              };

              try {
                chunk = JSON.parse(data) as typeof chunk;
              } catch {
                continue;
              }

              if (chunk.id || chunk.model) {
                controller.enqueue({
                  type: "response-metadata",
                  id: chunk.id,
                  modelId: chunk.model,
                });
              }

              const delta = chunk.choices?.[0]?.delta?.content;
              if (delta) {
                if (!started) {
                  controller.enqueue({ type: "text-start", id: textId });
                  started = true;
                }
                controller.enqueue({
                  type: "text-delta",
                  id: textId,
                  delta,
                });
              }

              const rawFinish = chunk.choices?.[0]?.finish_reason;
              if (rawFinish) {
                finishReason = mapFinishReason(rawFinish);
              }

              if (chunk.usage) {
                usage = usageFromProvider(chunk.usage);
              }
            }

            if (started) {
              controller.enqueue({ type: "text-end", id: textId });
            }

            controller.enqueue({
              type: "finish",
              finishReason,
              usage,
            });
            controller.close();
          } catch (error) {
            controller.enqueue({ type: "error", error });
            controller.close();
          }
        },
      });

      return { stream };
    },
  };
}
