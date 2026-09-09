# Contract: About-me chat HTTP

Base path: `{CHAT_API_ORIGIN}/api/chat`

`CHAT_API_ORIGIN` is empty (same origin) in local/Docker unless overridden. On GitHub Pages it is the standalone host origin.

Cookie: `about_me_chat_vid` (HttpOnly). Set on GET or POST if missing.

CORS: allowlisted origins, `Access-Control-Allow-Credentials: true`, methods `GET, POST, OPTIONS`, headers `Content-Type`.

## OPTIONS /api/chat

Preflight. 204. No body.

## GET /api/chat

Quota only. No generation. Does not increment counters.

**Response 200** `application/json`:

```json
{
  "remainingHour": 10,
  "remainingDay": 30,
  "retryAfterSeconds": null,
  "limited": false
}
```

## POST /api/chat

**Request** `application/json`:

```json
{
  "messages": [
    {
      "id": "msg_1",
      "role": "user",
      "parts": [{ "type": "text", "text": "What do you work on?" }]
    }
  ],
  "locale": "en"
}
```

`DefaultChatTransport` may send this shape (UIMessage list). Handler MUST accept `{ messages, locale? }`.

**Response 200**: UI message stream (`text/plain` UI stream / SSE as produced by `createUIMessageStreamResponse`). Headers include remaining quota.

**Response 400** `application/json`:

```json
{ "code": "INVALID_MESSAGE", "message": "…" }
```

Does not consume quota.

**Response 429** `application/json`:

```json
{
  "code": "RATE_LIMITED",
  "remainingHour": 0,
  "remainingDay": 12,
  "retryAfterSeconds": 1800,
  "limited": true
}
```

No assistant stream. `Retry-After` header = `retryAfterSeconds`.

**Response 500** `application/json`:

```json
{ "code": "CHAT_UNAVAILABLE", "message": "…" }
```

Quota: do not increment if the request never reached generation (auth/config missing before accept). If generation starts then fails, increment is allowed (attempt used).

## Client mapping

`useChat({ transport: new DefaultChatTransport({ api, credentials: 'include', body: { locale } }) })`.

429/400: hook `onError`; panel shows i18n copy and remaining wait from JSON when present.
