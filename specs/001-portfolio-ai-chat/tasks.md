---
description: "Task list for Portfolio About-Me Chat implementation"
---

# Tasks: Portfolio About-Me Chat

**Input**: Design documents from `/specs/001-portfolio-ai-chat/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/chat-http.md, quickstart.md

**Tests**: Not requested in the spec. No TDD tasks. Validate via quickstart.md.

**Organization**: Setup → Foundation → US1–US4 → Polish.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1–US4 map to spec user stories
- Every task includes an exact file path

## Path Conventions

Feature root: `features/about-me-chat/` per plan.md.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Feature skeleton and client SDK

- [X] T001 Create kebab-case feature directories `features/about-me-chat/components/`, `hooks/`, `services/`, `model/`, `lib/`
- [X] T002 Add `@ai-sdk/react` matching `ai` ^7.0.94 in `package.json` via bun
- [X] T003 [P] Add `Chat` i18n keys (open, close, empty title/description, send, error, unavailable, rateLimited, remaining, placeholder) in `messages/en.json`
- [X] T004 [P] Add matching `Chat` i18n keys in `messages/fa.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Domain, API URL, CORS, streaming route. Blocks all stories.

**CRITICAL**: No user story UI until this phase is complete

- [X] T005 Implement `resolveChatApiUrl()` using `NEXT_PUBLIC_CHAT_API_URL` or same-origin `/api/chat` in `features/about-me-chat/lib/chat-api-url.ts`
- [X] T006 Implement `validateChatMessage` rules in `features/about-me-chat/model/chat-message-rules.ts`: last user text trim length 1–2000; `locale` in `{en, fa}` default `en`; truncate history to last 12 messages
- [X] T007 Implement `OwnerProfilePack` typed object (name, role, location, languages, contact, about, experience, projects, skills; each copy `{ en, fa }` as in data-model.md) in `features/about-me-chat/model/owner-profile.ts` from public site facts
- [X] T008 Implement `buildSystemPrompt(locale)` injecting the pack plus refuse-off-topic / no-invention rules in `features/about-me-chat/model/build-system-prompt.ts`
- [X] T009 Implement pure rate-limit math in `features/about-me-chat/model/chat-limits.ts`: hour cap 10, day cap 30, rolling windows, prune timestamps, `retryAfterSeconds`
- [X] T010 Implement in-memory `VisitorRateLimit` store (hourHits/dayHits number[] of unix ms; no message bodies) plus HttpOnly cookie `about_me_chat_vid` in `features/about-me-chat/services/rate-limit-store.ts`
- [X] T011 Implement CORS allowlist + credentialed headers (localhost, Docker origin, `https://alinabadian.github.io`) and OPTIONS 204 in `features/about-me-chat/services/create-chat-route-handler.ts`
- [X] T012 Implement `GET /api/chat` quota JSON `{ remainingHour, remainingDay, retryAfterSeconds, limited }` without incrementing counters in `features/about-me-chat/services/create-chat-route-handler.ts`
- [X] T013 Implement `POST /api/chat` per `specs/001-portfolio-ai-chat/contracts/chat-http.md`: parse `{ messages, locale? }`, validate via T006, `streamText` + Gateway (`AI_GATEWAY_API_KEY` or `VERCEL_AI_KEY`), `CHAT_MODEL`, UI message stream; never log message text in `features/about-me-chat/services/create-chat-route-handler.ts`
- [X] T014 Re-export GET/POST/OPTIONS from `app/api/chat/route.ts` (standalone/Docker only; not used by Pages export)
- [X] T015 Export a public feature barrel from `features/about-me-chat/index.ts` (launcher only; no deep internals)

**Checkpoint**: `GET/POST /api/chat` works in `bun dev` with a Gateway key

---

## Phase 3: User Story 1 - Open chat from a floating control (Priority: P1) MVP

**Goal**: Float button opens/closes a panel; visitor sends a message and sees a thread; close/reopen keeps messages this visit

**Independent Test**: Open `/en`, tap bottom-end chat control (not the top-end nav wheel), send one question, see a reply, close and reopen, thread still there

### Implementation for User Story 1

