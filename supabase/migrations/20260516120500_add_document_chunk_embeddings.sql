-- Add pgvector foundation for future semantic search over document chunks.
--
-- This prepares storage for embeddings but intentionally does not generate
-- embeddings, call external AI providers, create RAG, or add vector search APIs.

create extension if not exists vector with schema extensions;

alter table public.document_chunks
add column embedding extensions.vector(1536),
add column embedding_provider text,
add column embedding_model text,
add column embedding_status text not null default 'pending',
add column embedding_error text,
add column embedded_at timestamptz;

alter table public.document_chunks
add constraint document_chunks_embedding_status_check
check (embedding_status in ('pending', 'ready', 'error', 'skipped'));

create index document_chunks_embedding_status_idx
on public.document_chunks (embedding_status);

create index document_chunks_embedding_model_idx
on public.document_chunks (embedding_provider, embedding_model);
