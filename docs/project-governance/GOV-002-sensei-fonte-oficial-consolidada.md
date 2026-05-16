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
- Fase atual: v0.1-beta com recuperação híbrida lexical + vetorial observável e avaliada por dataset/fixtures versionados
- Última task concluída: TASK 033
- Checkpoint atual: recuperação híbrida pode ser inspecionada no chat e testada contra dataset padrão com fontes fixture carregáveis
- Próxima task: decidir entre preparar embeddings reais, upload/parsing ou ampliar dataset/fixtures de evals
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
- Recuperação híbrida: `/api/ai/chat` usa ranking lexical + busca vetorial com fallback lexical
- Observabilidade da recuperação: mensagens do assistente podem exibir modo, ranking, contagens lexical/vetorial e termos usados
- Evals de recuperação: `/api/documents/retrieval-evals` e UI em `/workspace/documents` validam o topo do ranking híbrido
- Dataset de evals: `src/lib/documents/retrieval-eval-dataset.json` define casos padrão versionados
- Fixtures de evals: `src/lib/documents/retrieval-eval-fixtures.json` e `/api/documents/retrieval-fixtures` carregam fontes padrão no Supabase
- Próxima implementação planejada: decidir próximo incremento após fixtures versionadas de evals

## Objetivo principal 2026

Entregar MVP funcional e transformá-lo em ativo de carreira.

## Regra de alinhamento

Fontes do projeto, documentos do repositório e histórico operacional devem permanecer sincronizados.
