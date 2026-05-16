# Embeddings v0.1-beta

Status: recuperação híbrida observável no chat após TASK 030.

## O que existe

- Extensao `vector` habilitada no Supabase remoto.
- Colunas de embedding preparadas em `document_chunks`.
- Tipos TypeScript atualizados para refletir o schema.
- Provider local determinístico `mock-hash-embedding-v1`.
- Rota protegida `/api/documents/embeddings`.
- Rota protegida `/api/documents/vector-search`.
- Função SQL `match_document_chunks`.
- Botão "Gerar embeddings" em `/workspace/documents`.
- Bloco de diagnóstico no chat para respostas com metadados de recuperação.

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

## Geração atual

A TASK 028 gera embeddings locais determinísticos:

- provider: `mock`;
- modelo: `mock-hash-embedding-v1`;
- dimensão: 1536;
- custo externo: zero;
- chamadas externas: nenhuma.

Essa geração serve para validar persistência no pgvector e fluxo operacional.
Ela ainda não substitui embeddings reais de OpenAI ou outro provider.

## Fora do escopo

- Chamar OpenAI ou outro provider de embeddings.
- Criar RAG semantico.
- Substituir a busca lexical atual.
- Criar RAG semantico completo.

## Validação feita

- Migration aplicada no Supabase remoto.
- `supabase migration list` confirmou a migration local e remota.
- `pnpm lint`, `pnpm build` e `git diff --check` passaram.
- Em produção, uma fonte temporária foi criada com `chunkCount = 1` após a migration e removida ao final.
- Na TASK 028, uma fonte temporária foi criada, `/api/documents/embeddings` gerou 1 embedding com `embeddedCount = 1` e `failedCount = 0`, e a fonte foi removida ao final.
- Na TASK 029, uma fonte temporária com embedding foi recuperada por `/api/documents/vector-search`; o chat respondeu em modo híbrido com score lexical e similaridade vetorial; a fonte foi removida ao final.
- Na TASK 030, a UI de chat exibiu `hybrid-local · hybrid-lexical-vector-v1`, contagens lexical/vetorial e termos usados em uma resposta temporária; a conversa e a fonte temporária foram limpas ao final.
