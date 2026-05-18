# GOV-003 — Status Atual

## Retrato Atual

- Data de atualização: 2026-05-18
- Fase: v0.1-beta com upload textual simples, recuperação híbrida observável e avaliada
- Última task concluída: TASK 034
- Checkpoint atual: documentos podem ser cadastrados por texto colado, arquivo `.txt`/`.md` local ou fixtures de eval
- Próxima task: decidir entre embeddings reais, parsing avançado/PDF ou gestão de documentos
- Modo operacional: single-user/private

## Ambiente validado

- Node: v24.15.0
- npm: 11.12.1
- pnpm: 10.33.2
- Git: 2.50.1
- Codex CLI: 0.126.0-alpha.8
- Supabase CLI: 2.95.4
- Homebrew: 5.1.7

## Concluído

- TASK 000 — Bootstrap inicial e auditoria de ambiente
- TASK 000.1 — Instalação/validação de pnpm e Supabase CLI
- TASK 000.2 — Sincronização de governança no repo
- TASK 001 — Fundação Next.js
- TASK 002 — Normalização de documentação e AGENTS.md
- TASK 002.1 — Sincronização do pacote documental oficial v2
- TASK 003 — Fundação Supabase
- TASK 004 — Fundação Supabase Auth
- TASK 004.1 — Mudança para modo single-user
- TASK 005 — Fundação local de dados
- TASK 006 — Shell do workspace + navegação
- TASK 007 — Chat local com mock
- TASK 008 — Persistência local do chat
- TASK 008.1 — Sync GOV-006 into repo
- TASK 009 — Skeleton de provider de IA
- TASK 009.1 — Sincronização de docs de governança de recursos/sessão
- TASK 010 — Integração do provider Gemini
- TASK 010.1 — Exposição de erro do provider Gemini
- TASK 010.2 — Documentação da limitação de quota Gemini
- TASK 011 — Guardrails de Uso / Custo
- TASK 012 — Planejamento curto da v0.1-alpha
- TASK 013 — Persistência Supabase do histórico de chat
- TASK 014 — UI mínima de histórico no workspace
- TASK 015 — Preparação de deploy mock-first
- TASK 016 — QA v0.1-alpha
- TASK 017 — Handoff de portfólio v0.1-alpha
- TASK 018 — Deploy real mock-first na Vercel
- TASK 019 — Configuração do Supabase remoto para histórico real
- TASK 020 — Hardening leve single-user/private
- TASK 021 — Cadastro manual de fontes/documentos
- TASK 022 — Ingestão manual inicial de conteúdo
- TASK 023 — Chunks simples de conteúdo
- TASK 024 — Busca lexical/local sobre chunks
- TASK 025 — Busca lexical/local no chat mock
- TASK 026 — Ranking lexical/local v2
- TASK 027 — Fundação pgvector/embeddings
- TASK 028 — Geração mock de embeddings
- TASK 029 — Recuperação híbrida lexical + vetorial
- TASK 030 — Observabilidade da recuperação no chat
- TASK 031 — Eval manual de recuperação
- TASK 032 — Dataset versionado de evals de recuperação
- TASK 033 — Fixtures versionadas de fontes para evals
- TASK 034 — Upload textual simples

## Bloqueios

- Bloqueio atual: quota/billing do Google Gemini para chamada real (`429 RESOURCE_EXHAUSTED`).
- Nenhum bloqueio de código conhecido após TASK 013.

## Governança QA

- GOV-006 Política de Garantia de Qualidade sincronizada no repositório.
- Repo e fontes documentais agora incluem política de QA leve por task e robusto por milestone.
- GOV-007 Política de Gestão de Recursos e GOV-008 Política de Gestão de Sessões sincronizados no repositório antes da TASK 010.

## Fundação Supabase

