-- Add first-stage text chunks for manually ingested document content.
--
-- This intentionally does not add embeddings, pgvector, semantic search, or RAG.

alter table public.documents
add column chunk_count integer not null default 0;

alter table public.documents
add constraint documents_chunk_count_check
check (chunk_count >= 0);

create table public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  chunk_index integer not null,
  content text not null,
  char_count integer not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint document_chunks_chunk_index_check
    check (chunk_index >= 0),
  constraint document_chunks_char_count_check
    check (char_count > 0),
  constraint document_chunks_document_id_chunk_index_key
    unique (document_id, chunk_index)
);

create index document_chunks_document_id_chunk_index_idx
on public.document_chunks (document_id, chunk_index);
