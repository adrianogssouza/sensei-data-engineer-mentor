-- Add vector search RPC for document chunks.
--
-- This enables hybrid retrieval while keeping lexical fallback available.

create or replace function public.match_document_chunks(
  query_embedding extensions.vector(1536),
  match_count integer default 5
)
returns table (
  chunk_id uuid,
  document_id uuid,
  document_title text,
  chunk_index integer,
  content text,
  char_count integer,
  similarity double precision,
  created_at timestamptz
)
language sql
stable
as $$
  select
    document_chunks.id as chunk_id,
    document_chunks.document_id,
    documents.title as document_title,
    document_chunks.chunk_index,
    document_chunks.content,
    document_chunks.char_count,
    1 - (document_chunks.embedding operator(extensions.<=>) query_embedding) as similarity,
    document_chunks.created_at
  from public.document_chunks
  join public.documents
    on documents.id = document_chunks.document_id
  where document_chunks.embedding_status = 'ready'
    and document_chunks.embedding is not null
  order by document_chunks.embedding operator(extensions.<=>) query_embedding
  limit least(greatest(match_count, 1), 25);
$$;
