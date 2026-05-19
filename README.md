# SENSEI Data Engineer Mentor

SENSEI Data Engineer Mentor é um mentor pessoal de estudos com IA focado em Engenharia de Dados. O projeto está sendo construído de forma incremental para ser, ao mesmo tempo, uma ferramenta útil de estudo e um projeto forte de portfólio técnico.

## Visão de Portfólio

O SENSEI demonstra a construção incremental de um produto de IA com base real de aplicação: workspace, chat, abstração de providers, fallback seguro, persistência de histórico, fundação Supabase/Auth, guardrails de custo e documentação operacional.

A v0.1-beta roda em modo privado com Supabase remoto. A aplicação prova o fluxo principal sem depender de quota/billing de IA real, grava histórico de chat no banco remoto, protege o workspace por senha em produção e já permite cadastrar, editar e filtrar fontes/documentos com conteúdo bruto manual ou arquivo textual, reprocessar chunks individualmente ou em lote, acompanhar a fila de embeddings, buscar conteúdo com ranking lexical/local, gerar embeddings mock persistidos em pgvector, usar recuperação híbrida no chat mock, ver diagnóstico visual da recuperação por resposta, rodar eval manual do topo do ranking, dataset versionado de evals e fixtures carregáveis.

URL pública:

```text
https://sensei-data-engineer-mentor.vercel.app
```

## Fase Atual

Fase atual: v0.1-beta privada com RLS habilitado, upload textual simples, edição de documentos, filtros de status, reprocessamento em lote, fila de embeddings observável e recuperação híbrida lexical + vetorial observável e avaliada.

O repositório já possui a fundação inicial em Next.js, documentação de governança, fundação de client Supabase, fundação mínima de Supabase Auth, schema Supabase remoto com RLS habilitado, shell de workspace, UI de chat com persistência local/remota, UI mínima de histórico, skeleton interno de provider de IA, integração Gemini preparada, documentos manuais, upload textual simples, edição de documentos, filtros de status, chunks, reprocessamento individual/em lote, fila de embeddings, busca lexical ranqueada, pgvector, geração local determinística de embeddings, recuperação híbrida no chat mock, observabilidade da recuperação por mensagem, eval manual de recuperação, dataset padrão de evals e fixtures carregáveis. O modo operacional atual é single-user/private. RAG semântico completo, embeddings reais por provider externo, storage de arquivos, PDF/OCR e shadcn/ui ainda não foram implementados.

Handoff de portfólio: `docs/handoff-portfolio-v0.1-alpha.md`.

QA da alpha: `docs/qa-v0.1-alpha.md`.

Checklist de deploy mock-first: `docs/deploy-mock-first.md`.

Relatório do deploy: `docs/deploy-v0.1-alpha.md`.

## Demo Local

```bash
pnpm install
env AI_PROVIDER=mock pnpm dev
```

Abrir:

```text
http://localhost:3000/workspace/chat
```

O que demonstrar:

- workspace sem login obrigatório;
- chat em modo mock;
- resposta local sem chamada externa e, quando houver fonte compatível, com trecho recuperado;
- diagnóstico de recuperação no chat quando houver metadados de fonte;
- painel de histórico;
- cadastro manual de documentos com busca lexical;
- edição de documento existente com invalidação segura de chunks;
- filtros de status para encontrar fontes prontas, pendentes e a reprocessar;
- reprocessamento em lote da fila de fontes alteradas;
- visão da fila de embeddings por status de chunk;
- importação de `.txt`, `.md` e `.markdown` para preencher conteúdo bruto;
- reprocessamento de uma fonte para regenerar chunks;
- avaliação manual da recuperação no topo do ranking híbrido;
- execução do dataset padrão de evals de recuperação;
- carregamento das fontes fixture para o dataset;
- fallback local quando Supabase não está configurado;
- documentação de QA e deploy mock-first.

## Modo Operacional

Modo atual: Single-user / private.

O uso local recomendado começa em `/workspace`. A homepage pública aponta para workspace, login, signup e dashboard protegido. Auth permanece disponível no código para uso futuro, mas neste momento não é necessário para usar o workspace principal.

## Rotas do Workspace

Rotas disponíveis:

