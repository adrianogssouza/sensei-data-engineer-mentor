# GOV-004 — Log de Decisões

## 2026-04-29

### DEC-001 — Codex como executor principal

Executor principal alterado para Codex.

Motivo:
Melhor fluxo de execução orientado a repositório.

Impacto:
Prompts devem ser estruturados como tasks pequenas e verificáveis.

---

### DEC-002 — ChatGPT como arquiteto/revisor

ChatGPT definido como arquiteto/revisor permanente.

Motivo:
Separar execução de estratégia.

Impacto:
Codex executa; ChatGPT planeja, revisa e controla escopo.

---

### DEC-003 — Camada formal de governança documental

Criada camada formal de governança documental.

Motivo:
Evitar perda de controle conforme crescimento do projeto.

Impacto:
Foram criados documentos GOV, STR e OPS.

---

### DEC-004 — Instalação de pnpm e Supabase CLI

TASK 000.1 concluída com instalação de pnpm e Supabase CLI.

Motivo:
Remover bloqueios técnicos antes da foundation Next.js.

Impacto:
Ambiente local ficou pronto para scaffold do app.

---

### DEC-005 — Fundação Next.js criada

TASK 001 concluiu a base inicial do projeto.

Motivo:
Criar fundação executável antes de backend/auth/IA.

