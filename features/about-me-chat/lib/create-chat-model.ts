import { createAvalaiChatModel } from "./avalai-chat-model";

export const DEFAULT_CHAT_MODEL = "gpt-4.1-nano-2025-04-14";
export const DEFAULT_AVALAI_BASE_URL = "https://api.avalai.ir/v1";

export function getChatProviderApiKey(): string | undefined {
  const key = process.env.AVALAI_API_KEY?.trim();
  return key || undefined;
}

export function createChatLanguageModel() {
  const apiKey = getChatProviderApiKey();
  if (!apiKey) {
    return null;
  }

  return createAvalaiChatModel({
    apiKey,
    baseURL: process.env.AVALAI_BASE_URL?.trim() || DEFAULT_AVALAI_BASE_URL,
    modelId: process.env.CHAT_MODEL?.trim() || DEFAULT_CHAT_MODEL,
  });
}