- `/workspace` - visão geral pública do workspace
- `/workspace/chat` - UI de chat com mock, histórico local e histórico Supabase quando configurado
- `/workspace/documents` - cadastro manual de fontes, conteúdo bruto, chunks e busca lexical
- `/workspace/usage` - visão de guardrails locais de uso/custo
- `/workspace/settings` - placeholder de configurações privadas

A página de chat chama `/api/ai/chat`, que usa o registry interno de providers. Gemini só é usado quando `AI_PROVIDER=gemini` e `GEMINI_API_KEY` estão configurados. Sem chave Gemini, o app volta para o provider mock determinístico. A rota de chat consulta chunks por busca lexical/local e, quando há embeddings prontos, combina similaridade vetorial em um score híbrido. O mock pode citar fonte, chunk, score híbrido, score lexical, termos encontrados e similaridade vetorial. A mensagem do assistente também pode exibir um bloco de diagnóstico com modo de recuperação, ranking, contagens lexical/vetorial e termos usados. A tela de documentos permite colar conteúdo, importar arquivo textual local, editar fonte existente, filtrar fontes por status, reprocessar chunks de uma fonte ou a fila inteira, carregar fontes fixture, rodar um eval manual ou o dataset padrão versionado contra o mesmo ranking híbrido. O histórico usa Supabase quando as variáveis públicas estão configuradas; caso contrário, as mensagens persistem neste navegador usando `localStorage`. A UI já permite listar conversas remotas, abrir conversa existente, criar nova conversa e limpar conversa. A página ainda não faz storage físico de arquivos, PDF/OCR ou RAG semântico completo.

## Stack Técnica Instalada

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- ESLint
- pnpm
- Supabase JavaScript SDK
- Supabase SSR helpers
- Fundação mínima de Supabase Auth
- Fundação local de schema/migration Supabase
- Skeleton interno de provider de IA com fallback mock
- Provider Gemini via `@google/genai`

## Entregue na v0.1-alpha

- Workspace público em modo single-user/private.
- Chat funcional com API interna de IA.
- Provider mock como fluxo oficial da alpha.
- Integração Gemini preparada, mas não bloqueante.
- Guardrails locais de uso/custo.
- Histórico local via `localStorage`.
- Rotas internas de histórico com Supabase quando configurado.
- UI mínima de histórico.
- Checklist de deploy mock-first.
- QA local documentado.

## Stack Planejada Ainda Não Instalada

- Embeddings reais via provider externo
- Anthropic Claude
- Providers reais de geração de texto com OpenAI/Anthropic
- Ingestão RAG e ferramentas de avaliação

## Desenvolvimento Local

Instalar dependências:

```bash
pnpm install
```

Rodar servidor de desenvolvimento:

```bash
pnpm dev
```

Rodar lint:

```bash
pnpm lint
```

Gerar build de produção:

```bash
pnpm build
```

## Ambiente Local e Deploy Mock-First

Crie `.env.local` localmente quando as credenciais do Supabase estiverem disponíveis. Não commitar esse arquivo. Para deploy inicial v0.1-alpha, seguir o checklist em `docs/deploy-mock-first.md`.

Padrão seguro para desenvolvimento e deploy mock-first:

```bash
AI_PROVIDER=mock
```

Necessário para uso do client Supabase, auth fundacional e histórico remoto:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Opcional para uso do provider Gemini:

```bash
AI_PROVIDER=gemini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.0-flash-lite
```

Gemini é o primeiro provider real para experimentação inicial com controle de custo/free-dev tier. Mantenha chaves reais apenas em `.env.local`. Se `AI_PROVIDER=gemini` estiver configurado sem `GEMINI_API_KEY`, o app volta para o provider mock. O provider mock permanece disponível com:

```bash
AI_PROVIDER=mock
```

Guardrails locais de uso/custo:

```bash
DAILY_TOKEN_LIMIT=100000
DAILY_COST_LIMIT_USD=1.00
DAILY_AI_REQUEST_LIMIT=20
MAX_CONTEXT_TOKENS=6000
MAX_OUTPUT_TOKENS=600
AI_ESTIMATED_COST_USD_PER_1K_TOKENS=0
```

Esses limites são aplicados em memória no servidor. Eles protegem chamadas
reais de IA antes de haver persistência em banco. Quando um provider real
excede os limites, o chat usa fallback mock. `AI_ESTIMATED_COST_USD_PER_1K_TOKENS=0`
mantém o guardrail de custo apenas informativo; defina um valor maior que zero
para bloquear por custo estimado.

