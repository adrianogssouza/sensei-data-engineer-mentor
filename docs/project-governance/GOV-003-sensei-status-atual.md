# GOV-003 — Status Atual

## Retrato Atual

- Data de atualização: 2026-05-05
- Fase: preparação da v0.1-alpha
- Última task concluída: TASK 013
- Checkpoint atual: persistência Supabase do histórico de chat implementada com fallback local
- Próxima task: TASK 014
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
- Login e signup permanecem disponíveis, mas não são obrigatórios no fluxo principal.
- `/dashboard` permanece protegido para preservar a fundação de auth futura.

## Fundação Local de Dados

- Estrutura local `supabase/` inicializada.
- Migration inicial criada para `app_settings`, `chat_threads`, `chat_messages`, `usage_events` e `documents`.
- Trigger helper `set_updated_at()` criado e aplicado às tabelas com `updated_at`.
- Índices básicos criados para mensagens, eventos de uso e documentos.
- Tipos TypeScript do banco atualizados manualmente.
- Schema atual é single-user/private, sem `user_id`, RLS multi-user ou policies com `auth.uid()`.
- pgvector, `document_chunks`, embeddings, upload, AI e RAG ainda não foram implementados.
- Nenhuma migration foi aplicada a banco remoto nesta task.

## Shell do Workspace

- Layout de workspace criado em `/workspace`.
- Navegação interna criada para overview, chat, documents, usage e settings.
- Rotas placeholder criadas para `/workspace/chat`, `/workspace/documents`, `/workspace/usage` e `/workspace/settings`.
- Chat agora possui rotas internas para persistência Supabase quando configurado.
- RAG, upload, embeddings, pgvector e usage UI persistente ainda não foram implementados.

## Chat Local com Mock

- `/workspace/chat` agora possui interface local de chat.
- Respostas do assistente são determinísticas e locais.
- Chat usa API interna de IA e API interna de histórico quando Supabase está configurado.
- Sem Supabase configurado, o fallback local via `localStorage` permanece operacional.
- Não há streaming, RAG ou persistência de uso.

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
- Não há RAG, embeddings, upload, pgvector, persistência Supabase, streaming ou persistência de uso.

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
- Ainda não há UI de lista/seleção de conversas; isso fica para TASK 014.
- Não foram adicionados RAG, embeddings, upload, pgvector, multi-user/RLS ou persistência de uso.

## Plano Curto v0.1-alpha

- TASK 012 definiu a sequência curta para fechar v0.1-alpha.
- Próxima implementação planejada: TASK 014 — UI mínima de histórico no workspace.
- Sequência planejada: TASK 013 histórico Supabase, TASK 014 UI mínima de histórico, TASK 015 preparação de deploy mock-first, TASK 016 QA v0.1-alpha, TASK 017 handoff de portfólio.
- Gemini não é bloqueador da v0.1-alpha; mock provider permanece fluxo oficial enquanto quota/billing estiver bloqueado.
- RAG, embeddings, upload, pgvector, OpenAI/Anthropic SDK, streaming e multi-user continuam fora do escopo até fechar v0.1-alpha.

## Riscos

- Repo publicado no GitHub como repositório privado.
- Manter atenção para não executar prompts em projeto errado.
- Fontes e repo devem continuar sincronizados.
- Auth foi despriorizado como fluxo principal; evitar recolocar login obrigatório sem nova decisão documentada.
- Governança documental sincronizada antes da TASK 010.
- Retomar na próxima sessão com TASK 014.

## Próxima ação recomendada

Iniciar TASK 014 — UI mínima de histórico no workspace.
