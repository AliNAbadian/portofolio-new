import type { UIMessage } from "ai";

export const CHAT_LOCALES = ["en", "fa"] as const;
export type ChatLocale = (typeof CHAT_LOCALES)[number];

export const MAX_USER_TEXT_LENGTH = 2000;
export const MAX_HISTORY_MESSAGES = 12;

export type ChatMessageValidation =
  | {
      ok: true;
      messages: UIMessage[];
      locale: ChatLocale;
      lastUserText: string;
    }
  | {
      ok: false;
      code: "INVALID_MESSAGE";
      message: string;
    };

export function isBlankUserText(text: string): boolean {
  return text.trim().length === 0;
}

export function isSendableUserText(text: string): boolean {
  const trimmed = text.trim();
  return trimmed.length >= 1 && trimmed.length <= MAX_USER_TEXT_LENGTH;
}

export function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export function getLastUserText(messages: UIMessage[]): string {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message?.role === "user") {
      return getMessageText(message).trim();
    }
  }

  return "";
}

function isUiMessage(value: unknown): value is UIMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as { role?: unknown; parts?: unknown };
  return (
    (candidate.role === "user" ||
      candidate.role === "assistant" ||
      candidate.role === "system") &&
    Array.isArray(candidate.parts)
  );
}

export function parseChatLocale(value: unknown): ChatLocale {
  if (value === "en" || value === "fa") {
    return value;
  }

  return "en";
}

export function validateChatMessage(input: unknown): ChatMessageValidation {
  if (!input || typeof input !== "object") {
    return { ok: false, code: "INVALID_MESSAGE", message: "Invalid body." };
  }

  const body = input as { messages?: unknown; locale?: unknown };
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return {
      ok: false,
      code: "INVALID_MESSAGE",
      message: "messages must be a non-empty array.",
    };
  }

  if (!body.messages.every(isUiMessage)) {
    return {
      ok: false,
      code: "INVALID_MESSAGE",
      message: "messages must be UIMessage objects.",
    };
  }

  const locale = parseChatLocale(body.locale);
  const truncated = body.messages.slice(-MAX_HISTORY_MESSAGES);
  const lastUserText = getLastUserText(truncated);

  if (lastUserText.length < 1 || lastUserText.length > MAX_USER_TEXT_LENGTH) {
    return {
      ok: false,
      code: "INVALID_MESSAGE",
      message: "Last user text trim length must be 1–2000.",
    };
  }

  return {
    ok: true,
    messages: truncated,
    locale,
    lastUserText,
  };
}
