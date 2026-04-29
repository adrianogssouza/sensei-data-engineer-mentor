# Architecture

## Current Implemented Architecture

The project currently has the initial Next.js app foundation, a minimal Supabase foundation, a Supabase Auth foundation, a single-user/private operational flow, a local data foundation, a workspace shell, and a local chat mock with browser persistence:

- Next.js App Router under `src/app/`.
- TypeScript with strict mode enabled.
- Tailwind CSS for styling.
- ESLint for static checks.
- Import alias `@/*` mapped to `src/*`.
- Placeholder directories for `src/components/`, `src/lib/`, and `src/types/`.
- Environment validation helpers in `src/lib/env.ts`.
- Supabase browser/server client factory functions under `src/lib/supabase/`.
- Placeholder Supabase `Database` types prepared for future generated types.
- Supabase SSR cookie/session handling with `@supabase/ssr`.
- Minimal email/password auth actions for sign up, sign in, and sign out.
- Minimal login and signup pages under `src/app/(auth)/`.
- Minimal protected dashboard page under `src/app/(protected)/dashboard/`.
- Next.js proxy for auth cookie refresh and `/dashboard` protection.
- Public workspace route under `src/app/workspace/`.
- Public homepage that routes users to the workspace without login friction.
- Supabase local project structure under `supabase/`.
- Initial migration for `app_settings`, `chat_threads`, `chat_messages`, `usage_events`, and `documents`.
- Manual TypeScript `Database` type covering the initial tables.
- Workspace layout under `src/app/workspace/layout.tsx`.
- Workspace placeholder routes for chat, documents, usage, and settings.
- Simple workspace navigation/card components under `src/components/workspace/`.
- Local chat state and UI under `/workspace/chat`.
- Deterministic mock assistant responses in `src/lib/chat/mock-chat.ts`.
- Local chat persistence helper in `src/lib/chat/local-chat-storage.ts`.
- Chat UI components under `src/components/chat/`.

Supabase Auth Foundation exists, but the current operational mode is single-user/private. Auth can be re-enabled as the primary flow later. For now, `/workspace` is public and is the recommended daily-use route. The protected dashboard remains available for future authenticated flows.

Local Data Foundation is implemented as schema/migration/types only. No local Supabase services were started and no remote database was modified.

Workspace Shell is implemented as navigation and placeholder pages. Local Chat Mock is implemented as UI/state plus browser `localStorage` persistence. There is no Supabase read/write, API route, AI provider, RAG, upload, pgvector, streaming, or cloud chat persistence.

## Planned Architecture

The planned SENSEI architecture includes:

- pgvector for semantic search.
- Document ingestion for study materials.
- OpenAI embeddings for chunk indexing and retrieval.
- RAG for source-grounded tutor answers.
- Cost and token logging for model calls.
- Evaluation workflows for positive and negative RAG cases.

## Not Implemented Yet

The planned components above are not implemented yet. There is no pgvector extension, `document_chunks` table, embeddings column, AI SDK, document ingestion flow, RAG pipeline, eval runner, multi-user `user_id` ownership, RLS policy, Supabase chat persistence, or deployment configuration in the current repository state.