Impacto:
Next.js, TypeScript, Tailwind, ESLint, src/ e alias @/* foram configurados.

---

### DEC-006 — Documentação e AGENTS.md normalizados

TASK 002 normalizou README, AGENTS.md, arquitetura, desenvolvimento e log de tasks.

Motivo:
Reduzir risco de drift operacional antes de backend/auth.

Impacto:
Codex passou a ter instruções internas mais claras.

---

### DEC-007 — GOV-005 criado como regras operacionais vivas

Criado documento permanente para regras operacionais do projeto.

Motivo:
Toda regra nova deve ser registrada nas fontes para evitar regressão.

Impacto:
Regras de execução, segurança, consumo, qualidade e comunicação passam a ter registro oficial.

---

### DEC-008 — Recomendações objetivas e executáveis

Definido que recomendações práticas devem ser diretas.

Motivo:
Reduzir textos longos quando a próxima ação já estiver clara.

Impacto:
Ao recomendar próximos passos, usar formato simples:
“Para seguir para a próxima etapa, agora é preciso fazer isso: ...”

---

### DEC-009 — Fundação Supabase antes de auth/database

TASK 003 criou a fundação mínima do Supabase antes de autenticação e migrations.

Motivo:
Preparar SDK, validação de ambiente e clients reutilizáveis sem antecipar UI de login, schema, RLS ou integrações de produto.

Impacto:
O projeto agora tem uma base Supabase validável por lint/build, mantendo auth, banco e migrations para tasks futuras.

---

### DEC-010 — Fundação Supabase Auth antes de schema/migrations

TASK 004 implementou a fundação de autenticação Supabase antes de criar schema de banco ou migrations.

Motivo:
Validar o fluxo mínimo de sessão com email/password, cookies e rota protegida antes de introduzir tabelas, RLS ou features de produto.

Impacto:
O projeto agora possui login, signup, logout, proxy de sessão e dashboard protegido, mantendo database schema, profiles, migrations e políticas RLS para tasks futuras.

---

### DEC-011 — Auth despriorizado e modo Single-User ativado

TASK 004.1 mudou o fluxo operacional para modo Single-User.

Motivo:
O projeto está privado e voltado a um único usuário neste momento. Remover login obrigatório acelera validação de produto e reduz fricção antes das features principais.

Impacto:
A homepage e `/workspace` ficam públicas para uso diário. Login, signup e `/dashboard` protegido continuam no código para uso futuro, mas auth não é mais o fluxo principal imediato.

---

### DEC-012 — Schema inicial single-user antes de IA/RAG

TASK 005 criou o schema inicial de dados em modo single-user antes de qualquer implementação de IA/RAG.

Motivo:
Preparar uma base local para histórico futuro, eventos de uso e documentos sem antecipar embeddings, upload, pgvector, chat UI ou multi-user/RLS.

Impacto:
O repositório agora possui estrutura `supabase/`, migration inicial e tipos TypeScript para as tabelas base. Migrations ainda não foram aplicadas a banco remoto.

---

### DEC-013 — Shell do workspace antes da implementação de features

TASK 006 criou o shell de workspace antes de implementar módulos funcionais.

Motivo:
Estabelecer navegação e estrutura visual para os futuros módulos do SENSEI sem acoplar cedo a banco, IA, RAG, upload ou chat.

Impacto:
O workspace agora possui layout, navegação interna e rotas placeholder para chat, documents, usage e settings. As páginas ainda não executam lógica de produto.

---

### DEC-014 — Local mock chat antes de provider real

TASK 007 implementou um chat local com respostas mock antes de integrar qualquer provider de IA.

Motivo:
Validar a experiência básica de conversa sem custo de API, sem dependência externa e sem acoplar cedo persistência, RAG ou provider real.

Impacto:
`/workspace/chat` agora permite enviar mensagens e receber respostas determinísticas locais. Integrações com IA, banco, streaming e RAG permanecem para tasks futuras.

---

### DEC-015 — Persistência local do chat antes de persistência no backend

TASK 008 adicionou persistência local do chat mock via `localStorage`.

Motivo:
Manter a experiência básica utilizável entre refreshes sem custo, sem API route, sem Supabase writes e sem complexidade de backend.

Impacto:
`/workspace/chat` agora preserva mensagens neste navegador e permite limpar a conversa. Persistência em Supabase, sync, histórico multi-dispositivo e integração com AI/RAG permanecem para tasks futuras.

---

### DEC-017 — Skeleton de provider de IA antes da integração com provider real

TASK 009 criou uma abstração interna de provider de IA antes de integrar Anthropic, OpenAI ou qualquer provider real.

Motivo:
Preparar contratos, seleção segura de provider e metadados de uso/custo sem risco de chamada externa, custo de API, dependência prematura ou acoplamento com backend.

Impacto:
O chat local passa a usar o provider mock por meio do skeleton. Anthropic/OpenAI seguem planejados, sem SDK instalado, sem API route, sem RAG, sem embeddings e sem chamadas externas.

---

### DEC-018 — Gemini escolhido como primeiro provider real para testes com controle de custo

TASK 010 integrou Gemini como primeiro provider real por trás da abstração interna de IA.

Motivo:
Gemini oferece caminho adequado para experimentação inicial com controle de custo/free-dev tier, permitindo validar integração real antes de OpenAI/Anthropic, RAG, embeddings ou persistência.

Impacto:
`@google/genai` foi adicionado, `/api/ai/chat` foi criado e o chat passou a chamar a API interna. Gemini só é usado quando `AI_PROVIDER=gemini` e `GEMINI_API_KEY` estão configurados; caso contrário, o mock provider continua como fallback seguro.

---

### DEC-019 — Provider Gemini validado tecnicamente; quota bloqueia resposta em runtime

TASK 010.2 registrou o status real de runtime do provider Gemini.

Motivo:
Teste manual confirmou que a integração alcança a API Gemini e recebe resposta real, mas a chamada é bloqueada por quota/billing do Google com `429 RESOURCE_EXHAUSTED`. O limite free tier parece estar em `0` para o modelo testado.

Impacto:
O bloqueio atual deve ser tratado como limitação de quota/billing, não como falha conhecida de integração. O mock fallback permanece operacional até haver quota disponível ou billing habilitado.

---

### DEC-020 — Checkpoint de fim do dia após TASK 010.2

O checkpoint de fim do dia sincronizou documentação e governança após a validação de quota Gemini.

Motivo:
Encerrar o bloco de trabalho com estado claro: Gemini está tecnicamente integrado, runtime real está bloqueado por quota/billing do Google, e o fallback mock permanece operacional.

Impacto:
A próxima sessão deve começar por TASK 011 — Guardrails de Uso / Custo. Não iniciar RAG, embeddings, upload, pgvector, persistência Supabase ou deploy antes dessa etapa.

---

### DEC-021 — Guardrails locais antes de aprofundar IA real

TASK 011 implementou guardrails locais em memória para chamadas reais de IA.

Motivo:
Antes de avançar com IA real, RAG ou persistência, o projeto precisa ter limites explícitos de uso/custo e fallback seguro para evitar consumo acidental de API.

Impacto:
`/api/ai/chat` passa a validar contexto, output, chamadas reais por dia, tokens estimados e custo estimado configurável. Quando um provider real excede limites, a rota usa fallback mock. A implementação não grava eventos em Supabase e os contadores são resetados ao reiniciar o processo.
