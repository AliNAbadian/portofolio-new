# Data Model: Portfolio About-Me Chat

## OwnerProfilePack

Curated facts. Source of truth for answers. Not loaded from the visitor’s DOM.

| Field | Type | Notes |
|-------|------|--------|
| name | `{ en: string, fa: string }` | Public name |
| role | `{ en: string, fa: string }` | Current role |
| location | `{ en: string, fa: string }` | City/country as on site |
| languages | `{ en: string, fa: string }` | Spoken languages |
| contact | `{ email: string, phone?: string, linkedin?: string }` | Public only |
| about | `{ en: string, fa: string }` | Short bio |
| experience | `ExperienceEntry[]` | Title, company, period, summary, highlights |
| projects | `ProjectEntry[]` | Name, description, tags, optional public url |
| skills | `string[]` | Public skill labels |

**Validation**: No private addresses, unpublished salary, or secrets. Pack MUST stay aligned with site copy when resume facts change.

## ChatMessage (client only)

UIMessage from `ai`. Roles: `user` | `assistant` | `system` (system not shown). Text parts only in v1. Held in `useChat` memory for the tab/visit. Never written to the server store.

## VisitorRateLimit

Server memory, keyed by `visitorId` (cookie) and optionally `ipKey`.

| Field | Type | Notes |
|-------|------|--------|
| visitorId | string | Cookie `about_me_chat_vid` |
| hourHits | `number[]` | Unix ms of accepted sends in last 3600s |
| dayHits | `number[]` | Unix ms of accepted sends in last 86400s |

**Rules** (pure, `model/chat-limits.ts`):

- Hour cap 10, day cap 30 (rolling).
- Empty/whitespace or over-length message: reject, do not record a hit.
- After prune, if `hourHits.length >= 10` or `dayHits.length >= 30` → blocked.
- `retryAfterSeconds` = time until the oldest blocking hit falls out of its window.

## ChatRequest

| Field | Type | Notes |
|-------|------|--------|
| messages | `UIMessage[]` | Required, non-empty after client send |
| locale | `"en" \| "fa"` | Site language; default `en` |

**Validation** (`model/chat-message-rules.ts`):

- `messages` is an array.
- Last user text required, trim length 1–2000.
- Locale in `{en, fa}`.
- History truncated to last 12 messages before model call.

## ChatQuotaView

Returned on GET and on 429 JSON.

| Field | Type |
|-------|------|
| remainingHour | number |
| remainingDay | number |
| retryAfterSeconds | number \| null |
| limited | boolean |

## State transitions (panel)

```text
closed → open (launcher)
open → closed (close / Escape)
idle → submitting → streaming → idle
idle → submitting → error (retry allowed if not limited)
idle → limited (429)
```

Server has no conversation state machine.
