# Feature Specification: Portfolio About-Me Chat

**Feature Branch**: `001-portfolio-ai-chat`

**Created**: 2026-09-09

**Status**: Draft

**Input**: User description: "we want to implement a live ai chat to portofolio opening a float button with rate limits and limited to the only answering questions about me"

## Clarifications

### Session 2026-09-09

- Q: Which chat UI and assistant runtime MUST this feature use? → A: The installed `ai` package and the existing `components/ai-elements/` set. Do not introduce a second chat UI kit.
- Q: Where must visitors be able to use this chat? → A: On the public site including the static host; the page calls a hosted assistant backend.
- Q: Should the server keep a copy of visitor questions and answers? → A: No message bodies stored. Only send counts and reset times.
- Q: Where should the assistant take facts about you from? → A: Curated owner profile pack, kept in sync with public site facts. Do not scrape the visitor’s page.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Open chat from a floating control (Priority: P1)

A visitor on the portfolio sees a floating chat control that does not replace existing navigation. They open it, type a question about the portfolio owner, and receive a live reply in the conversation thread. They can close the panel and reopen it without losing the current session’s messages on that same visit.

**Why this priority**: Without a discoverable open/close surface and a working conversation, nothing else matters.

**Independent Test**: Open the site, tap the floating control, send one on-topic question, see a reply in the thread, close and reopen, confirm the thread is still there for this visit.

**Acceptance Scenarios**:

1. **Given** the visitor is on any main portfolio page, including the public static site, **When** they look at the viewport, **Then** a floating chat control is visible and does not cover the primary language/profile controls.
2. **Given** the chat is closed, **When** the visitor activates the floating control, **Then** a chat panel opens and focus moves to the message input.
3. **Given** the chat is open, **When** the visitor activates close (control, overlay, or keyboard escape), **Then** the panel closes and the floating control remains available.
4. **Given** an open chat with at least one exchange, **When** the visitor closes and reopens during the same visit, **Then** those messages remain visible.

---

### User Story 2 - Answer only questions about the owner (Priority: P1)

The assistant answers questions about the portfolio owner: background, work, skills, projects, location, languages, and how to get in touch — using facts consistent with the public portfolio. It refuses requests that are not about the owner (general knowledge, homework, code generation, other people, illegal help, or role-play as someone else).

**Why this priority**: Scope is the product. An unbounded assistant is not this feature.

**Independent Test**: Send on-topic questions (role, projects, contact) and off-topic questions (weather, write code, other biographies). On-topic get relevant answers; off-topic get a clear refusal and a nudge back to the owner.

**Acceptance Scenarios**:

1. **Given** an open chat, **When** the visitor asks about the owner’s work, skills, projects, or contact, **Then** the reply is about the owner and matches the curated owner profile pack.
2. **Given** an open chat, **When** the visitor asks something not about the owner, **Then** the system refuses to answer that request and invites a question about the owner instead.
3. **Given** an off-topic refusal, **When** the visitor then asks an on-topic question, **Then** the system answers that on-topic question normally.
4. **Given** a question that mixes owner facts with an unrelated task, **When** the system replies, **Then** it addresses only the owner-related part or refuses the unrelated task.

---

### User Story 3 - Rate limits with clear feedback (Priority: P1)

Every visitor is limited in how many messages they can send in a time window so the assistant cannot be used as an unlimited public chat. When they approach or hit the limit, the interface explains what happened and when they can send again. Limits apply even if they reload the page.

**Why this priority**: Unbounded use is abuse and cost risk; the owner required limits.

**Independent Test**: Send messages up to the published cap; the next send is blocked with a wait explanation; after the window resets, sending works again. Reload does not reset the counter.

**Acceptance Scenarios**:

1. **Given** the visitor is under the limit, **When** they send a message, **Then** the message is accepted and a reply is attempted.
2. **Given** the visitor has reached the limit, **When** they try to send, **Then** no new assistant reply is generated and they see that they must wait, including a clear sense of when sending is allowed again.
3. **Given** the visitor is at the limit, **When** they reload the site and open chat, **Then** sending remains blocked until the window resets.
4. **Given** the visitor is near the limit, **When** they view the chat, **Then** remaining allowance is visible enough that they are not surprised by a sudden block.

