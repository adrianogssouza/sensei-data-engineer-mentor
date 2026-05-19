# Embeddings v0.1-beta

Status: recuperação híbrida observável e avaliada com filtros, edição, reprocessamento em lote e fila de embeddings após TASK 039.

## O que existe

- Extensao `vector` habilitada no Supabase remoto.
- Colunas de embedding preparadas em `document_chunks`.
- Tipos TypeScript atualizados para refletir o schema.
- Provider local determinístico `mock-hash-embedding-v1`.
- Rota protegida `/api/documents/embeddings`.
- Rota protegida `/api/documents/vector-search`.
- Função SQL `match_document_chunks`.
- Botão "Gerar embeddings" em `/workspace/documents`.
- Contadores da fila de embeddings em `/workspace/documents`.
- `GET /api/documents/embeddings` para consultar total, pendentes, prontos, erro e skipped.
- Bloco de diagnóstico no chat para respostas com metadados de recuperação.
- Eval manual em `/workspace/documents` para validar o topo do ranking híbrido.
- Dataset padrão versionado em `src/lib/documents/retrieval-eval-dataset.json`.
- Fixtures versionadas em `src/lib/documents/retrieval-eval-fixtures.json`.
- Importação textual simples de `.txt`, `.md` e `.markdown` em `/workspace/documents`.
- Edição básica de documentos em `/workspace/documents`.
- Filtros de status de documentos em `/workspace/documents`.
- Reprocessamento individual e em lote de chunks em `/workspace/documents`.

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

## Fila atual

A TASK 039 tornou a fila de embeddings visível:

- `GET /api/documents/embeddings` resume chunks por `embedding_status`.
- A UI mostra total, pendentes, prontos, erro e skipped.
- O botão "Atualizar fila" recarrega a visão sem gerar embeddings.
- O `POST /api/documents/embeddings` devolve a fila atualizada após processar chunks pendentes.

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
- Na TASK 031, uma fonte temporária com embedding foi avaliada pelo novo eval manual e passou com o chunk esperado no topo; a fonte foi removida ao final.
- Na TASK 032, fontes temporárias compatíveis com o dataset padrão foram criadas, receberam embeddings mock, o dataset passou 3/3 e as fontes foram removidas ao final.
- Na TASK 033, as fixtures versionadas foram carregadas pela UI/API, receberam embeddings mock e o dataset padrão passou 3/3 em produção.
- Na TASK 034, a UI de documentos passou a importar arquivo textual local para preencher `rawContent`; `pnpm lint`, `pnpm build` e deploy foram validados.
- Na TASK 035, a UI/API passou a reprocessar documentos, recriando chunks e deixando embeddings pendentes para nova geração.
- Na TASK 036, editar `rawContent` passou a invalidar chunks antigos e exigir reprocessamento antes de gerar embeddings novamente.
- Na TASK 037, a UI passou a mostrar contadores e filtros para identificar documentos prontos, pendentes e a reprocessar.
- Na TASK 038, a UI passou a reprocessar em lote a fila `needs_reprocess` antes de gerar embeddings novamente.
- Na TASK 039, a API/UI passaram a exibir a fila de embeddings por status de chunk.
