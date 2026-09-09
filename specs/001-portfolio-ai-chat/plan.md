# Implementation Plan: Portfolio About-Me Chat

**Branch**: `001-portfolio-ai-chat` | **Date**: 2026-09-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-portfolio-ai-chat/spec.md`

## Summary

Add a floating about-me chat on the bilingual portfolio. Visitors ask only about the owner. Replies stream live. Caps: 10 sends/hour and 30/day, enforced on a hosted backend (not reset by page reload). No transcripts stored.

UI MUST use existing `components/ai-elements/` (Conversation, Message, PromptInput, Shimmer, optional Suggestion). Runtime MUST use the installed `ai` package (`streamText`, UI message stream, `DefaultChatTransport`). Client chat state uses `@ai-sdk/react` `useChat` (not shipped inside `ai@7`; required peer for the chatbot protocol). Model calls go through Vercel AI Gateway already bundled with `ai` (`gateway` / string model ids). Public GitHub Pages is a static client: it calls `NEXT_PUBLIC_CHAT_API_URL`. The Next.js standalone/Docker deploy hosts `POST /api/chat`.

## Technical Context

**Language/Version**: TypeScript 5, Next.js 16.3 App Router, React 19

**Primary Dependencies**: `ai` ^7.0.94, `@ai-sdk/react` (add, matching AI SDK 7), `@ai-sdk/gateway` (transitive via `ai`), `next-intl` ^4.14, existing `components/ai-elements/*`

**Storage**: In-memory rate-limit counters on the Node process + HttpOnly visitor cookie. No message body storage. No database in v1. Multi-replica requires a later shared store (out of scope).

**Testing**: Domain functions (rate limit, message validation, system-prompt builder) as pure TS. Manual E2E per `quickstart.md`. No new test runner required for v1.

**Target Platform**: Static GitHub Pages client + Node 22+ standalone/Docker API host. Local `next dev` serves both.

**Project Type**: Web application (static frontend + small chat HTTP API)

**Performance Goals**: Visible in-progress state within 3s; completed reply within 15s under normal conditions (SC-002)

**Constraints**: Topic lock to owner profile pack; 10/hour + 30/day; no transcripts; CORS + credentialed cookies for Pages→API; chat float at `bottom` + `end` (nav wheel is `top` + `end`); kebab-case; feature-based layout

**Scale/Scope**: Anonymous public visitors, one conversation UI, one POST contract, one JSON profile pack (en + fa)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | How this plan complies |
|-----------|--------|------------------------|
| I. Feature ownership | Pass | New feature `features/about-me-chat/` with public `index.ts`. App page only mounts the launcher. API route is a thin re-export. |
| II. Presentation vs logic | Pass | Panel/launcher hold open/close only. `use-about-me-chat.ts` owns send/stream/errors/quota. Services own HTTP and rate-limit I/O. |
| III. Hook cohesion | Pass | One public hook `useAboutMeChat`. No `useCalculate*` wrappers. Prompt validation is a plain function. |
| IV. Domain independence | Pass | Rate-limit math, max-length, empty-message, and system-prompt assembly are React-free. Effects only sync stream UI. |
| V. Kebab-case files | Pass | All new files kebab-case. |
| Review gates | Pass | No `shared/` business rules. No second feature importing internals. |

No Complexity Tracking rows. Adding `@ai-sdk/react` is a missing SDK client, not an extra architecture layer.

## Project Structure

### Documentation (this feature)

```text
specs/001-portfolio-ai-chat/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── chat-http.md
└── tasks.md              # later: /speckit-tasks
```

### Source Code (repository root)

```text
features/about-me-chat/
├── index.ts
├── components/
│   ├── about-me-chat-launcher.tsx
│   └── about-me-chat-panel.tsx
├── hooks/
│   └── use-about-me-chat.ts
├── services/
│   ├── post-chat.ts
│   ├── create-chat-route-handler.ts
│   └── rate-limit-store.ts
├── model/
│   ├── owner-profile.ts
│   ├── chat-limits.ts
│   ├── chat-message-rules.ts
│   └── build-system-prompt.ts
└── lib/
    └── chat-api-url.ts

app/api/chat/route.ts          # re-export handler; omitted from GitHub Pages export
app/[locale]/page.tsx          # compose <AboutMeChatLauncher />

messages/en.json               # Chat namespace
messages/fa.json
```

**Structure Decision**: Single Next.js repo. Feature folder owns UI, hook, domain, and handler implementation. `app/api/chat` is the HTTP boundary for standalone/Docker only. Static Pages build never ships the route; the client uses `NEXT_PUBLIC_CHAT_API_URL`.

## Complexity Tracking

> None. No constitution violations.