- `@supabase/supabase-js` instalado.
- Validação de ambiente criada para `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Client Supabase browser criado.
- Fundação do client Supabase server criada sem integração de cookies/auth.
- Tipos placeholder preparados para futura geração de tipos do banco.
- Auth UI, migrations, RLS, schema e chamadas Supabase na UI ainda não foram implementados.

## Fundação Supabase Auth

- `@supabase/ssr` instalado para sessão/cookies no App Router.
- Client server Supabase atualizado com cookies.
- Proxy mínimo do Next.js criado para refresh de sessão e proteção de `/dashboard`.
- Login email/password criado em `/login`.
- Signup email/password criado em `/signup`.
- Logout criado via Server Action.
- Dashboard protegido criado em `/dashboard`.
- Database schema, migrations, profiles table e RLS ainda não foram implementados.

## Modo Single-User / Private

- Homepage pública atualizada como landing real do app.
- `/workspace` criado como rota pública principal para uso diário.
- `/workspace`, `/api/chat/*` e `/api/ai/*` ficam protegidos por HTTP Basic Auth quando `SENSEI_PRIVATE_ACCESS_PASSWORD` está configurada.
- Login e signup permanecem disponíveis, mas não são obrigatórios no fluxo principal.
- `/dashboard` permanece protegido para preservar a fundação de auth futura.

## Fundação Local de Dados

- Estrutura local `supabase/` inicializada.
- Migration inicial criada para `app_settings`, `chat_threads`, `chat_messages`, `usage_events` e `documents`.
- Trigger helper `set_updated_at()` criado e aplicado às tabelas com `updated_at`.
- Índices básicos criados para mensagens, eventos de uso e documentos.
- Tipos TypeScript do banco atualizados manualmente.
- Schema atual é single-user/private, sem `user_id`, RLS multi-user ou policies com `auth.uid()`.
- pgvector está habilitado e colunas de embedding existem em `document_chunks`.
- Geração mock de embeddings foi implementada; embeddings reais via OpenAI, upload, RAG semântico e ownership multi-user ainda não foram implementados.
- Nenhuma migration foi aplicada a banco remoto nesta task.

## Shell do Workspace

- Layout de workspace criado em `/workspace`.
- Navegação interna criada para overview, chat, documents, usage e settings.
- Rotas placeholder criadas para `/workspace/chat`, `/workspace/usage` e `/workspace/settings`.
- `/workspace/documents` agora possui cadastro manual, listagem e remoção de fontes/documentos.
- Chat agora possui rotas internas para persistência Supabase quando configurado.
- RAG, upload, embeddings reais e usage UI persistente ainda não foram implementados.

## Chat Local com Mock

- `/workspace/chat` agora possui interface local de chat.
- Respostas do assistente são determinísticas e locais.
- Chat usa API interna de IA e API interna de histórico quando Supabase está configurado.
- Sem Supabase configurado, o fallback local via `localStorage` permanece operacional.
- O provider mock pode usar trechos recuperados por busca lexical/local quando há fontes cadastradas.
- O ranking lexical considera frase, termos relevantes, contagens e score simples.
- Não há streaming, RAG, busca semântica ou persistência de uso.

## Persistência Local do Chat

- Mensagens do mock chat persistem em `localStorage`.
- Persistência é local deste navegador apenas.
- Clear chat remove mensagens do estado React e do `localStorage`.
- JSON inválido/corrompido é tratado sem quebrar a aplicação.
- Há persistência Supabase de histórico quando env Supabase está configurado.
- Sem Supabase configurado, não há cloud sync e a persistência permanece local.
- RAG e persistência de uso ainda não foram implementados.

## Skeleton de Provider de IA

- Tipos internos de provider de IA criados em `src/types/ai.ts`.
- Registry interno criado em `src/lib/ai/provider-registry.ts`.
- Provider mock local criado em `src/lib/ai/providers/mock-provider.ts`.
- Provider Gemini criado em `src/lib/ai/providers/gemini-provider.ts`.
- API route `/api/ai/chat` criada para chamadas não-streaming via provider abstraction.
- Chat usa `/api/ai/chat` e mantém persistência local em `localStorage`.
- Provider padrão atual: `mock`.
- Gemini é usado apenas quando `AI_PROVIDER=gemini` e `GEMINI_API_KEY` estão configurados.
- Sem `GEMINI_API_KEY`, a aplicação volta para o mock provider.
- Integração Gemini foi validada tecnicamente: `/api/ai/chat` alcança a API Gemini e recebe resposta real.
- Bloqueio atual de runtime: `429 RESOURCE_EXHAUSTED` por quota/billing do Google; free tier parece `0` para o modelo testado.
- Nenhum bloqueio de código conhecido neste ponto; mock fallback permanece ativo.
- Fallback operacional atual: provider mock.
- Anthropic e OpenAI estão planejados nos tipos, mas não estão ativos.
- Nenhum SDK de Anthropic/OpenAI foi instalado.
- O provider mock recebe trechos recuperados por `document_chunks` via metadados da rota `/api/ai/chat`.
- Os metadados de recuperação incluem termos buscados, ranking usado e quantidade de resultados.
- A recuperação do chat combina resultados lexicais e vetoriais quando há embeddings prontos.
- A UI do chat exibe o diagnóstico da recuperação por mensagem do assistente quando os metadados estão disponíveis.
- A UI de documentos possui eval manual para validar se uma pergunta recupera a fonte esperada no topo.
- A UI de documentos pode rodar o dataset padrão versionado de evals de recuperação.
- A UI de documentos pode carregar fontes fixture versionadas para rodar o dataset padrão sem cadastro manual.
- A UI de documentos importa arquivos `.txt`, `.md` e `.markdown` localmente no navegador para preencher o conteúdo bruto.
- Não há RAG, embeddings reais, upload, streaming ou persistência de uso.

## Guardrails de Uso / Custo

- Guardrails locais em memória adicionados em `src/lib/ai/usage-guardrails.ts`.
- `/api/ai/chat` agora aplica limite de contexto, output, chamadas reais por dia, tokens estimados por dia e custo estimado configurável.
- Quando provider real excede guardrail, a rota evita chamada externa e usa fallback mock.
- `/workspace/usage` mostra limites e uso em memória do processo atual.
- `.env.example` documenta limites seguros para uso local.
- Não há persistência Supabase de uso, dashboard histórico, RAG, embeddings, upload ou pgvector.

## Persistência Supabase do Histórico de Chat

- Rotas internas criadas em `/api/chat/threads` e `/api/chat/messages`.
- `/workspace/chat` tenta carregar o thread remoto mais recente quando Supabase está configurado.
- Novas mensagens de usuário e assistente são persistidas no Supabase em background quando possível.
- Se Supabase não estiver configurado ou falhar, o chat continua funcionando com `localStorage`.
- Limpar chat arquiva o thread remoto atual quando possível e limpa o fallback local.
- UI mínima de lista/seleção de conversas foi implementada na TASK 014.
- Não foram adicionados RAG, embeddings, upload, pgvector, multi-user/RLS ou persistência de uso.

## UI Mínima de Histórico no Workspace

- `/workspace/chat` agora lista conversas remotas quando Supabase está disponível.
- É possível abrir uma conversa existente pela lista lateral.
- É possível iniciar nova conversa pelo toolbar do chat.
- Limpar chat arquiva a conversa remota ativa quando possível e preserva fallback local seguro.
- Sem Supabase configurado, a UI informa ausência de histórico remoto e mantém `localStorage`.
- Não foram adicionados RAG, embeddings, upload, pgvector, multi-user/RLS ou persistência de uso.

## Preparação de Deploy Mock-First

- `.env.example` foi normalizado para refletir variáveis atualmente usadas e manter `AI_PROVIDER=mock` como padrão seguro.
- Checklist de deploy mock-first criado em `docs/deploy-mock-first.md`.
- README e arquitetura foram sincronizados com histórico UI e preparação de deploy.
- `pnpm build` foi validado com o fluxo atual.
- Deploy real, criação de projeto Vercel e aplicação de migrations remotas ainda não foram executados.

## QA v0.1-alpha

- Relatório criado em `docs/qa-v0.1-alpha.md`.
- Rotas principais `/`, `/workspace`, `/workspace/chat`, `/workspace/documents`, `/workspace/usage` e `/workspace/settings` responderam `200`.
- `/api/ai/chat` respondeu com provider `mock` e `externalApiCall: false`.
- `/api/chat/threads` retornou indisponibilidade controlada sem Supabase configurado, preservando fallback local.
- Verificação visual confirmou `/workspace/chat` em modo mock com painel de histórico.
- `pnpm lint`, `pnpm build` e `git diff --check` passaram.
- Não foram adicionados RAG, embeddings, upload, pgvector, multi-user/RLS, deploy real ou Gemini real.

## Handoff de Portfólio v0.1-alpha

- Documento criado em `docs/handoff-portfolio-v0.1-alpha.md`.
- README reorganizado com visão de portfólio, demo local e entregas da alpha.
- `docs/desenvolvimento.md` aponta para os documentos de handoff, QA e deploy mock-first.
- Sequência curta da v0.1-alpha foi concluída no escopo local/mock-first.
- Deploy real e v0.1-beta ainda dependem de nova decisão de próximo bloco.

## Deploy Real Mock-First

- Deploy Vercel executado com `AI_PROVIDER=mock`.
- Projeto Vercel linkado como `adrianogssouzas-projects/sensei-data-engineer-mentor`.
- Repositório GitHub conectado pela Vercel.
- URL pública: `https://sensei-data-engineer-mentor.vercel.app`.
- Relatório criado em `docs/deploy-v0.1-alpha.md`.
- `/`, `/workspace/chat`, `/api/ai/chat` e fallback de `/api/chat/threads` foram validados na URL publicada.
- `.vercel/` foi criado localmente pela CLI e ignorado no Git.
- Gemini real, RAG, upload, embeddings, pgvector e multi-user/RLS continuam fora do escopo desta task.

## Supabase Remoto para Histórico Real

- Projeto Supabase remoto escolhido: `xazgvdegyapkacsijvqw`.
- Migration inicial `20260429132612_initial_app_schema.sql` aplicada no banco remoto.
- Vercel Production recebeu `AI_PROVIDER`, `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Produção publicada novamente em `https://sensei-data-engineer-mentor.vercel.app`.
- `/api/chat/threads` passou a retornar `available: true` na URL pública.
- Ciclo real de histórico validado em produção: criar mensagens, ler mensagens, listar thread e arquivar thread.
- Thread residual de validação foi arquivado; a lista ativa terminou vazia.
- Correção mínima aplicada na API de mensagens para omitir `created_at` quando `createdAt` não vier no payload e deixar o banco usar `now()`.
- RAG, upload, embeddings, pgvector, Gemini real, multi-user/RLS e persistência de uso seguem fora do escopo.

## Hardening Leve Single-User/Private

- Variável `SENSEI_PRIVATE_ACCESS_PASSWORD` adicionada como segredo opcional de servidor.
- Produção na Vercel configurada com senha privada sensível.
- Proxy do Next.js agora protege `/workspace`, `/api/chat/*` e `/api/ai/*` com HTTP Basic Auth quando a senha existe.
- Homepage pública permanece aberta para leitura/portfólio.
- Validação em produção:
  - `/` retornou `200` sem senha;
  - `/workspace/chat` retornou `401` sem senha;
  - `/api/chat/threads` retornou `401` sem senha;
  - `/api/chat/threads` retornou `available: true` com credencial válida.
- Multi-user/RLS, login obrigatório e contas públicas continuam fora do escopo por decisão de uso pessoal.

## Cadastro Manual de Fontes/Documentos

- API `/api/documents` criada para listar, cadastrar e remover registros da tabela `documents`.
- `/workspace/documents` deixou de ser placeholder e agora permite registrar título, tipo, referência e notas.
- Tipos de fonte aceitos nesta etapa: `manual`, `url` e `file_reference`.
- Todo novo registro entra com `ingestion_status = pending`.
- Produção redeployada e validada com Basic Auth ativo.
- Validação em produção:
  - `/api/documents` retornou `401` sem senha;
  - `/workspace/documents` retornou `401` sem senha;
  - com credencial válida, uma fonte de teste foi criada, listada e removida;
  - a lista final de documentos ficou vazia após a limpeza.
- Upload físico, storage, parsing, embeddings, pgvector, RAG e busca semântica continuam fora do escopo.

## Ingestão Manual Inicial de Conteúdo

- Migration `20260516012500_add_document_raw_content.sql` criada e aplicada no Supabase remoto.
- Tabela `documents` agora possui `raw_content`, `content_char_count` e `ingested_at`.
- API `/api/documents` aceita `rawContent` no cadastro.
- Quando `rawContent` é informado:
  - `raw_content` recebe o texto bruto;
  - `content_char_count` recebe a contagem de caracteres;
  - `content_hash` recebe hash SHA-256 do conteúdo;
  - `ingestion_status` passa para `ready`;
  - `ingested_at` é preenchido.
- `/workspace/documents` permite colar conteúdo bruto na criação de uma fonte e visualizar o conteúdo salvo.
- Produção redeployada e validada com Basic Auth ativo.
- Validação em produção: uma fonte manual com conteúdo foi criada, listada com `ready`, `contentCharCount` e `contentHash`, removida e a lista final ficou vazia.
- Upload físico, storage, parsing de PDF/HTML, chunks, embeddings, pgvector, RAG e busca semântica continuam fora do escopo.

## Chunks Simples de Conteúdo

- Migration `20260516014500_add_document_chunks.sql` criada e aplicada no Supabase remoto.
- Tabela `document_chunks` criada com vínculo `document_id` para `documents` e `on delete cascade`.
- Coluna `chunk_count` adicionada em `documents`.
- API `/api/documents` agora divide `rawContent` em chunks determinísticos no cadastro.
- Parâmetros iniciais:
  - `CHUNK_SIZE = 1200`;
  - `CHUNK_OVERLAP = 160`.
- Cada chunk salva `chunk_index`, `content`, `char_count` e metadados básicos.
- `/workspace/documents` mostra a contagem de chunks de cada fonte.
- Produção redeployada e validada com Basic Auth ativo.
- Validação em produção: uma fonte manual com conteúdo foi criada com `chunkCount = 1`, a tabela `document_chunks` confirmou 1 chunk, a fonte foi removida e os chunks foram removidos por cascade.
- Embeddings, pgvector, RAG, busca semântica, parsing de PDF/HTML e upload físico continuam fora do escopo.

## Busca Lexical/Local Sobre Chunks

- Rota protegida `/api/documents/search?q=...` criada.
- Busca usa `ilike` em `document_chunks.content`, sem embeddings e sem pgvector.
- Resultados retornam título da fonte, índice do chunk, conteúdo, contagem de caracteres e score simples por ocorrência do termo.
- `/workspace/documents` ganhou seção "Buscar nos chunks" com campo de busca e listagem de trechos encontrados.
- Produção redeployada e validada com Basic Auth ativo.
- Validação em produção:
  - `/api/documents/search?q=window` retornou `401` sem senha;
  - com credencial válida e sem documentos, retornou lista vazia;
  - uma fonte temporária foi criada com conteúdo e chunk;
  - buscas por `window` e `cliente` retornaram o chunk esperado;
  - a fonte foi removida e a busca voltou a retornar lista vazia.
- Embeddings, pgvector, RAG e busca semântica continuam fora do escopo.

## Busca Lexical/Local no Chat Mock

- TASK 025 conectou a busca lexical/local ao fluxo de `/api/ai/chat`.
- A rota de chat extrai termos relevantes da última mensagem do usuário e consulta `document_chunks`.
- Os trechos encontrados são enviados ao provider mock por metadados internos.
- O provider mock passa a responder com indicação da fonte, índice do chunk e trecho recuperado quando há resultado.
- A rota preserva fallback seguro: se a busca falhar, o chat continua respondendo em modo mock determinístico.
- A busca continua lexical/local, baseada em `ilike`, sem embeddings, sem pgvector e sem RAG semântico.
- Produção redeployada e validada com Basic Auth ativo.
- Validação em produção:
  - uma fonte temporária foi criada com conteúdo sobre `window functions`;
  - `/api/ai/chat` respondeu com "Local mock com fontes" e citou a fonte temporária;
  - a fonte temporária foi removida ao final.

## Ranking Lexical/Local v2

- TASK 026 melhorou a estratégia de recuperação lexical sem adicionar embeddings, pgvector ou dependências.
- A busca compartilhada em `src/lib/documents/chunk-search.ts` agora extrai termos relevantes da pergunta.
- A recuperação consulta a frase normalizada e também termos individuais, juntando candidatos por chunk.
- O score considera:
  - ocorrência de frase;
  - quantidade de termos encontrados;
  - total de ocorrências dos termos.
- Os resultados retornam `matchedTerms`, `phraseMatches`, `termMatches` e `score`.
- `/api/documents/search` e `/api/ai/chat` usam a mesma lógica compartilhada.
- O chat mock mostra score lexical e termos encontrados quando responde com fonte.
- A validação em produção confirmou que uma pergunta com múltiplos termos recuperou o chunk esperado e exibiu score/termos no chat.

## Fundação pgvector/Embeddings

- TASK 027 criou a migration `20260516120500_add_document_chunk_embeddings.sql`.
- A extensão `vector` foi habilitada no Supabase remoto.
- `document_chunks` recebeu:
  - `embedding vector(1536)`;
  - `embedding_provider`;
  - `embedding_model`;
  - `embedding_status`;
  - `embedding_error`;
  - `embedded_at`.
- `embedding_status` aceita `pending`, `ready`, `error` e `skipped`.
- Novos chunks entram com `embedding_status = pending`.
- Tipos TypeScript do Supabase foram atualizados manualmente.
- Validação em produção: migration aplicada, `supabase migration list` confirmou local/remoto, e uma fonte temporária foi criada com `chunkCount = 1` após a migration e removida ao final.
- Geração de embeddings, busca vetorial, RAG semântico e provider de embeddings continuam fora do escopo desta task.

## Geração Mock de Embeddings

- TASK 028 criou geração local determinística de embeddings para chunks pendentes.
- Provider atual: `mock`.
- Modelo atual: `mock-hash-embedding-v1`.
- Dimensão: 1536.
- A rota protegida `/api/documents/embeddings` processa batches pequenos de chunks com `embedding_status = pending`.
- A tela `/workspace/documents` ganhou botão "Gerar embeddings".
- Chunks processados recebem:
  - `embedding`;
  - `embedding_provider = mock`;
  - `embedding_model = mock-hash-embedding-v1`;
  - `embedding_status = ready`;
  - `embedded_at`.
- Produção redeployada e validada com Basic Auth ativo.
- Validação em produção: uma fonte temporária foi criada, a rota gerou 1 embedding, retornou `embeddedCount = 1` e `failedCount = 0`, e a fonte foi removida.
- Embeddings reais via OpenAI, busca vetorial no chat e RAG semântico continuam fora do escopo desta task.

## Recuperação Híbrida Lexical + Vetorial

- TASK 029 criou a migration `20260516123000_add_document_chunk_vector_match.sql`.
- A função SQL `match_document_chunks` consulta chunks com embeddings prontos usando distância vetorial.
- Rota protegida `/api/documents/vector-search?q=...` criada para validação vetorial direta.
- `/api/ai/chat` passou a combinar:
  - resultados lexicais do ranking v2;
  - resultados vetoriais via pgvector;
  - score híbrido simples.
- Se não houver embedding pronto ou se a busca vetorial falhar, o chat preserva fallback lexical.
- O mock mostra score híbrido, score lexical, termos encontrados e similaridade vetorial quando disponíveis.
- Produção redeployada e validada com Basic Auth ativo.
- Validação em produção:
  - uma fonte temporária foi criada;
  - 1 embedding mock foi gerado;
  - `/api/documents/vector-search` retornou o chunk com similaridade;
  - `/api/ai/chat` respondeu com `mode = hybrid-local`, `lexicalResultCount = 1`, `vectorResultCount = 1` e citou score híbrido/similaridade;
  - a fonte temporária foi removida e a busca vetorial voltou vazia.
- RAG semântico, embeddings reais via OpenAI e upload/parsing continuam fora do escopo.

## Observabilidade da Recuperação no Chat

- TASK 030 adicionou persistência e renderização dos metadados de recuperação nas mensagens do chat.
- `ChatMessage` agora aceita `metadata` seguro para carregar dados de provider/modelo e recuperação.
- `/api/chat/messages` persiste e lê `metadata` em `chat_messages`.
- `localStorage` preserva mensagens com metadados válidos sem quebrar mensagens antigas.
- A UI do chat mostra, por resposta do assistente:
  - modo de recuperação;
  - ranking usado;
  - quantidade total de resultados;
  - contagem lexical;
  - contagem vetorial;
  - termos da consulta.
- Produção redeployada e validada com Basic Auth ativo.
- Validação em produção: uma conversa temporária exibiu `hybrid-local · hybrid-lexical-vector-v1`, `resultados 1 · lexical 1 · vetorial 1` e termos da consulta; a conversa foi limpa via UI e a fonte temporária foi removida.
- Embeddings reais via OpenAI, upload/parsing, evals de recuperação e RAG semântico completo continuam fora do escopo.

## Eval Manual de Recuperação

- TASK 031 extraiu a recuperação híbrida para `src/lib/documents/hybrid-search.ts`.
- `/api/ai/chat` passou a reutilizar o helper compartilhado, preservando comportamento de chat.
- Rota protegida `/api/documents/retrieval-evals` criada para validar casos manuais de recuperação.
- Cada caso de eval aceita pergunta, título esperado, trecho esperado e índice esperado do chunk.
- O eval passa quando o topo do ranking híbrido bate com os critérios informados.
- `/workspace/documents` ganhou seção "Avaliar recuperação" para rodar um caso manual pela UI.
- Documento criado em `docs/retrieval-evals-v0.1-beta.md`.
- Produção redeployada e validada com Basic Auth ativo.
- Validação em produção: uma fonte temporária foi criada, recebeu embedding mock, passou no eval manual e foi removida ao final.
- Dataset versionado de evals, thresholds avançados, avaliação por LLM, embeddings reais e upload/parsing continuam fora do escopo.

## Dataset Versionado de Evals de Recuperação

- TASK 032 criou `src/lib/documents/retrieval-eval-dataset.json`.
- Dataset inicial: `retrieval-evals-v1`.
- Casos padrão iniciais cobrem SQL window functions, dbt incremental models e Airflow DAG retry.
- `/api/documents/retrieval-evals` agora aceita `useDefaultDataset: true`.
- POST vazio na rota roda o dataset padrão.
- GET da rota expõe metadados do dataset e exemplos de uso.
- `/workspace/documents` ganhou botão "Rodar dataset padrão".
- A UI exibe resumo `passou/total`, versão do dataset e resultados por caso.
- Produção redeployada e validada com Basic Auth ativo.
- Validação em produção: fontes temporárias compatíveis com o dataset foram criadas, embeddings mock gerados, o dataset padrão passou 3/3 e as fontes temporárias foram removidas ao final.
- Ampliação do dataset, fixtures permanentes de fonte, thresholds avançados, embeddings reais e upload/parsing continuam fora do escopo.

## Fixtures Versionadas de Evals

- TASK 033 criou `src/lib/documents/retrieval-eval-fixtures.json`.
- Fixture inicial: `retrieval-eval-fixtures-v1`.
- Rota protegida `/api/documents/retrieval-fixtures` criada.
- `GET /api/documents/retrieval-fixtures` expõe metadados das fixtures.
- `POST /api/documents/retrieval-fixtures` recria idempotentemente as fontes fixture no Supabase.
- A criação usa `source_path` `sensei-fixture://...` e metadata `fixture = retrieval-evals`.
- `/workspace/documents` ganhou botão "Carregar fontes de eval".
- O fluxo esperado é carregar fixtures, gerar embeddings mock e rodar dataset padrão.
- Produção redeployada e validada com Basic Auth ativo.
- Validação em produção: fixtures foram carregadas, embeddings mock gerados e o dataset padrão passou 3/3.
- Embeddings reais, upload/parsing, thresholds avançados e ampliação do dataset continuam fora do escopo.

## Upload Textual Simples

- TASK 034 adicionou importação local de arquivos textuais em `/workspace/documents`.
- Formatos aceitos nesta etapa: `.txt`, `.md` e `.markdown`.
- O arquivo é lido no navegador via `File.text()`.
- O conteúdo lido preenche `rawContent` antes do cadastro.
- Se o título estiver vazio, o nome do arquivo preenche o título inicial.
- `sourceType` passa para `file_reference` e `sourcePath` recebe o nome do arquivo.
- O cadastro continua usando a rota existente `/api/documents`, preservando chunking, hash e status `ready`.
- Não há storage de arquivo físico nesta etapa.
- Não há parsing de PDF, DOCX, HTML remoto ou OCR nesta etapa.
- Validação local: `pnpm lint` e `pnpm build` passaram.
- Validação: deploy de produção concluído; validação visual local confirmou a seção "Importar arquivo textual".

## Plano Curto v0.1-alpha

- TASK 012 definiu a sequência curta para fechar v0.1-alpha.
- Sequência curta TASK 013 a TASK 017 concluída.
- Próxima implementação planejada: decidir próximo incremento após fixtures versionadas de evals.
- Gemini não é bloqueador da v0.1-alpha; mock provider permanece fluxo oficial enquanto quota/billing estiver bloqueado.
- RAG, embeddings, upload, pgvector, OpenAI/Anthropic SDK, streaming e multi-user continuam fora do escopo até fechar v0.1-alpha.

## Riscos

- Repo publicado no GitHub como repositório privado.
- Manter atenção para não executar prompts em projeto errado.
- Fontes e repo devem continuar sincronizados.
- Auth foi despriorizado como fluxo principal; evitar recolocar login obrigatório sem nova decisão documentada.
- Governança documental sincronizada antes da TASK 010.
- Retomar na próxima sessão decidindo o próximo incremento da v0.1-beta.

## Próxima ação recomendada

Escolher entre embeddings reais, upload/parsing ou ampliar dataset/fixtures de evals.