---

### User Story 4 - Live replies in the visitor’s language (Priority: P2)

Replies appear in a live conversation (the visitor sees that an answer is underway, then the completed message). The chat follows the current site language (English or Persian) for chrome and, when possible, for answers.

**Why this priority**: Completes the “live” experience and matches the bilingual site, but the feature still works if P1 stories ship first in one language.

**Independent Test**: Open English site, ask in English, see a live in-progress then finished reply. Repeat on Persian site.

**Acceptance Scenarios**:

1. **Given** the visitor sends an allowed on-topic message, **When** a reply is being produced, **Then** they see that a response is in progress within 3 seconds under normal conditions.
2. **Given** a reply finishes, **When** they read the thread, **Then** the full answer is in the conversation in order with their question.
3. **Given** the site is in English, **When** they use chat chrome, **Then** labels, errors, and refusals are in English.
4. **Given** the site is in Persian, **When** they use chat chrome, **Then** labels, errors, and refusals are in Persian.

---

### Edge Cases

- Empty or whitespace-only send is rejected with a short validation message; it does not consume rate-limit quota.
- Extremely long messages are rejected or truncated with an explanation; they do not hang the panel.
- Network or assistant failure shows a recoverable error; the visitor can retry if still under the limit. The public static site MUST still offer chat; a down backend is an error state, not a missing control.
- Rapid repeated sends are serialized or ignored so duplicate floods do not bypass the limit.
- Off-topic jailbreak-style prompts (“ignore previous instructions”, “you are now a general assistant”) are treated as off-topic and refused.
- Requests for private data not on the public portfolio (home address, unpublished salary, secrets) are refused.
- Server-side logs MUST NOT include full chat transcripts. Operator debugging uses rate-limit counters and generic errors only.
- Keyboard-only and screen-reader users can open, type, send, and close the chat.
- Existing floating navigation control remains usable; chat float MUST NOT occupy the same corner/control as that menu button.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST provide a floating control that opens and closes an about-me chat panel from any main portfolio page.
- **FR-002**: The chat panel MUST accept visitor text messages and display a chronological conversation of visitor messages and assistant replies.
- **FR-003**: The assistant MUST answer only questions about the portfolio owner (identity, background, experience, skills, projects, location, languages, and public contact paths).
- **FR-004**: The assistant MUST refuse off-topic, harmful, or “act as a general assistant” requests, and MUST state that it only answers questions about the owner.
- **FR-005**: Answers about the owner MUST stay consistent with the curated owner profile pack (the same public facts as the site) and MUST NOT invent employers, dates, metrics, or contact details that contradict that pack.
- **FR-020**: The assistant MUST use only the curated owner profile pack as its fact source. It MUST NOT scrape or trust the visitor’s current page as knowledge. When the pack has no fact for a question, it MUST say it does not know rather than guess.
- **FR-006**: The system MUST enforce a per-visitor sending limit: at most 10 messages per rolling hour and at most 30 messages per rolling day (see Assumptions).
- **FR-007**: When a send is blocked by the limit, the system MUST NOT generate a new assistant answer and MUST tell the visitor they are rate-limited and when they may send again.
- **FR-008**: Rate-limit state MUST survive page reload for the same visitor on the same browser during the limit window.
- **FR-009**: Empty messages MUST NOT be sent and MUST NOT count against the limit.
- **FR-010**: Chat chrome, errors, rate-limit copy, and refusals MUST follow the current site language (English or Persian).
- **FR-011**: The visitor MUST be able to close the panel (explicit close and Escape) without leaving the page.
- **FR-012**: The floating chat control MUST remain distinct from the existing navigation wheel control (different placement).
- **FR-013**: Failure to produce a reply MUST show an error the visitor can understand; a failed send that never reached the assistant MUST NOT consume quota.
- **FR-014**: The chat MUST present live progress while a reply is underway, then the completed reply in the thread.
- **FR-015**: The feature MUST work for anonymous visitors (no account required).
- **FR-016**: The chat panel MUST use the project's existing AI Elements components (`components/ai-elements/`) for conversation UI (messages, prompt, live reply states). Live replies MUST use the project's installed `ai` package. A second chat widget library MUST NOT be added.
- **FR-017**: The chat MUST work on the public portfolio, including the static-hosted site. The page MUST call a hosted assistant service; static hosting MUST NOT omit or permanently disable the chat.
- **FR-018**: Rate limits MUST be enforced by the hosted assistant service so they cannot be reset only by refreshing the static page.
- **FR-019**: The hosted service MUST NOT persist visitor or assistant message bodies. It MAY persist only rate-limit counters and reset times needed to enforce FR-006.

