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
- Geração automática de chunks simples quando há conteúdo bruto.
- Busca lexical/local sobre chunks.

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

Registros sem conteúdo entram como `pending`.

Registros com conteúdo bruto entram como `ready` e recebem:

- texto em `raw_content`;
- contagem em `content_char_count`;
- hash SHA-256 em `content_hash`;
- timestamp em `ingested_at`.

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

## Fora do escopo

- Upload físico de arquivos.
- Storage de arquivos.
- Parsing de PDF/HTML/Markdown.
- Embeddings.
- pgvector.
- RAG.
- Busca semântica.
- Integração da busca com o chat.
