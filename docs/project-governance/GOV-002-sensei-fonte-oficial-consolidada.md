# GOV-002 — Fonte Oficial Consolidada

## Fonte Oficial do Projeto

Em caso de conflito entre documentos, seguir esta precedência:

1. GOV-002 Fonte Oficial Consolidada
2. STR-001 Plano Oficial
3. OPS-001 Plano Operacional
4. GOV-005 Regras Operacionais
5. Documentação do repositório
6. Histórico de chat

## Estado oficial atual

- Nome: SENSEI Data Engineer Mentor
- Executor principal: Codex
- Assistência estratégica: ChatGPT
- Fase atual: v0.1-beta com embeddings mock gerados em pgvector
- Última task concluída: TASK 028
- Checkpoint atual: chunks pendentes podem receber embeddings locais determinísticos
- Próxima task: combinar busca lexical com busca vetorial sem remover fallback
- Bloqueio atual: quota/billing do Google Gemini para chamada real (`429 RESOURCE_EXHAUSTED`)
- Fallback operacional atual: provider mock
- Repositório GitHub: privado em `adrianogssouza/sensei-data-engineer-mentor`
- URL pública: `https://sensei-data-engineer-mentor.vercel.app`
- Supabase remoto: projeto `xazgvdegyapkacsijvqw`, migration `20260429132612` aplicada
- Acesso privado: `/workspace`, `/api/chat/*`, `/api/ai/*` e `/api/documents` protegidos quando `SENSEI_PRIVATE_ACCESS_PASSWORD` está configurada
- Fontes/documentos: cadastro manual implementado em `/workspace/documents`
- Ingestão inicial: `raw_content`, contagem de caracteres, hash e `ingested_at` implementados em `documents`
- Chunks: tabela `document_chunks` criada e preenchida automaticamente a partir de `raw_content`
- Busca: rota `/api/documents/search` e UI em `/workspace/documents` implementadas sobre chunks
- Chat com fontes: `/api/ai/chat` consulta chunks por termos da pergunta e passa trechos ao provider mock
- Ranking lexical: busca por frase e termos relevantes, com `matchedTerms`, contagens e score simples
- Embeddings: extensão `vector` habilitada e colunas de embedding preparadas em `document_chunks`
- Geração de embeddings: rota protegida `/api/documents/embeddings` usa `mock-hash-embedding-v1`
- Próxima implementação planejada: combinar busca lexical com busca vetorial mantendo fallback

## Objetivo principal 2026

Entregar MVP funcional e transformá-lo em ativo de carreira.

## Regra de alinhamento

Fontes do projeto, documentos do repositório e histórico operacional devem permanecer sincronizados.
