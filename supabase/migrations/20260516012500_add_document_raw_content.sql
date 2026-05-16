-- Add first-stage manual content ingestion fields.
--
-- This does not add chunks, embeddings, pgvector, storage, upload, or RAG.
-- The goal is to store raw manually provided content so later tasks can split
-- and embed it safely.

alter table public.documents
add column raw_content text null,
add column content_char_count integer not null default 0,
add column ingested_at timestamptz null;

alter table public.documents
add constraint documents_content_char_count_check
check (content_char_count >= 0);