- [X] T016 [US1] Implement `useAboutMeChat` with `useChat` + `DefaultChatTransport` (`credentials: 'include'`, `api` from `chat-api-url.ts`) in `features/about-me-chat/hooks/use-about-me-chat.ts`
- [X] T017 [US1] Build panel with AI Elements `Conversation`, `ConversationContent`, `ConversationEmptyState`, `Message`, `PromptInput` only (no second chat kit) in `features/about-me-chat/components/about-me-chat-panel.tsx`
- [X] T018 [US1] Build launcher: local open/close UI state, `fixed end-4 bottom-4`, Escape closes, focus moves to prompt, distinct from nav wheel `end-4 top-4` in `features/about-me-chat/components/about-me-chat-launcher.tsx`
- [X] T019 [US1] Reject empty/whitespace send in the hook using `chat-message-rules.ts` without calling the API in `features/about-me-chat/hooks/use-about-me-chat.ts`
- [X] T020 [US1] Mount `<AboutMeChatLauncher />` from `@/features/about-me-chat` in `app/[locale]/page.tsx` (page wiring only)

**Checkpoint**: US1 independently demoable on localhost

---

## Phase 4: User Story 2 - Answer only questions about the owner (Priority: P1)

**Goal**: On-topic answers match the owner pack; off-topic and jailbreaks refused; missing pack facts say unknown

**Independent Test**: On-topic (role, projects, contact) match pack; off-topic (weather, code, other people, “ignore instructions”) refused; unknown fact not invented

### Implementation for User Story 2

- [X] T021 [P] [US2] Fill remaining public facts in `features/about-me-chat/model/owner-profile.ts` from `messages/en.json` / `messages/fa.json` experience and projects (no private data)
- [X] T022 [US2] Tighten `buildSystemPrompt` for mixed questions (owner part only or refuse unrelated) and jailbreaks in `features/about-me-chat/model/build-system-prompt.ts`
- [X] T023 [US2] Pass locale into POST body from the site locale in `features/about-me-chat/hooks/use-about-me-chat.ts`
- [X] T024 [US2] Add optional on-topic `Suggestion` chips from AI Elements in `features/about-me-chat/components/about-me-chat-panel.tsx`

**Checkpoint**: SC-003 / SC-004 / SC-010 can be run by hand

---

## Phase 5: User Story 3 - Rate limits with clear feedback (Priority: P1)

**Goal**: 10/hour and 30/day enforced on the server; 429 + wait copy; survives reload; remaining visible

**Independent Test**: 11th send in an hour blocked after reload; `GET /api/chat` shows `limited: true`; empty sends do not consume quota

### Implementation for User Story 3

- [X] T025 [US3] Enforce caps in POST before `streamText`: hour cap 10, day cap 30; 429 JSON `{ code: RATE_LIMITED, remainingHour, remainingDay, retryAfterSeconds, limited }` plus `Retry-After` in `features/about-me-chat/services/create-chat-route-handler.ts`
- [X] T026 [US3] Do not increment quota on 400 `INVALID_MESSAGE`; increment only when generation is accepted in `features/about-me-chat/services/create-chat-route-handler.ts`
- [X] T027 [US3] Fetch quota on panel open (`GET /api/chat`) and map 429 into i18n wait copy in `features/about-me-chat/hooks/use-about-me-chat.ts`
- [X] T028 [US3] Show remaining allowance and disable send when `limited` in `features/about-me-chat/components/about-me-chat-panel.tsx`
- [X] T029 [US3] Log only hashed visitor id, status, remaining quota — never message text — in `features/about-me-chat/services/create-chat-route-handler.ts`

**Checkpoint**: SC-005 / SC-009

---

## Phase 6: User Story 4 - Live replies in the visitor’s language (Priority: P2)

**Goal**: In-progress then finished reply; chrome/errors in en and fa

**Independent Test**: `/en` English chrome + live shimmer; `/fa` Persian chrome; reply completes in thread order

### Implementation for User Story 4

