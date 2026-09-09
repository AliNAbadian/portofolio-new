import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";
import { createChatLanguageModel } from "../lib/create-chat-model";
import { buildSystemPrompt } from "../model/build-system-prompt";
import type { ChatQuotaView } from "../model/chat-limits";
import { validateChatMessage } from "../model/chat-message-rules";
import {
  buildVisitorCookie,
  createVisitorId,
  hashVisitorId,
  peekQuota,
  readVisitorId,
  resolveIpKey,
  tryConsumeQuota,
} from "./rate-limit-store";

const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  "https://alinabadian.github.io",
];

function allowedOrigins(): Set<string> {
  const extra = process.env.CHAT_ALLOWED_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  return new Set([...DEFAULT_ALLOWED_ORIGINS, ...(extra ?? [])]);
}

function requestOrigin(request: Request): string | null {
  return request.headers.get("origin");
}

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) {
    return true;
  }

  return allowedOrigins().has(origin);
}

function corsHeaders(origin: string | null): Headers {
  const headers = new Headers();
  if (origin && allowedOrigins().has(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    headers.set(
      "Access-Control-Expose-Headers",
      "Retry-After, X-RateLimit-Remaining-Hour, X-RateLimit-Remaining-Day",
    );
    headers.set("Vary", "Origin");
  }
  return headers;
}

function applyQuotaHeaders(headers: Headers, quota: ChatQuotaView): void {
  headers.set("X-RateLimit-Remaining-Hour", String(quota.remainingHour));
  headers.set("X-RateLimit-Remaining-Day", String(quota.remainingDay));
  if (quota.retryAfterSeconds !== null) {
    headers.set("Retry-After", String(quota.retryAfterSeconds));
  }
}

function jsonResponse(
  body: unknown,
  init: { status: number; headers: Headers; cookie?: string },
): Response {
  init.headers.set("Content-Type", "application/json");
  if (init.cookie) {
    init.headers.set("Set-Cookie", init.cookie);
  }
  return new Response(JSON.stringify(body), {
    status: init.status,
    headers: init.headers,
  });
}

function logChatEvent(event: {
  visitorHash: string;
  status: number;
  remainingHour: number;
  remainingDay: number;
  code?: string;
}): void {
  console.info("[about-me-chat]", event);
}

function visitorContext(request: Request): {
  visitorId: string;
  cookie: string | undefined;
  ipKey: string;
  visitorHash: string;
} {
  const existing = readVisitorId(request);
  const visitorId = existing ?? createVisitorId();
  return {
    visitorId,
    cookie: existing ? undefined : buildVisitorCookie(visitorId, request),
    ipKey: resolveIpKey(request),
    visitorHash: hashVisitorId(visitorId),
  };
}

export function createChatRouteHandlers() {
  async function OPTIONS(request: Request): Promise<Response> {
    const origin = requestOrigin(request);
    if (!isOriginAllowed(origin)) {
      return new Response(null, { status: 403 });
    }

    return new Response(null, {
      status: 204,
      headers: corsHeaders(origin),
    });
  }

  async function GET(request: Request): Promise<Response> {
    const origin = requestOrigin(request);
    if (!isOriginAllowed(origin)) {
      return new Response(null, { status: 403 });
    }

    const headers = corsHeaders(origin);
    const { visitorId, cookie, ipKey, visitorHash } = visitorContext(request);
    const quota = peekQuota(visitorId, ipKey);

    logChatEvent({
      visitorHash,
      status: 200,
      remainingHour: quota.remainingHour,
      remainingDay: quota.remainingDay,
      code: "QUOTA",
    });

    return jsonResponse(quota, { status: 200, headers, cookie });
  }

  async function POST(request: Request): Promise<Response> {
    const origin = requestOrigin(request);
    if (!isOriginAllowed(origin)) {
      return new Response(null, { status: 403 });
    }

    const headers = corsHeaders(origin);
    const { visitorId, cookie, ipKey, visitorHash } = visitorContext(request);

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      logChatEvent({
        visitorHash,
        status: 400,
        remainingHour: peekQuota(visitorId, ipKey).remainingHour,
        remainingDay: peekQuota(visitorId, ipKey).remainingDay,
        code: "INVALID_MESSAGE",
      });
      return jsonResponse(
        { code: "INVALID_MESSAGE", message: "Invalid JSON." },
        { status: 400, headers, cookie },
      );
    }

    const validation = validateChatMessage(payload);
    if (!validation.ok) {
      const quota = peekQuota(visitorId, ipKey);
      logChatEvent({
        visitorHash,
        status: 400,
        remainingHour: quota.remainingHour,
        remainingDay: quota.remainingDay,
        code: "INVALID_MESSAGE",
      });
      return jsonResponse(
        { code: "INVALID_MESSAGE", message: validation.message },
        { status: 400, headers, cookie },
      );
    }

    const model = createChatLanguageModel();
    if (!model) {
      const quota = peekQuota(visitorId, ipKey);
      logChatEvent({
        visitorHash,
        status: 500,
        remainingHour: quota.remainingHour,
        remainingDay: quota.remainingDay,
        code: "CHAT_UNAVAILABLE",
      });
      return jsonResponse(
        { code: "CHAT_UNAVAILABLE", message: "Assistant is unavailable." },
        { status: 500, headers, cookie },
      );
    }

    let modelMessages;
    try {
      modelMessages = await convertToModelMessages(
        validation.messages as UIMessage[],
      );
    } catch {
      const quota = peekQuota(visitorId, ipKey);
      logChatEvent({
        visitorHash,
        status: 400,
        remainingHour: quota.remainingHour,
        remainingDay: quota.remainingDay,
        code: "INVALID_MESSAGE",
      });
      return jsonResponse(
        { code: "INVALID_MESSAGE", message: "Unable to read messages." },
        { status: 400, headers, cookie },
      );
    }

    const consume = tryConsumeQuota(visitorId, ipKey);
    if (!consume.ok) {
      applyQuotaHeaders(headers, consume.quota);
      logChatEvent({
        visitorHash,
        status: 429,
        remainingHour: consume.quota.remainingHour,
        remainingDay: consume.quota.remainingDay,
        code: "RATE_LIMITED",
      });
      return jsonResponse(
        {
          code: "RATE_LIMITED",
          remainingHour: consume.quota.remainingHour,
          remainingDay: consume.quota.remainingDay,
          retryAfterSeconds: consume.quota.retryAfterSeconds,
          limited: true,
        },
        { status: 429, headers, cookie },
      );
    }

    applyQuotaHeaders(headers, consume.quota);
    if (cookie) {
      headers.set("Set-Cookie", cookie);
    }

    logChatEvent({
      visitorHash,
      status: 200,
      remainingHour: consume.quota.remainingHour,
      remainingDay: consume.quota.remainingDay,
      code: "GENERATE",
    });

    try {
      const result = streamText({
        model,
        system: buildSystemPrompt(validation.locale),
        messages: modelMessages,
        onError: () => {
          logChatEvent({
            visitorHash,
            status: 500,
            remainingHour: consume.quota.remainingHour,
            remainingDay: consume.quota.remainingDay,
            code: "CHAT_UNAVAILABLE",
          });
        },
      });

      return result.toUIMessageStreamResponse({
        headers,
      });
    } catch {
      logChatEvent({
        visitorHash,
        status: 500,
        remainingHour: consume.quota.remainingHour,
        remainingDay: consume.quota.remainingDay,
        code: "CHAT_UNAVAILABLE",
      });
      return jsonResponse(
        { code: "CHAT_UNAVAILABLE", message: "Assistant is unavailable." },
        { status: 500, headers },
      );
    }
  }

  return { GET, POST, OPTIONS };
}
