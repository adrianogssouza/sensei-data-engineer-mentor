# Embeddings v0.1-beta

Status: fundacao iniciada na TASK 027.

## O que existe

- Extensao `vector` habilitada no Supabase remoto.
- Colunas de embedding preparadas em `document_chunks`.
- Tipos TypeScript atualizados para refletir o schema.

## Banco usado

A migration `20260516120500_add_document_chunk_embeddings.sql` adicionou:

- `embedding vector(1536)`
- `embedding_provider`
- `embedding_model`
- `embedding_status`
- `embedding_error`
- `embedded_at`

Status aceitos em `embedding_status`:

- `pending`
- `ready`
- `error`
- `skipped`

Chunks novos entram com `embedding_status = pending`.

## Fora do escopo

- Gerar embeddings.
- Chamar OpenAI ou outro provider de embeddings.
- Criar busca vetorial.
- Criar RAG semantico.
- Substituir a busca lexical atual.

## Validação feita

- Migration aplicada no Supabase remoto.
- `supabase migration list` confirmou a migration local e remota.
- `pnpm lint`, `pnpm build` e `git diff --check` passaram.
- Em produção, uma fonte temporária foi criada com `chunkCount = 1` após a migration e removida ao final.