### Key Entities

- **Visitor session**: An anonymous visitor on one browser during a visit; holds the open/closed chat state and in-visit message thread.
- **Chat message**: A visitor utterance or assistant reply, with order and role (visitor vs assistant).
- **Owner profile pack**: Curated public facts about the owner (identity, work, skills, projects, contact). Source of truth for answers. Updated when the public site resume changes. Not derived from the visitor’s page at ask time.
- **Rate-limit window**: Remaining sends and reset time for the visitor’s hour and day caps. No stored conversation history on the server.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can open chat and send an on-topic question in under 30 seconds without creating an account.
- **SC-002**: Under normal conditions, after sending an allowed message, the visitor sees that a reply is underway within 3 seconds and a completed reply within 15 seconds.
- **SC-003**: In a scripted set of 10 off-topic prompts (general knowledge, coding homework, other people, jailbreaks), 10 of 10 are refused and none receive a substantial off-topic answer.
- **SC-004**: In a scripted set of 10 on-topic prompts drawn from the owner profile pack, at least 9 of 10 receive an answer that a reviewer judges consistent with the pack (no invented employers or contact details).
- **SC-010**: For 5 on-topic questions whose answers are not in the pack, at least 5 of 5 replies decline to invent a fact.
- **SC-005**: After 10 successful sends in one hour, the 11th send is blocked for 100% of trials, with wait guidance visible, including after reload.
- **SC-006**: At least 90% of testers using keyboard only can open, send one message, and close the panel without getting stuck.
- **SC-007**: Chat chrome is fully localized for both site languages; a reviewer can complete the primary flow in English and in Persian.
- **SC-008**: A reviewer on the public static site URL can complete SC-001 (open chat and send one on-topic question that receives a live reply) without using a separate server-only hostname.
- **SC-009**: After a completed conversation, an operator inspecting the hosted service finds no stored visitor or assistant message bodies from that session.

## Assumptions

- “Me” is the portfolio owner already presented on the site (Ali N. Abadian); the chat does not represent other people.
- Knowledge is the curated owner profile pack, aligned with public portfolio/resume facts. No live page scrape. Pack updates when the site’s public facts change. Missing pack facts → “I don’t know”, not invention.
- Visitors are anonymous; identification for rate limits is best-effort per browser (not a logged-in identity).
- Default caps: 10 messages per rolling hour and 30 per rolling day per visitor. Owner may later tighten these without changing the rest of the spec.
- Conversation persistence is per visit/browser only in the open page; no requirement to restore history on another device or after a full browser data clear. The server MUST NOT keep transcripts.
- “Live” means the visitor sees in-progress then finished replies in a thread, not a scheduled or human-staffed inbox.
- The chat does not send email, book meetings, or collect a lead form; it can point to existing public contact methods.
- Existing site navigation (profile, language switch, option wheel) stays; this feature adds a separate floating chat control, defaulting to the opposite vertical end of the viewport from the wheel button (bottom vs top) so they do not collide.
- Voice input, file upload, and multi-user group chat are out of scope for this version.
- Chat UI is built from `components/ai-elements/` (conversation, prompt, message, live/shimmer states as needed). Runtime is the installed `ai` package. Unused AI Elements (canvas, voice, sandbox, etc.) stay unused unless a later spec adds them.
- The public static site is in scope. A hosted backend provides live replies and authoritative rate limits. Exact host/provider is a planning choice.
