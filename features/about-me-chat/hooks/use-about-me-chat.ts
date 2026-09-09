"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type ChatStatus, type UIMessage } from "ai";
import { useLocale } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { resolveChatApiUrl } from "../lib/chat-api-url";
import type { ChatQuotaView } from "../model/chat-limits";
import {
  isBlankUserText,
  isSendableUserText,
  MAX_USER_TEXT_LENGTH,
} from "../model/chat-message-rules";
import { ChatApiError, chatFetch, fetchChatQuota } from "../services/post-chat";

export type ChatPanelErrorKey =
  | "error"
  | "unavailable"
  | "rateLimited"
  | "validationEmpty"
  | "tooLong";

export type AboutMeChatView = {
  messages: UIMessage[];
  status: ChatStatus;
  quota: ChatQuotaView | null;
  errorKey: ChatPanelErrorKey | null;
  retryAfterSeconds: number | null;
  send: (text: string) => void;
  stop: () => void;
  refreshQuota: () => Promise<void>;
};

export function useAboutMeChat(): AboutMeChatView {
  const locale = useLocale();
  const [quota, setQuota] = useState<ChatQuotaView | null>(null);
  const [errorKey, setErrorKey] = useState<ChatPanelErrorKey | null>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: resolveChatApiUrl(),
        credentials: "include",
        body: { locale: locale === "fa" ? "fa" : "en" },
        fetch: chatFetch,
      }),
    [locale],
  );

  const { messages, sendMessage, status, stop } = useChat({
    transport,
    onError: (error) => {
      if (error instanceof ChatApiError) {
        if (error.quota) {
          setQuota(error.quota);
        }
        if (error.code === "RATE_LIMITED") {
          setErrorKey("rateLimited");
          return;
        }
        if (error.code === "CHAT_UNAVAILABLE") {
          setErrorKey("unavailable");
          return;
        }
        if (error.code === "INVALID_MESSAGE") {
          setErrorKey("validationEmpty");
          return;
        }
      }
      setErrorKey("unavailable");
    },
    onFinish: () => {
      void fetchChatQuota()
        .then(setQuota)
        .catch(() => {
          setErrorKey("unavailable");
        });
    },
  });

  const refreshQuota = useCallback(async () => {
    try {
      const next = await fetchChatQuota();
      setQuota(next);
      if (next.limited) {
        setErrorKey("rateLimited");
      }
    } catch {
      setErrorKey("unavailable");
    }
  }, []);

  const send = useCallback(
    (text: string) => {
      if (status === "submitted" || status === "streaming") {
        return;
      }

      if (isBlankUserText(text)) {
        setErrorKey("validationEmpty");
        return;
      }

      if (text.trim().length > MAX_USER_TEXT_LENGTH) {
        setErrorKey("tooLong");
        return;
      }

      if (!isSendableUserText(text)) {
        setErrorKey("validationEmpty");
        return;
      }

      if (quota?.limited) {
        setErrorKey("rateLimited");
        return;
      }

      setErrorKey(null);
      void sendMessage({ text: text.trim() });
    },
    [quota?.limited, sendMessage, status],
  );

  return {
    messages,
    status,
    quota,
    errorKey,
    retryAfterSeconds: quota?.retryAfterSeconds ?? null,
    send,
    stop,
    refreshQuota,
  };
}
