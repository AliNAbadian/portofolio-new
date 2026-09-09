import { createChatRouteHandlers } from "@/features/about-me-chat/services/create-chat-route-handler";

export const runtime = "nodejs";

export const { GET, POST, OPTIONS } = createChatRouteHandlers();
