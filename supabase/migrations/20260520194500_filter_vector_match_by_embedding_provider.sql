-- Filter vector matches by embedding provider/model.
--
-- This prevents mixed embedding spaces when switching from mock embeddings to a
-- real provider such as OpenAI.

drop function if exists public.match_document_chunks(extensions.vector, integer);

create or replace function public.match_document_chunks(
  query_embedding extensions.vector(1536),
  match_count integer default 5,
  embedding_provider_filter text default null,
  embedding_model_filter text default null
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
set search_path = ''
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
    and (
      embedding_provider_filter is null
      or document_chunks.embedding_provider = embedding_provider_filter
    )
    and (
      embedding_model_filter is null
      or document_chunks.embedding_model = embedding_model_filter
    )
  order by document_chunks.embedding operator(extensions.<=>) query_embedding
  limit least(greatest(match_count, 1), 25);
$$;
