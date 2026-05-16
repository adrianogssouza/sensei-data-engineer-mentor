# Documentos v0.1-beta

Status: iniciado na TASK 021.

## O que existe

- API protegida `/api/documents`.
- Tela `/workspace/documents`.
- Cadastro manual de fontes/documentos com:
  - título;
  - tipo;
  - referência;
  - notas.
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

Todo novo registro entra com `ingestion_status = pending`.

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

## Fora do escopo

- Upload físico de arquivos.
- Storage de arquivos.
- Parsing de PDF/HTML/Markdown.
- Chunks.
- Embeddings.
- pgvector.
- RAG.
- Busca semântica.
