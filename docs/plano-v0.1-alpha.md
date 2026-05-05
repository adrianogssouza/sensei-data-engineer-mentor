# Plano Curto v0.1-alpha

## Finalidade

Definir a sequência curta de trabalho para fechar a v0.1-alpha sem abrir escopo de RAG, embeddings, upload ou produto infinito.

## Decisão da TASK 012

A v0.1-alpha deve priorizar:

1. histórico de chat persistente;
2. deploy funcional;
3. validação mínima do fluxo principal;
4. documentação de handoff para portfólio.

## Próximas Tasks Planejadas

### TASK 013 — Persistência Supabase do histórico de chat

Objetivo:
- criar leitura/escrita de threads e mensagens usando o schema existente;
- conectar `/workspace/chat` a uma API interna segura;
- manter fallback local/mock quando Supabase não estiver configurado;
- não implementar RAG, embeddings, upload, pgvector ou multi-user/RLS.

Perfil recomendado: `deep`.

Motivo:
Persistência de histórico é parte explícita da v0.1-alpha e aumenta utilidade real do app.

### TASK 014 — UI mínima de histórico no workspace

Objetivo:
- listar conversas salvas;
- permitir abrir conversa existente;
- permitir criar/limpar conversa;
- manter UI simples e funcional.

Perfil recomendado: `balanced`.

Motivo:
Persistir sem conseguir navegar no histórico deixa o benefício incompleto.

### TASK 015 — Preparação de deploy mock-first

Objetivo:
- documentar variáveis de ambiente obrigatórias;
- validar `pnpm build`;
- garantir que o app funcione com `AI_PROVIDER=mock`;
- preparar checklist de Vercel sem exigir Gemini real.

Perfil recomendado: `balanced`.

Motivo:
Deploy faz parte da v0.1-alpha, mas não deve depender do desbloqueio de quota Gemini.

### TASK 016 — QA v0.1-alpha

Objetivo:
- validar rotas principais;
- validar chat;
- validar histórico;
- validar fallback mock;
- revisar documentação de status.

Perfil recomendado: `balanced`.

Motivo:
Antes de declarar v0.1-alpha fechada, o fluxo principal precisa estar verificável.

### TASK 017 — Handoff de portfólio v0.1-alpha

Objetivo:
- preparar descrição curta do projeto;
- registrar o que foi construído;
- registrar próximos passos;
- organizar README para leitura externa futura sem expor segredos.

Perfil recomendado: `fast`.

Motivo:
O objetivo principal do projeto é gerar utilidade real e ativo de carreira.

## Fora do Escopo Até Fechar v0.1-alpha

- RAG.
- Embeddings.
- Upload de documentos.
- pgvector.
- OpenAI/Anthropic SDK.
- Streaming.
- Multi-user.
- RLS final com `user_id`.
- Pagamentos.
- PWA.

## Decisão Sobre Gemini

Gemini permanece integrado tecnicamente, mas não é bloqueador da v0.1-alpha.

Enquanto houver `429 RESOURCE_EXHAUSTED`, o fluxo oficial é:

- usar `AI_PROVIDER=mock` por padrão;
- manter guardrails locais ativos;
- só testar Gemini real quando houver quota/billing disponível;
- não atrasar histórico/deploy por causa do provider real.

## Critério de Fechamento da v0.1-alpha

A v0.1-alpha pode ser considerada pronta quando:

- `/workspace` abre sem login obrigatório;
- `/workspace/chat` permite conversar;
- histórico de chat persiste em Supabase quando configurado;
- fallback mock funciona sem chave de IA;
- build passa;
- deploy está documentado ou executado;
- documentação de status está sincronizada.
