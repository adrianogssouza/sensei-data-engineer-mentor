# GOV-003 — Status Atual

## Snapshot

- Data de atualização: 2026-04-29
- Fase: v0.1-alpha preparation
- Última task concluída: TASK 009.1
- Próxima task: TASK 010
- Modo operacional: Single-user / private

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
- TASK 001 — Foundation Next.js
- TASK 002 — Normalização de documentação e AGENTS.md
- TASK 002.1 — Sincronização do pacote documental oficial v2
- TASK 003 — Supabase Foundation
- TASK 004 — Supabase Auth Foundation
- TASK 004.1 — Switch to Single-User Mode
- TASK 005 — Local Data Foundation
- TASK 006 — Workspace Shell + Navigation
- TASK 007 — Local Chat Mock
- TASK 008 — Local Chat Persistence
- TASK 008.1 — Sync GOV-006 into repo
- TASK 009 — AI Provider Skeleton
- TASK 009.1 — Sync Resource/Session Governance Docs

## Bloqueios

- Nenhum bloqueio técnico imediato para TASK 009.

## Governança QA

- GOV-006 Quality Assurance Policy sincronizado no repositório.
- Repo e fontes documentais agora incluem política de QA leve por task e robusto por milestone.
- GOV-007 Resource Management Policy e GOV-008 Session Management Policy sincronizados no repositório antes da TASK 010.

## Fundação Supabase

- `@supabase/supabase-js` instalado.
- Validação de ambiente criada para `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Client Supabase browser criado.
- Client Supabase server foundation criado sem integração de cookies/auth.
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

## Local Data Foundation

- Estrutura local `supabase/` inicializada.
- Migration inicial criada para `app_settings`, `chat_threads`, `chat_messages`, `usage_events` e `documents`.
- Trigger helper `set_updated_at()` criado e aplicado às tabelas com `updated_at`.
- Índices básicos criados para mensagens, eventos de uso e documentos.
- Tipos TypeScript do banco atualizados manualmente.
- Schema atual é single-user/private, sem `user_id`, RLS multi-user ou `auth.uid()` policies.
- pgvector, `document_chunks`, embeddings, upload, AI e RAG ainda não foram implementados.
- Nenhuma migration foi aplicada a banco remoto nesta task.

## Workspace Shell

- Layout de workspace criado em `/workspace`.
- Navegação interna criada para overview, chat, documents, usage e settings.
- Rotas placeholder criadas para `/workspace/chat`, `/workspace/documents`, `/workspace/usage` e `/workspace/settings`.
- Nenhuma rota faz leitura/escrita no banco.
- Chat, AI, RAG, upload, embeddings, pgvector e usage UI conectada ainda não foram implementados.

## Local Chat Mock

- `/workspace/chat` agora possui interface local de chat.
- Respostas do assistente são determinísticas e locais.
- Não há API route, chamadas externas, Supabase read/write, persistência, streaming, AI provider, RAG ou custo de IA.

## Local Chat Persistence

- Mensagens do mock chat persistem em `localStorage`.
- Persistência é local deste navegador apenas.
- Clear chat remove mensagens do estado React e do `localStorage`.
- JSON inválido/corrompido é tratado sem quebrar a aplicação.
- Não há cloud sync, Supabase persistence, API route, provider real, RAG ou custo de IA.

## AI Provider Skeleton

- Tipos internos de provider de IA criados em `src/types/ai.ts`.
- Registry interno criado em `src/lib/ai/provider-registry.ts`.
- Provider mock local criado em `src/lib/ai/providers/mock-provider.ts`.
- Chat local usa o provider mock sem mudar para backend.
- Provider ativo atual: `mock`.
- Anthropic e OpenAI estão planejados nos tipos, mas não estão ativos.
- Nenhum SDK de Anthropic/OpenAI foi instalado.
- Não há chamadas externas, API route, RAG, embeddings, upload ou custo real de IA.

## Riscos

- Repo ainda sem commits.
- Manter atenção para não executar prompts em projeto errado.
- Fontes e repo devem continuar sincronizados.
- Auth foi despriorizado como fluxo principal; evitar recolocar login obrigatório sem nova decisão documentada.
- Governança documental sincronizada antes da TASK 010.

## Próxima ação recomendada

Iniciar TASK 010.
