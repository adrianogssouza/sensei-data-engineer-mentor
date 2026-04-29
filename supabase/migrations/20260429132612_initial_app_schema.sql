-- SENSEI initial app schema.
--
-- Current operational mode: single-user/private.
-- This schema intentionally does not include user_id columns or auth.uid() RLS
-- policies yet. If auth becomes the primary flow later, multi-user ownership,
-- user_id filtering, and RLS policies must be added in a future migration.
--
-- This migration also intentionally excludes pgvector, document_chunks, and
-- embedding columns. Those belong to later AI/RAG tasks.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.app_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Nova conversa',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz null
);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  role text not null,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint chat_messages_role_check
    check (role in ('user', 'assistant', 'system', 'tool'))
);

create table public.usage_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  provider text null,
  model text null,
  input_tokens integer null,
  output_tokens integer null,
  total_tokens integer null,
  cost_usd numeric(12, 6) null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source_type text not null default 'manual',
  source_path text null,
  content_hash text null,
  ingestion_status text not null default 'pending',
  ingestion_error text null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger app_settings_set_updated_at
before update on public.app_settings
for each row
execute function public.set_updated_at();

create trigger chat_threads_set_updated_at
before update on public.chat_threads
for each row
execute function public.set_updated_at();

create trigger documents_set_updated_at
before update on public.documents
for each row
execute function public.set_updated_at();

create index chat_messages_thread_id_created_at_idx
on public.chat_messages (thread_id, created_at);

create index usage_events_created_at_idx
on public.usage_events (created_at);

create index documents_ingestion_status_idx
on public.documents (ingestion_status);

create index documents_content_hash_idx
on public.documents (content_hash);
