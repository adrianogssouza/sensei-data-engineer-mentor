# Arquitetura

## Arquitetura Implementada Atualmente

O projeto possui hoje a fundação inicial do app Next.js, uma fundação mínima de Supabase, fundação de Supabase Auth, fluxo operacional single-user/private, fundação local de dados, shell de workspace e chat local com persistência no navegador:

- Next.js App Router em `src/app/`.
- TypeScript com strict mode habilitado.
- Tailwind CSS para estilos.
- ESLint para checagens estáticas.
- Alias de importação `@/*` apontando para `src/*`.
- Diretórios placeholder para `src/components/`, `src/lib/` e `src/types/`.
- Helpers de validação de ambiente em `src/lib/env.ts`.
- Factory functions dos clients Supabase browser/server em `src/lib/supabase/`.
- Tipos placeholder `Database` do Supabase preparados para futura geração automática.
- Tratamento de cookies/sessão Supabase SSR com `@supabase/ssr`.
- Actions mínimas de auth por email/password para signup, signin e signout.
- Páginas mínimas de login e signup em `src/app/(auth)/`.
- Página mínima de dashboard protegido em `src/app/(protected)/dashboard/`.
- Proxy do Next.js para refresh de cookies de auth e proteção de `/dashboard`.
- Rota pública de workspace em `src/app/workspace/`.
- Homepage pública que encaminha usuários para o workspace sem fricção de login.
- Estrutura local de projeto Supabase em `supabase/`.
- Migration inicial para `app_settings`, `chat_threads`, `chat_messages`, `usage_events` e `documents`.
- Tipo TypeScript manual `Database` cobrindo as tabelas iniciais.
- Layout de workspace em `src/app/workspace/layout.tsx`.
- Rotas placeholder do workspace para chat, documents, usage e settings.
- Componentes simples de navegação/card do workspace em `src/components/workspace/`.
- Estado e UI de chat local em `/workspace/chat`.
- Respostas determinísticas do assistente mock em `src/lib/chat/mock-chat.ts`.
- Helper de persistência local do chat em `src/lib/chat/local-chat-storage.ts`.
- Componentes de UI de chat em `src/components/chat/`.
- Tipos internos de provider de IA em `src/types/ai.ts`.
- Registry de providers de IA em `src/lib/ai/`.
- Provider mock local ativo em `src/lib/ai/providers/mock-provider.ts`.
- Provider Gemini em `src/lib/ai/providers/gemini-provider.ts`.
- API route de chat com IA sem streaming em `src/app/api/ai/chat/route.ts`.
- Rotas internas de histórico em `src/app/api/chat/threads/route.ts` e `src/app/api/chat/messages/route.ts`.

A fundação de Supabase Auth existe, mas o modo operacional atual é single-user/private. Auth pode voltar a ser o fluxo principal no futuro. Por enquanto, `/workspace` é público e é a rota recomendada para uso diário. O dashboard protegido continua disponível para fluxos autenticados futuros.

A fundação local de dados foi implementada apenas como schema/migration/types. Nenhum serviço local do Supabase foi iniciado e nenhum banco remoto foi modificado.

O shell do workspace foi implementado como navegação e páginas placeholder. O chat foi implementado como UI/estado com persistência em `localStorage` e persistência Supabase quando configurada. A TASK 009 adicionou o skeleton de provider de IA e a TASK 010 adicionou Gemini como primeiro provider real. O registry de providers suporta mock e Gemini, com mock sempre disponível e Gemini selecionado apenas quando configurado explicitamente via variáveis de ambiente. `/workspace/chat` chama `/api/ai/chat`, que valida um payload mínimo de mensagens e usa a abstração de provider. A TASK 013 adicionou rotas internas para threads e mensagens do histórico. Não há SDKs Anthropic/OpenAI instalados, RAG, embeddings, upload, pgvector, streaming ou persistência de uso em banco.

A TASK 010.1 adicionou comportamento diagnóstico de fallback para falhas do provider Gemini. Testes de runtime confirmaram que a integração alcança a API Gemini e recebe uma resposta real da API. A TASK 010.2 documentou o bloqueio atual: quota/billing do Google. Gemini retorna `429 RESOURCE_EXHAUSTED`, e a quota free tier parece estar em `0` para o modelo Gemini testado. Não há bloqueio de código conhecido. O fallback mock permanece operacional enquanto a quota não estiver disponível. A documentação de fim do dia está sincronizada com TASK 011 como próxima task planejada.

A TASK 011 adicionou guardrails locais em memória para chamadas reais de IA. A API `/api/ai/chat` estima tokens de contexto, limita output, limita chamadas reais por dia e pode bloquear por custo estimado quando houver taxa configurada. Se um provider real exceder os limites, a rota evita a chamada externa e usa fallback mock. Esses contadores não persistem em Supabase e são resetados ao reiniciar o processo.

A TASK 013 adicionou persistência Supabase para histórico de chat usando as tabelas `chat_threads` e `chat_messages`. O chat carrega o thread remoto mais recente quando possível e persiste novas mensagens em background. Quando Supabase não está configurado ou falha, o fallback local em `localStorage` mantém a experiência funcionando.

## Arquitetura Planejada

A arquitetura planejada do SENSEI inclui:

- pgvector para busca semântica.
- Ingestão de documentos para materiais de estudo.
- OpenAI embeddings para indexação e recuperação por chunks.
- RAG para respostas do tutor baseadas em fontes.
- Providers Anthropic e OpenAI por trás da abstração de provider.
- Logging persistente de custo e tokens para chamadas de modelo.
- Fluxos de avaliação para casos RAG positivos e negativos.

## Ainda Não Implementado

Os componentes planejados acima ainda não foram implementados. O estado atual do repositório não possui extensão pgvector, tabela `document_chunks`, coluna de embeddings, SDK Anthropic, SDK OpenAI, fluxo de ingestão de documentos, pipeline RAG, eval runner, ownership multi-user com `user_id`, política RLS, UI de lista/seleção de histórico, persistência de uso em banco, streaming ou configuração de deploy.