- [X] T030 [US4] Drive `Shimmer` (or equivalent AI Elements live state) when chat status is submitted/streaming in `features/about-me-chat/components/about-me-chat-panel.tsx`
- [X] T031 [US4] Wire all panel strings through `useTranslations("Chat")` in `features/about-me-chat/components/about-me-chat-panel.tsx` and `about-me-chat-launcher.tsx`
- [X] T032 [US4] Instruct the model via `buildSystemPrompt(locale)` to answer in English or Persian matching locale in `features/about-me-chat/model/build-system-prompt.ts`
- [X] T033 [US4] Surface `CHAT_UNAVAILABLE` / network errors with i18n copy without hiding the float control in `features/about-me-chat/hooks/use-about-me-chat.ts`

**Checkpoint**: SC-002 / SC-007

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Pages deploy, a11y, quickstart

- [X] T034 Document `NEXT_PUBLIC_CHAT_API_URL`, `AI_GATEWAY_API_KEY` / `VERCEL_AI_KEY`, `CHAT_MODEL`, `CHAT_ALLOWED_ORIGINS` in `.env.example` (no secret values)
- [X] T035 Pass `NEXT_PUBLIC_CHAT_API_URL` through GitHub Pages workflow env in `.github/workflows/deploy-github-pages.yml`
- [X] T036 Keyboard and screen-reader pass on launcher/panel (roles, labels, focus) in `features/about-me-chat/components/about-me-chat-launcher.tsx` and `about-me-chat-panel.tsx`
- [X] T037 Run `specs/001-portfolio-ai-chat/quickstart.md` local steps and fix gaps in `features/about-me-chat/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **US1 (Phase 3)**: After Phase 2 — MVP
- **US2 (Phase 4)**: After Phase 2; uses US1 panel (can follow US1)
- **US3 (Phase 5)**: After Phase 2; UI remaining-quota needs US1 panel
- **US4 (Phase 6)**: After US1 panel exists
- **Polish (Phase 7)**: After desired stories

### User Story Dependencies

- **US1 (P1)**: After Phase 2 only — MVP
- **US2 (P1)**: After US1 for UI; prompt/pack can start once T007–T008 exist
- **US3 (P1)**: Store exists in T009–T010; wire 429 after T013
- **US4 (P2)**: After US1

### Within Each User Story

- Models/rules before services
- Services before route
- Hook before panel
- Panel before page mount

### Parallel Opportunities

- T003 and T004
- T021 alongside T022 after pack exists
- US2 prompt work vs US3 server 429 after foundation, if two people: one owns `build-system-prompt.ts`, other `create-chat-route-handler.ts`

---

## Parallel Example: User Story 1

```text
After T016:
Task: T017 panel in features/about-me-chat/components/about-me-chat-panel.tsx
Task: T018 launcher in features/about-me-chat/components/about-me-chat-launcher.tsx
Then T019–T020 sequentially (hook + page)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 Setup
2. Phase 2 Foundation (API streams)
3. Phase 3 US1 (float + panel)
4. STOP and validate independent test
5. Then US2 topic lock, US3 limits, US4 i18n/live polish

### Incremental Delivery

1. Setup + Foundation → API ready
2. US1 → demo chat shell
3. US2 → about-me only
4. US3 → caps
5. US4 → live + fa
6. Polish → Pages URL + env

---

## Notes

- [P] = different files, no unfinished deps
- No test tasks (not requested)
- Do not log transcripts
- Do not add a second chat UI library
- Commit after each logical group

---

## Phase 8: Convergence

- [ ] T038 CRITICAL: Stop `app/api/chat/route.ts` from deep-importing `features/about-me-chat/services/create-chat-route-handler`; export the route factory from `features/about-me-chat/index.ts` and import that public API in the route per Constitution I (contradicts)
- [ ] T039 Consume rate-limit quota only after generation is actually accepted (not before `streamText` / Gateway auth-config failure) so a failed send that never reached the assistant does not decrement remaining in `features/about-me-chat/services/create-chat-route-handler.ts` per FR-013 (partial)
- [ ] T040 Keep server logs free of visitor/assistant message text when Gateway/`streamText` errors dump `requestBodyValues.prompt`; log only hashed visitor id, status, remaining, and generic codes via `logChatEvent` in `features/about-me-chat/services/create-chat-route-handler.ts` per FR-019 (partial)
