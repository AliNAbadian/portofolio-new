import type { ChatQuotaView } from "../model/chat-limits";
import { resolveChatApiUrl } from "../lib/chat-api-url";

export type ChatErrorCode =
  | "RATE_LIMITED"
  | "INVALID_MESSAGE"
  | "CHAT_UNAVAILABLE";

export class ChatApiError extends Error {
  constructor(
    readonly code: ChatErrorCode,
    message: string,
    readonly quota?: ChatQuotaView,
  ) {
    super(message);
    this.name = "ChatApiError";
  }
}

async function readErrorPayload(
  response: Response,
): Promise<{ code?: string; message?: string } & Partial<ChatQuotaView>> {
  try {
    return (await response.json()) as {
      code?: string;
      message?: string;
    } & Partial<ChatQuotaView>;
  } catch {
    return {};
  }
}

export async function chatFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const response = await fetch(input, {
    ...init,
    credentials: "include",
  });

  if (response.ok) {
    return response;
  }

  const payload = await readErrorPayload(response);
  const quota: ChatQuotaView | undefined =
    typeof payload.remainingHour === "number" &&
    typeof payload.remainingDay === "number"
      ? {
          remainingHour: payload.remainingHour,
          remainingDay: payload.remainingDay,
          retryAfterSeconds: payload.retryAfterSeconds ?? null,
          limited: payload.limited ?? response.status === 429,
        }
      : undefined;

  if (response.status === 429 || payload.code === "RATE_LIMITED") {
    throw new ChatApiError(
      "RATE_LIMITED",
      payload.message ?? "RATE_LIMITED",
      quota,
    );
  }

  if (response.status === 400 || payload.code === "INVALID_MESSAGE") {
    throw new ChatApiError(
      "INVALID_MESSAGE",
      payload.message ?? "INVALID_MESSAGE",
    );
  }

  throw new ChatApiError(
    "CHAT_UNAVAILABLE",
    payload.message ?? "CHAT_UNAVAILABLE",
  );
}

export async function fetchChatQuota(): Promise<ChatQuotaView> {
  const response = await chatFetch(resolveChatApiUrl(), {
    method: "GET",
  });
  return (await response.json()) as ChatQuotaView;
}
