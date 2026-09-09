"use client";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import {
  Suggestion,
  Suggestions,
} from "@/components/ai-elements/suggestion";
import { getMessageText } from "../model/chat-message-rules";
import type { AboutMeChatView } from "../hooks/use-about-me-chat";
import { useTranslations } from "next-intl";
import type { RefObject } from "react";

const SUGGESTION_KEYS = [
  "suggestionRole",
  "suggestionProjects",
  "suggestionContact",
] as const;

type AboutMeChatPanelProps = {
  chat: AboutMeChatView;
  inputRef: RefObject<HTMLTextAreaElement | null>;
};

export function AboutMeChatPanel({ chat, inputRef }: AboutMeChatPanelProps) {
  const t = useTranslations("Chat");
  const limited = chat.quota?.limited === true;
  const isLive = chat.status === "submitted" || chat.status === "streaming";
  const showEmpty = chat.messages.length === 0;

  const errorText =
    chat.errorKey === "rateLimited"
      ? t("rateLimited", { seconds: chat.retryAfterSeconds ?? 0 })
      : chat.errorKey
        ? t(chat.errorKey)
        : null;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="gap-4 p-3">
          {showEmpty ? (
            <ConversationEmptyState
              title={t("emptyTitle")}
              description={t("emptyDescription")}
            />
          ) : (
            chat.messages.map((message) => {
              if (message.role === "system") {
                return null;
              }

              const text = getMessageText(message);
              const isAssistant = message.role === "assistant";

              return (
                <Message from={message.role} key={message.id}>
                  <MessageContent>
                    {isAssistant ? (
                      <MessageResponse isAnimating={isLive}>
                        {text}
                      </MessageResponse>
                    ) : (
                      text
                    )}
                  </MessageContent>
                </Message>
              );
            })
          )}
          {isLive ? <Shimmer className="text-sm">{t("live")}</Shimmer> : null}
        </ConversationContent>
      </Conversation>

      {showEmpty ? (
        <Suggestions className="px-3 pb-2">
          {SUGGESTION_KEYS.map((key) => (
            <Suggestion
              key={key}
              suggestion={t(key)}
              disabled={limited || isLive}
              onClick={(value) => chat.send(value)}
            />
          ))}
        </Suggestions>
      ) : null}

      {chat.quota ? (
        <p className="px-3 pb-1 text-xs text-muted-foreground" aria-live="polite">
          {t("remaining", {
            hour: chat.quota.remainingHour,
            day: chat.quota.remainingDay,
          })}
        </p>
      ) : null}

      {errorText ? (
        <p className="px-3 pb-1 text-xs text-destructive" role="alert">
          {errorText}
        </p>
      ) : null}

      <PromptInput
        className="border-t border-border p-2"
        onSubmit={({ text }, event) => {
          const canSend = !limited && !isLive && text.trim().length > 0;
          chat.send(text);
          if (canSend) {
            event.currentTarget.reset();
          }
        }}
      >
        <PromptInputBody>
          <PromptInputTextarea
            ref={inputRef}
            id="about-me-chat-prompt"
            placeholder={t("placeholder")}
            disabled={limited}
            aria-label={t("placeholder")}
          />
        </PromptInputBody>
        <PromptInputFooter className="justify-end">
          <PromptInputSubmit
            status={chat.status}
            onStop={chat.stop}
            disabled={limited && !isLive}
            aria-label={t("send")}
          />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
