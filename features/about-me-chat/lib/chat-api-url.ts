export function resolveChatApiUrl(): string {
  const raw = process.env.NEXT_PUBLIC_CHAT_API_URL?.trim();
  if (!raw) {
    return "/api/chat";
  }

  return raw.replace(/\/$/, "");
}