A fundação de autenticação foi implementada com login por email/password, signup, logout e rota protegida de dashboard. Ela é opcional porque o app está operando em modo single-user/private. Para testar auth localmente:

1. Crie um projeto no Supabase.
2. Habilite email/password nas configurações do Supabase Auth.
3. Adicione a URL pública do projeto e a anon key em `.env.local`.
4. Rode `pnpm dev`.
5. Acesse `/signup`, `/login` e `/dashboard`.

As APIs internas protegidas usam service-role apenas no servidor para operar com RLS habilitado. A service-role key nunca deve ser exposta no browser.

## Schema Local do Supabase

A estrutura local do Supabase existe em `supabase/`, com migrations em:

```bash
supabase/migrations
```

Inspecionar migrations:

```bash
ls supabase/migrations
```

Não iniciar serviços locais do Supabase a menos que uma task peça isso explicitamente. A task atual não iniciou Docker, não aplicou migrations em banco local e não aplicou nada em projeto remoto do Supabase.

O schema é single-user/private, com RLS habilitado nas tabelas do app e acesso operacional feito por APIs internas protegidas. Ele ainda não inclui tabelas RAG, colunas de ownership por usuário ou políticas multi-user com `auth.uid()`.

## Estrutura do Projeto

```text
docs/
  arquitetura.md
  desenvolvimento.md
  log-de-tasks.md
  project-governance/
src/
  app/
    (auth)/
    (protected)/
    workspace/
  components/
    workspace/
  lib/
  types/
```

- `docs/project-governance/` contém documentos oficiais de governança, estratégia, status e decisões.
- `src/app/` contém a fundação do Next.js App Router.
- `src/app/(auth)/` contém páginas mínimas de login/signup e actions de auth.
- `src/app/(protected)/dashboard/` contém um dashboard mínimo protegido.
- `src/app/workspace/` contém o workspace público principal para uso diário.
- `src/app/workspace/*` contém o shell do workspace e rotas placeholder.
- `src/app/api/ai/chat/route.ts` contém a API route de chat com IA sem streaming.
- `src/app/api/chat/threads/route.ts` e `src/app/api/chat/messages/route.ts` contêm as rotas internas de histórico.
- `src/components/workspace/` contém componentes reutilizáveis simples do shell do workspace.
- `src/lib/ai/` contém o registry interno de providers de IA, provider mock e provider Gemini.
- `src/lib/env.ts` contém helpers de validação de ambiente.
- `src/lib/supabase/` contém a fundação dos clients Supabase browser/server e tipos placeholder do banco.
- `src/proxy.ts` atualiza cookies de auth do Supabase e protege `/dashboard`.
- `src/components/` e `src/types/` reservam espaço para código compartilhado futuro.
- `supabase/migrations/` contém a migration inicial aplicada no Supabase remoto escolhido para a alpha.

## Tasks Concluídas

