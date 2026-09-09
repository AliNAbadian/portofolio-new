# Quickstart: Portfolio About-Me Chat

Manual validation against [spec.md](./spec.md), [chat-http.md](./contracts/chat-http.md), and [data-model.md](./data-model.md).

## Prerequisites

- Bun + Node 20+
- `AVALAI_API_KEY` on the API process only (AvalAI, https://docs.avalai.ir/en/)
- Optional: `CHAT_MODEL` (default `gpt-4.1-nano-2025-04-14`), `AVALAI_BASE_URL`, `NEXT_PUBLIC_CHAT_API_URL`, `CHAT_ALLOWED_ORIGINS`

## Local (UI + API together)

```bash
bun install
bun dev
```

Open `http://localhost:3000/en`.

1. Confirm nav wheel stays top-end. Chat control is bottom-end.
2. Open chat (keyboard: focus control, Enter). Focus lands in the prompt.
3. Send an on-topic question (role, projects, contact). See shimmer/in-progress within 3s, then a reply matching the owner pack.
4. Send an off-topic question (weather, write a function). Expect refusal, no substantial answer.
5. Switch to `/fa`. Chrome is Persian. Repeat one on-topic send.
6. Close (Escape). Reopen: thread still visible.
7. Empty send: validation, quota unchanged (`GET /api/chat`).

## Quota

Send until 10 accepted messages in one hour. 11th POST returns 429 with wait copy. Reload the page; 12th still blocked. `GET /api/chat` shows `limited: true`.

## Static + hosted API (SC-008)

1. Run standalone/Docker with the API and `AVALAI_API_KEY`.
2. Build Pages with `GITHUB_PAGES=true` and `NEXT_PUBLIC_CHAT_API_URL=https://<api-host>/api/chat`.
3. Open the Pages URL `/en/`. Complete steps 2–4 above. DevTools: POST goes to the API host, not `github.io` `/api`.

## Privacy (SC-009)

After a chat, inspect API logs and process memory policy: no message text logged; rate-limit map has timestamps only.

## Expected failures

- Missing Gateway key: chat control still visible; send shows unavailable error, not a crash.
- API down from Pages: same unavailable error; control remains.
