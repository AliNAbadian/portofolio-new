<!--
Sync Impact Report
- Version change: none (placeholders) → 1.0.0
- Modified principles: template placeholders replaced with project rules from `.cursor/rules/`
  - [PRINCIPLE_1_NAME] → I. Feature Ownership
  - [PRINCIPLE_2_NAME] → II. Presentation vs Logic
  - [PRINCIPLE_3_NAME] → III. Hook Cohesion
  - [PRINCIPLE_4_NAME] → IV. Domain Independence
  - [PRINCIPLE_5_NAME] → V. Kebab-Case Files
- Added sections: Feature Internals, Review Gates
- Removed sections: none (template slots filled)
- Follow-up TODOs: none
- Sources: `.cursor/rules/enterprise-feature-based-architecture.mdc`,
  `.cursor/rules/separate-logic-from-ui.mdc`,
  `.cursor/rules/react-hook-architecture.mdc`,
  `.cursor/rules/kebab-case.mdc`
-->

# Portfolio Constitution

## Core Principles

### I. Feature Ownership

A feature owns a business capability, not a UI widget. It owns its rules, API
integration, client state, domain types, feature UI, and workflows.

Dependency direction MUST be `app → features → shared`. Features MUST NOT
import each other's internals. `shared` MUST NEVER import feature business
logic. Cross-feature workflows belong in a composition/application layer.

Public API is `features/<feature>/index.ts`. Consumers MUST import capabilities
from that boundary, not deep paths. Empty folders and speculative layers
(`repositories/`, `useCases/`, `adapters/` without a demonstrated need) MUST
NOT be added.

Rationale: ownership and dependency direction keep the portfolio (and any
product-scale feature) change-isolatable.

### II. Presentation vs Logic

Pages and UI render. Hooks orchestrate. Services and model own I/O and rules.

Pages MAY compose hooks, pass props, and own layout. Pages MUST NOT fetch,
mutate, map DTOs, or run orchestration `useEffect`.

UI MAY hold local presentation state (open, hover, tab, draft that never
leaves the component). UI MUST NOT use `useQuery` / `useMutation` /
`useQueryClient`, HTTP clients, SignalR, store sync, or domain data
`useEffect`. If removing network, stores, or `useEffect` would break a `.tsx`
file, that logic MUST live in a hook.

Rationale: presentation stays replaceable; behavior stays testable.

### III. Hook Cohesion

Hooks are React/application boundaries, not file-extraction tools. Create a
hook only when the logic uses React state/effects/context, another hook, a
state/query library, or a meaningful use case.

Do NOT wrap pure calculations as `use*`. Do NOT create one giant
`useEverything()` hook. Do NOT split a cohesive use case into many
one-purpose hooks that are never reused independently. Cohesion matters more
than hook count. Internal hooks are allowed; the public feature API MUST stay
small.

Rationale: fat hooks and hook sprawl both hide ownership.

### IV. Domain Independence

Business rules MUST be framework-independent plain TypeScript: validate,
calculate, select, permission-check. They MUST be testable without rendering
React.

Server state belongs in the project's server-state library (TanStack Query when
used). Shared client state belongs in a feature store. URL/shareable state
belongs in the router. Local UI state stays in the component. Derived data
MUST be selectors or pure functions, not duplicated filters in multiple
components.

`useEffect` MUST NOT run business workflows. User actions MUST call explicit
commands. Effects are for synchronization (browser APIs, external libraries,
URL, subscriptions).

Rationale: rules outlive UI frameworks; hidden effect chains are unreviewable.

### V. Kebab-Case Files

All new files MUST use kebab-case names (example: `use-nav-option-wheel.ts`,
`portfolio-shell.tsx`). Filenames MUST name the responsibility. Generic dumps
(`utils.ts`, `helpers.ts`, `common.ts`, `misc.ts`) MUST NOT grow inside a
feature.

Rationale: matches `.cursor/rules/kebab-case.mdc` and keeps search/navigation
predictable.

## Feature Internals

Features MAY contain `pages/`, `components/`, `hooks/`, `services/`, `model/`,
`store/`, `lib/`, and `index.ts`. Not every directory is required; missing
empty folders is better than fake structure.

- Services: HTTP, DTO mapping, transport errors. No React. No UI.
- Model: types, rules, selectors, mappers, domain constants. Not a junk drawer.
- Feature `lib/`: feature-local helpers with explicit names.
- Shared code: only domain-agnostic infrastructure (`shared/ui`, `shared/api`,
  `shared/lib`). Duplication MAY stay until reuse is real.

State owner MUST be explicit: server, feature store, URL, local UI, or derived.
API DTOs MUST NOT leak through UI. Types describing business entities live in
the owning feature.

## Review Gates

Before merge or Spec Kit `/speckit.implement` completion, a change MUST answer:

1. Which feature owns this behavior?
2. Is this server, URL, client, local UI, or derived state?
3. Does it need React, or is it a plain function?
4. Does another feature import internals?
5. Does a workflow cross domains without a composition layer?

Code review MUST reject: `useEverything()`, business rules in `shared/`,
components calling APIs, features mutating another feature's store, `useEffect`
as a workflow engine, DTO leakage, and unbounded `utils.ts`.

Runtime editor enforcement remains `.cursor/rules/`. This constitution is the
Spec Kit governance copy of those rules. If they conflict, update both in the
same amendment.

## Governance

This constitution supersedes ad-hoc coding preference for Spec Kit plans,
tasks, and implementation. `.cursor/rules/` remains the always-applied editor
source of truth; amendments MUST keep both in sync.

Amendments MUST:

1. Update `.specify/memory/constitution.md` and the matching `.cursor/rules/`
   file when the rule is editor-enforced.
2. Bump version: MAJOR for removed or incompatible principles; MINOR for new
   or materially expanded principles; PATCH for clarification only.
3. Set `Last Amended` to the amendment date (ISO `YYYY-MM-DD`).
4. Record a Sync Impact Report at the top of this file.

Compliance: every PR and Spec Kit implementation MUST be reviewable against
the Core Principles. Complexity and new abstractions MUST have a demonstrated
need (multiple implementations, hard testing, real domain boundary, or team
ownership). Do not add enterprise folders because they are fashionable.

**Version**: 1.0.0 | **Ratified**: 2026-09-09 | **Last Amended**: 2026-09-09
