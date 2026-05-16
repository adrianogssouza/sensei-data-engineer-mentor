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

## Fora do escopo

- Upload físico de arquivos.
- Storage de arquivos.
- Parsing de PDF/HTML/Markdown.
- Chunks.
- Embeddings.
- pgvector.
- RAG.
- Busca semântica.
