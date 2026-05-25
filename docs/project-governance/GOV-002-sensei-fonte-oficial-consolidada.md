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
- Fase atual: v0.1-beta privada com RLS habilitado, upload textual simples, edição de documentos, filtros de status, reprocessamento em lote, fila de embeddings observável, provider de embeddings visível, recuperação híbrida observável, prontidão de recuperação, smoke test no overview e fundação de embeddings reais
- Última task concluída: TASK 047
- Checkpoint atual: `/workspace/documents` mostra provider/modelo/status dos embeddings e bloqueia a geração quando o provider configurado estiver indisponível; embeddings reais via OpenAI foram preparados como provider opcional, mantendo mock como padrão seguro; overview do workspace exibe health documental protegido, prontidão de recuperação/evals e smoke test de busca sobre chunks com atalhos para documentos e chat; health valida acesso ao Supabase, contagens de fontes/chunks e pendências de embeddings; QA pós-RLS validou lint remoto, bloqueio direto via anon key e proteção `401` das APIs públicas
- Próxima task: configurar credenciais de embeddings reais na Vercel ou avançar para parsing avançado/PDF
- Bloqueio atual: quota/billing do Google Gemini para chamada real (`429 RESOURCE_EXHAUSTED`)
- Fallback operacional atual: provider mock
- Repositório GitHub: privado em `adrianogssouza/sensei-data-engineer-mentor`
- URL pública: `https://sensei-data-engineer-mentor.vercel.app`
- Supabase remoto: projeto `xazgvdegyapkacsijvqw`, migration `20260429132612` aplicada
- Acesso privado: `/workspace`, `/api/chat/*`, `/api/ai/*` e `/api/documents` protegidos quando `SENSEI_PRIVATE_ACCESS_PASSWORD` está configurada
- Segurança Supabase: RLS habilitado nas tabelas do app; APIs internas protegidas usam `SUPABASE_SERVICE_ROLE_KEY` apenas no servidor
- Fontes/documentos: cadastro manual implementado em `/workspace/documents`
- Ingestão inicial: `raw_content`, contagem de caracteres, hash e `ingested_at` implementados em `documents`
- Chunks: tabela `document_chunks` criada e preenchida automaticamente a partir de `raw_content`
- Busca: rota `/api/documents/search` e UI em `/workspace/documents` implementadas sobre chunks
- Chat com fontes: `/api/ai/chat` consulta chunks por termos da pergunta e passa trechos ao provider mock
- Ranking lexical: busca por frase e termos relevantes, com `matchedTerms`, contagens e score simples
- Embeddings: extensão `vector` habilitada e colunas de embedding preparadas em `document_chunks`
- Geração de embeddings: rota protegida `/api/documents/embeddings` suporta provider mock por padrão e OpenAI opcional com `EMBEDDINGS_PROVIDER=openai`
- Recuperação híbrida: `/api/ai/chat` usa ranking lexical + busca vetorial com fallback lexical
- Observabilidade da recuperação: mensagens do assistente podem exibir modo, ranking, contagens lexical/vetorial e termos usados
- Evals de recuperação: `/api/documents/retrieval-evals` e UI em `/workspace/documents` validam o topo do ranking híbrido
- Dataset de evals: `src/lib/documents/retrieval-eval-dataset.json` define casos padrão versionados
- Fixtures de evals: `src/lib/documents/retrieval-eval-fixtures.json` e `/api/documents/retrieval-fixtures` carregam fontes padrão no Supabase
- Upload textual: `/workspace/documents` importa `.txt`, `.md` e `.markdown` no navegador e preenche `raw_content`
- Reprocessamento de documentos: `/api/documents/reprocess` regenera chunks a partir de `raw_content` existente e deixa embeddings pendentes para nova geração
- Edição de documentos: `PUT /api/documents` atualiza título, tipo, referência, notas e `raw_content`; quando o conteúdo muda, chunks antigos são removidos e a fonte fica como `needs_reprocess`
- Status de documentos: `/workspace/documents` exibe contadores e filtros para todos, prontos, pendentes e fontes que precisam reprocessar
- Reprocessamento em lote: `/workspace/documents` permite reprocessar a fila de fontes com `needs_reprocess` usando a rota existente `/api/documents/reprocess`
- Fila de embeddings: `/api/documents/embeddings` expõe contadores por status e `/workspace/documents` mostra a fila antes/depois da geração mock
- Provider de embeddings: `/workspace/documents` mostra provider/modelo/status e orienta configurar chave quando o provider real estiver indisponível
- Health documental: `/api/documents/health`, `/workspace` e `/workspace/documents` mostram status operacional de banco, fontes, chunks e pendências
- Prontidão de recuperação: `/workspace` deriva do health documental se a base está bloqueada, em atenção ou pronta para evals/chat com fontes
- Smoke test de recuperação: `/workspace` permite consultar `/api/documents/search` rapidamente para validar se a base retorna chunks
- Embeddings reais: `text-embedding-3-small` preparado via OpenAI API sem SDK; chave real deve ficar apenas em env segura
- Próxima implementação planejada: configurar embeddings reais em produção ou avançar para parsing avançado/PDF

## Objetivo principal 2026

Entregar MVP funcional e transformá-lo em ativo de carreira.

## Regra de alinhamento

Fontes do projeto, documentos do repositório e histórico operacional devem permanecer sincronizados.
