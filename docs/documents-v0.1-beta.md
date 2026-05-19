# Documentos v0.1-beta

Status: iniciado na TASK 021.

## O que existe

- API protegida `/api/documents`.
- Tela `/workspace/documents`.
- Cadastro manual de fontes/documentos com:
  - título;
  - tipo;
  - referência;
  - notas;
  - conteúdo bruto manual.
- Listagem de fontes cadastradas.
- Remoção de fontes cadastradas.
- Edição básica de fontes cadastradas.
- Contadores e filtros por status de ingestão.
- Geração automática de chunks simples quando há conteúdo bruto.
- Reprocessamento de chunks por documento a partir de `raw_content`.
- Reprocessamento em lote de fontes com conteúdo alterado.
- Busca lexical/local sobre chunks.
- Uso dos chunks recuperados no chat mock.
- Ranking lexical/local v2 com termos encontrados e score simples.
- Fundação de embeddings nos chunks com status `pending`.
- Geração mock de embeddings para chunks pendentes.
- Busca vetorial direta e recuperação híbrida no chat mock.

## Banco usado

A funcionalidade usa a tabela `documents` criada na migration inicial.

Campos usados nesta etapa:

- `title`
- `source_type`
- `source_path`
- `ingestion_status`
- `metadata.notes`
- `raw_content`
- `content_char_count`
- `content_hash`
- `ingested_at`
- `chunk_count`

Chunks são armazenados em `document_chunks` com:

- `document_id`
- `chunk_index`
- `content`
- `char_count`
- `metadata`
- `embedding`
- `embedding_provider`
- `embedding_model`
- `embedding_status`
- `embedding_error`
- `embedded_at`

Resultados de busca retornam metadados calculados em runtime:

- `score`
- `matchedTerms`
- `phraseMatches`
- `termMatches`

Registros sem conteúdo entram como `pending`.

Registros com conteúdo bruto entram como `ready` e recebem:

- texto em `raw_content`;
- contagem em `content_char_count`;
- hash SHA-256 em `content_hash`;
- timestamp em `ingested_at`.

Quando o conteúdo bruto de uma fonte existente é editado:

- chunks antigos são removidos;
- `chunk_count` volta para `0`;
- `ingestion_status` passa para `needs_reprocess`;
- `ingested_at` volta para `null`.

## Tipos aceitos

- `manual`
- `url`
- `file_reference`

## Validação feita

- `/api/documents` sem senha retornou `401`.
- `/workspace/documents` sem senha retornou `401`.
- Com credencial válida, uma fonte de teste foi criada.
- A fonte apareceu na listagem.
- A fonte foi removida.
- A lista final ficou vazia após a limpeza.
- Na TASK 022, uma fonte manual com conteúdo bruto foi criada, listada com `ready`, `contentCharCount` e `contentHash`, removida, e a lista final voltou a ficar vazia.
- Na TASK 023, uma fonte manual com conteúdo bruto foi criada com `chunkCount = 1`; a tabela `document_chunks` confirmou o chunk; a fonte foi removida e os chunks foram removidos por cascade.
- Na TASK 024, uma fonte temporária foi criada, buscas por `window` e `cliente` retornaram o chunk esperado, e a limpeza final deixou documentos e resultados vazios.
- Na TASK 025, uma fonte temporária sobre `window functions` foi criada; o chat mock recuperou o chunk e respondeu citando a fonte; a fonte foi removida ao final.
- Na TASK 026, a recuperação foi validada com múltiplos termos, score lexical e termos encontrados visíveis na resposta do chat mock.
- Na TASK 027, a migration de embeddings foi aplicada; uma fonte temporária continuou criando `chunkCount = 1`; a fonte foi removida ao final.
- Na TASK 028, uma fonte temporária teve 1 embedding gerado com provider mock e foi removida ao final.
- Na TASK 029, uma fonte temporária com embedding foi recuperada por busca vetorial e usada pelo chat em modo híbrido; a fonte foi removida ao final.
- Na TASK 035, foi adicionada rota protegida e ação de UI para reprocessar uma fonte e regenerar seus chunks a partir do conteúdo bruto salvo.
- Na TASK 036, foi adicionada edição básica de documento existente com invalidação segura de chunks quando o conteúdo bruto muda.
- Na TASK 037, foram adicionados contadores e filtros de status para listar fontes prontas, pendentes e que precisam reprocessar.
- Na TASK 038, foi adicionada ação de UI para reprocessar em lote a fila de fontes com `needs_reprocess`.
- Na TASK 039, foi adicionada visão da fila de embeddings com contadores por status de chunk.
- Na TASK 042, foi adicionado health documental com status de banco, fontes, chunks e pendências de embeddings.
- Na TASK 043, o health documental também passou a aparecer no overview do workspace.

## Fora do escopo

- Upload físico de arquivos.
- Storage de arquivos.
- Parsing de PDF/HTML/DOCX.
- Embeddings reais via provider externo.
- RAG semântico com resposta generativa real sobre fontes.
- Histórico/versionamento de edições.
