# SENSEI Data Engineer Mentor

SENSEI Data Engineer Mentor is a personal AI study mentor for Data Engineering. It is being built incrementally as both a useful study tool and a technical portfolio project.

## Current Phase

Current phase: v0.1-alpha preparation.

The repository has the initial Next.js foundation, governance documentation, Supabase client foundation, a minimal Supabase Auth foundation, an initial local Supabase data schema, a workspace navigation shell, and a local mock chat UI with browser-only persistence. The current operational mode is single-user/private, so auth exists but is optional and not part of the main daily flow. Real AI providers, RAG, upload, pgvector, Supabase chat persistence, shadcn/ui, and deployment are not implemented yet.

## Operational Mode

Current mode: Single-user / private.

Recommended local usage starts at `/workspace`. The public homepage links to the workspace, login, signup, and the protected dashboard. Auth remains available in the codebase for future use, but it is not required to use the main workspace right now.

## Workspace Routes

Available workspace routes:

- `/workspace` - public workspace overview
- `/workspace/chat` - local mock chat UI
- `/workspace/documents` - documents module placeholder
- `/workspace/usage` - usage/cost placeholder
- `/workspace/settings` - private settings placeholder

The chat page currently uses deterministic local mock responses only. Messages persist in this browser using `localStorage`. It does not connect to Supabase, read or write cloud data, call AI providers, upload files, or run RAG. There is no AI cost, no cloud sync, and no Supabase persistence yet.

## Tech Stack Currently Installed

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- ESLint
- pnpm
- Supabase JavaScript SDK
- Supabase SSR helpers
- Minimal Supabase Auth foundation
- Supabase local schema/migration foundation

## Planned Stack Not Yet Installed

- pgvector
- OpenAI embeddings
- Anthropic Claude
- Vercel deployment
- RAG ingestion and evaluation tooling

## Local Development

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Run lint:

```bash
pnpm lint
```

Build for production:

```bash
pnpm build
```

## Local Environment

Create `.env.local` locally when Supabase credentials are available. Do not commit it.

Required for Supabase client usage:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Authentication foundation is implemented with email/password login, signup, logout, and a protected dashboard route. It is currently optional because the app is operating in single-user/private mode. To test auth locally:

1. Create a Supabase project.
2. Enable email/password auth in Supabase Auth settings.
3. Add the public project URL and anon key to `.env.local`.
4. Run `pnpm dev`.
5. Visit `/signup`, `/login`, and `/dashboard`.

No service role key is used by the auth UI/server flows.

## Supabase Local Schema

The local Supabase structure exists under `supabase/`, with migrations in:

```bash
supabase/migrations
```

Inspect migrations:

```bash
ls supabase/migrations
```

Do not start Supabase local services unless a task explicitly requires it. This task did not start Docker, did not apply migrations to a local database, and did not apply anything to a remote Supabase project.

The initial schema is single-user/private and includes app settings, future chat history tables, usage events, and document metadata. It does not include `pgvector`, `document_chunks`, embeddings, RAG tables, user ownership columns, or RLS policies yet.

## Project Structure

```text
docs/
  architecture.md
  development.md
  task-log.md
  project-governance/
src/
  app/
    (auth)/
    (protected)/
    workspace/
  components/
    workspace/
  lib/
  types/
```

- `docs/project-governance/` contains official governance, strategy, status, and decision-log documents.
- `src/app/` contains the Next.js App Router foundation.
- `src/app/(auth)/` contains minimal login/signup pages and auth actions.
- `src/app/(protected)/dashboard/` contains a minimal protected dashboard.
- `src/app/workspace/` contains the public primary daily-use workspace placeholder.
- `src/app/workspace/*` contains the workspace shell and placeholder routes.
- `src/components/workspace/` contains simple reusable workspace shell components.
- `src/lib/env.ts` contains environment validation helpers.
- `src/lib/supabase/` contains the browser/server Supabase client foundation and placeholder database types.
- `src/proxy.ts` refreshes Supabase auth cookies and protects `/dashboard`.
- `src/components/` and `src/types/` are placeholders for future shared code.
- `supabase/migrations/` contains local database migrations that have not been applied remotely by this repo.

## Completed Tasks

- TASK 000 - Initial bootstrap and environment audit
- TASK 000.1 - Fix local tooling blockers
- TASK 000.2 - Synchronize official project documentation into the repository
- TASK 001 - Create initial Next.js project structure
- TASK 002 - Normalize repository documentation and Codex instructions
- TASK 003 - Supabase Foundation
- TASK 004 - Supabase Auth Foundation
- TASK 004.1 - Switch to Single-User Mode
- TASK 005 - Local Data Foundation
- TASK 006 - Workspace Shell + Navigation
- TASK 007 - Local Chat Mock
- TASK 008 - Local Chat Persistence

## Next Task

TASK 009

## Secrets

Never commit secrets to git. Use `.env.local` only for local secrets and keep real keys out of version control. `.env.example` must contain placeholders only.