- TASK 000 - Bootstrap inicial e auditoria de ambiente
- TASK 000.1 - Correção de bloqueios locais de tooling
- TASK 000.2 - Sincronização da documentação oficial do projeto no repositório
- TASK 001 - Criação da estrutura inicial do projeto Next.js
- TASK 002 - Normalização da documentação do repositório e instruções do Codex
- TASK 003 - Fundação Supabase
- TASK 004 - Fundação Supabase Auth
- TASK 004.1 - Mudança para modo Single-User
- TASK 005 - Fundação local de dados
- TASK 006 - Shell do workspace e navegação
- TASK 007 - Chat local com mock
- TASK 008 - Persistência local do chat
- TASK 008.1 - Sincronização do GOV-006 no repo
- TASK 009 - Skeleton de provider de IA
- TASK 009.1 - Sincronização de docs de governança de recursos/sessão
- TASK 010 - Integração do provider Gemini
- TASK 010.1 - Diagnóstico Gemini / motivo de fallback
- TASK 010.2 - Documentação da limitação de quota Gemini
- TASK 011 - Guardrails de Uso / Custo
- TASK 012 - Planejamento curto da v0.1-alpha
- TASK 013 - Persistência Supabase do histórico de chat
- TASK 014 - UI mínima de histórico no workspace
- TASK 015 - Preparação de deploy mock-first
- TASK 016 - QA v0.1-alpha
- TASK 017 - Handoff de portfólio v0.1-alpha
- TASK 018 - Deploy real mock-first na Vercel
- TASK 019 - Configuração do Supabase remoto para histórico real
- TASK 020 - Hardening leve single-user/private
- TASK 021 - Cadastro manual de fontes/documentos
- TASK 022 - Ingestão manual inicial de conteúdo
- TASK 023 - Chunks simples de conteúdo
- TASK 024 - Busca lexical/local sobre chunks
- TASK 025 - Busca lexical/local no chat mock
- TASK 026 - Ranking lexical/local v2
- TASK 027 - Fundação pgvector/embeddings
- TASK 028 - Geração mock de embeddings
- TASK 029 - Recuperação híbrida lexical + vetorial
- TASK 030 - Observabilidade da recuperação no chat
- TASK 031 - Eval manual de recuperação
- TASK 032 - Dataset versionado de evals de recuperação
- TASK 033 - Fixtures versionadas de fontes para evals
- TASK 034 - Upload textual simples
- TASK 035 - Reprocessamento de documentos
- TASK 036 - Edição básica de documentos
- TASK 037 - Filtros/status de documentos
- TASK 038 - Reprocessamento em lote
- TASK 039 - Observabilidade da fila de embeddings
- TASK 040 - Hardening RLS Supabase
- TASK 041 - QA pós-RLS

## Próximo Marco

Decidir próximo incremento após QA pós-RLS: embeddings reais, parsing avançado/PDF ou melhoria adicional de QA documental.

## Status do Provider de IA

Existe um skeleton interno de provider de IA em `src/lib/ai/`, com tipos compartilhados em `src/types/ai.ts`.

Provider padrão atual: `mock`.

Gemini está disponível pela rota server quando explicitamente habilitado com `AI_PROVIDER=gemini` e `GEMINI_API_KEY`. O modelo padrão é `gemini-2.0-flash-lite`, escolhido para experimentação com controle de custo. Se Gemini não estiver configurado ou falhar, o provider mock permanece como fallback.

Anthropic e OpenAI estão planejados como ids de provider, mas nenhum SDK Anthropic/OpenAI foi instalado. Ainda não há RAG semântico, embeddings reais por provider externo, upload, streaming ou persistência de uso em banco.

## Guardrails de Uso / Custo

A TASK 011 adicionou guardrails locais em memória para chamadas reais de IA:

- limite diário de chamadas reais;
- limite diário de tokens estimados;
- limite máximo de contexto por request;
- limite máximo de output por request;
- limite diário de custo estimado quando `AI_ESTIMATED_COST_USD_PER_1K_TOKENS` for maior que zero.

Esses guardrails não gravam eventos em Supabase e não implementam dashboard
persistente de custos. A rota `/workspace/usage` mostra o estado local em
memória do processo atual. Reiniciar o servidor zera esses contadores.

## Status Runtime do Gemini

A integração do provider Gemini está implementada e `/api/ai/chat` alcança a API Gemini quando configurada. O teste de chamada real está bloqueado por quota/billing do Google: a API retorna `429 RESOURCE_EXHAUSTED`, e a quota free tier parece estar em `0` para o modelo Gemini testado. Isso é uma limitação de conta/quota em runtime, não um bloqueio conhecido de integração de código.

O fallback mock permanece operacional. Para testar Gemini real no futuro, garanta que o projeto Google AI Studio/API tenha quota disponível ou billing habilitado, configure as variáveis Gemini em `.env.local` e reinicie `pnpm dev`.

Checkpoint atual: o trabalho está sincronizado até TASK 041. A v0.1-beta já protege tabelas Supabase com RLS validado, permite cadastrar, editar e filtrar fontes com conteúdo bruto, importar arquivos textuais, reprocessar chunks individualmente/em lote, acompanhar a fila de embeddings, buscar trechos com ranking lexical/local, gerar embeddings mock por chunk, usar recuperação híbrida no chat mock e validar recuperação com evals versionados.

## Segredos

Nunca commitar segredos no git. Use `.env.local` apenas para segredos locais e mantenha chaves reais fora do versionamento. `.env.example` deve conter apenas placeholders.
