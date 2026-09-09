"use client";

import { MessageCircle, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAboutMeChat } from "../hooks/use-about-me-chat";
import { AboutMeChatPanel } from "./about-me-chat-panel";

export function AboutMeChatLauncher() {
  const t = useTranslations("Chat");
  const chat = useAboutMeChat();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  const refreshQuota = chat.refreshQuota;

  const openPanel = useCallback(() => {
    setOpen(true);
    void refreshQuota();
    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, [refreshQuota]);

  const toggle = useCallback(() => {
    if (open) {
      close();
      return;
    }
    openPanel();
  }, [close, open, openPanel]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, open]);

  return (
    <>
      {open ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-background/20 backdrop-blur-sm"
            aria-label={t("close")}
            onClick={close}
          />
          <div
            id="about-me-chat-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={t("dialogLabel")}
            className="absolute end-4 bottom-20 z-10 flex h-[min(32rem,70vh)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card/95 text-card-foreground shadow-2xl backdrop-blur-md"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.stopPropagation();
                close();
              }
            }}
          >
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <p className="text-sm font-medium">{t("emptyTitle")}</p>
              <button
                type="button"
                onClick={close}
                aria-label={t("close")}
                className="flex size-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <AboutMeChatPanel chat={chat} inputRef={inputRef} />
          </div>
        </div>
      ) : null}

      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="about-me-chat-dialog"
        aria-label={open ? t("close") : t("open")}
        className="fixed end-4 bottom-4 z-50 flex size-11 cursor-pointer items-center justify-center rounded-full border border-border bg-card/80 text-primary shadow-lg backdrop-blur-md transition-colors duration-200 hover:bg-card hover:text-foreground lg:size-12"
      >
        {open ? (
          <X className="size-5" aria-hidden />
        ) : (
          <MessageCircle className="size-5" aria-hidden />
        )}
      </button>
    </>
  );
}
