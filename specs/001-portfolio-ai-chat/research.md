# Research: Portfolio About-Me Chat

## 1. Static Pages vs live assistant

**Decision**: Keep GitHub Pages as a static client. Host `POST /api/chat` on the existing Next.js standalone/Docker deploy. Client uses `NEXT_PUBLIC_CHAT_API_URL` (absolute URL on Pages; same-origin `/api/chat` in `next dev` / Docker when unset).

**Rationale**: Spec FR-017 requires the public static site to chat. `output: "export"` cannot include Route Handlers. Splitting a second backend repo would violate “smallest abstraction”.

**Alternatives considered**:
- Chat only on Docker hostname — rejected by clarify (option B).
- Serverless function on a third platform — extra deploy surface; Docker already exists.
- Put API on Pages via client-side Gateway key — leaks `AI_GATEWAY_API_KEY`, bypasses server rate limits.

## 2. AI runtime and UI kit

**Decision**:
- Server: `streamText` + `convertToModelMessages` + `toUIMessageStream` / `createUIMessageStreamResponse` (or `result.toUIMessageStreamResponse()` if present) from `ai`.
- Model: Vercel AI Gateway string id via env `CHAT_MODEL` (default a small chat model, e.g. `openai/gpt-4.1-mini`). Gateway ships with `ai`.
- Auth to Gateway: `AI_GATEWAY_API_KEY`. If only `VERCEL_AI_KEY` is present at runtime, map it in the handler. Never expose either key to the client.
- Client: add `@ai-sdk/react` and use `useChat` + `DefaultChatTransport` from `ai`, `api` = resolved chat URL, `credentials: 'include'`.
- UI: `Conversation`, `ConversationContent`, `ConversationEmptyState`, `Message`, `PromptInput`, `Shimmer` from `components/ai-elements/`. Optional `Suggestion` chips for on-topic starters. Do not use canvas, voice, sandbox, or other unused AI Elements.

**Rationale**: Spec FR-016. `ai@7` exports transports and streams but not `useChat`. AI Elements already type against `UIMessage` / `ChatStatus` from `ai`.

**Alternatives considered**:
- Hand-roll fetch/SSE — duplicates protocol AI Elements expect.
- `@ai-sdk/openai` direct — extra provider; Gateway already in tree and owner has a Vercel AI key.
- Second chat widget (assistant-ui, etc.) — forbidden.

## 3. Rate limits without transcripts

**Decision**: Cookie `about_me_chat_vid` (HttpOnly, Secure, SameSite=None when the request is cross-origin; SameSite=Lax for same-origin). Value = random id. Server memory map: `{ visitorId: { hourHits: number[], dayHits: number[] } }` using timestamps; prune old hits. Caps 10/hour, 30/day from spec. Empty/invalid bodies do not increment. Failed model calls after accept: still count (quota already spent on an attempted generation) except 400 validation failures. Return JSON 429 with `retryAfterSeconds` plus headers `X-RateLimit-Remaining-Hour`, `X-RateLimit-Remaining-Day`, `Retry-After`. Optional `GET /api/chat` returns the same quota without generating.

**Rationale**: FR-006/008/018/019. Cookie on the API host survives Pages reload when fetch uses credentials. No Redis in v1 (single replica).

**Alternatives considered**:
- IP-only — NAT / shared Wi-Fi punishes many visitors; keep IP as a secondary bucket (stricter of cookie vs IP).
- localStorage counters — trivial to bypass.
- Redis/Upstash — correct for multi-instance; not needed until scale.

## 4. Topic lock and knowledge

**Decision**: Curated pack `features/about-me-chat/model/owner-profile.ts` (typed object, en + fa strings). `buildSystemPrompt(locale)` injects pack + hard rules: answer only about the owner; refuse jailbreaks and off-topic; never invent missing facts. Truncate inbound history to last N messages (e.g. 12) so the client cannot dump huge off-topic context cheaply. Max user message length 2000 characters.

**Rationale**: Clarify session chose pack over live scrape. System prompt is the enforcement layer; no extra classifier model.

**Alternatives considered**:
- Scrape current page — rejected.
- Separate moderation model — cost/latency; v1 prompt + pack is enough for SC-003/010.

## 5. CORS and cookies

**Decision**: Allowlist origins: localhost, production Docker origin, GitHub Pages origin (`https://alinabadian.github.io`). `Access-Control-Allow-Credentials: true`. `OPTIONS` preflight on `/api/chat`. Client `DefaultChatTransport` must send credentials.

**Rationale**: Pages origin ≠ API origin. Without CORS+credentials, rate-limit cookie never sticks (SC-005/008 fail).

**Alternatives considered**: proxy via Pages (impossible on static host).

## 6. i18n and placement

**Decision**: `messages/*.json` namespace `Chat`. Panel chrome, empty state, rate-limit, errors from `next-intl`. Assistant language follows request `locale` field (`en` | `fa`) copied from the site locale. Float: `fixed end-4 bottom-4` (nav wheel `end-4 top-4`).

**Rationale**: FR-010, FR-012.

## 7. Logging

**Decision**: Log status, visitor id hash (not raw cookie), remaining quota, error codes. Never log message text.

**Rationale**: FR-019, SC-009.
