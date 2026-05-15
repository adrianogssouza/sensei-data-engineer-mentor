# Handoff de Portfólio v0.1-alpha

## Descrição Curta

SENSEI Data Engineer Mentor é um workspace pessoal de estudos com IA para acelerar a transição para Engenharia de Dados. A v0.1-alpha entrega a fundação do produto: workspace, chat com provider mock seguro, abstração para providers reais, integração Gemini preparada, histórico local/remoto quando Supabase está configurado, guardrails de uso/custo e documentação operacional.

## Pitch de Portfólio

Este projeto demonstra construção incremental de um produto de IA aplicado a aprendizado técnico. Em vez de começar por uma demo isolada de chatbot, o SENSEI organiza a base de um produto real: frontend em Next.js, contratos internos de IA, fallback seguro, persistência de histórico, fundação Supabase/Auth, guardrails de custo e documentação de entrega.

## O Que a v0.1-alpha Entrega

- App Next.js com TypeScript, Tailwind CSS, ESLint e pnpm.
- Workspace público em modo single-user/private.
- Chat em `/workspace/chat` usando API interna `/api/ai/chat`.
- Provider mock local como fluxo oficial da alpha.
- Provider Gemini integrado tecnicamente, mas desativado no fluxo oficial por quota/billing.
- Guardrails locais de contexto, output, chamadas reais, tokens e custo estimado.
- Persistência local do chat via `localStorage`.
- Rotas internas de histórico com Supabase para threads e mensagens.
- UI mínima de histórico para listar, abrir, criar e limpar conversas.
- Fundação Supabase Auth preservada para evolução futura.
- Checklist de deploy mock-first.
- QA local documentado.

## Como Demonstrar

1. Rodar o projeto:

```bash
env AI_PROVIDER=mock pnpm dev
```

2. Abrir:

```text
http://localhost:3000/workspace/chat
```

3. Mostrar:

- workspace sem login obrigatório;
- chat em modo `mock`;
- envio de pergunta e resposta local;
- painel de histórico;
- fallback local quando Supabase não está configurado;
- documentos `docs/deploy-mock-first.md` e `docs/qa-v0.1-alpha.md`.

## Decisões Técnicas Importantes

- Mock-first para evitar dependência de quota/billing de IA durante a alpha.
- Provider abstraction antes de acoplar o app a um vendor.
- Supabase preparado como backend principal, mas com fallback local para manter o app utilizável.
- Auth mantido como fundação futura, sem obrigar login no fluxo principal atual.
- RAG, embeddings, upload e pgvector deixados fora da alpha para evitar escopo infinito.

## Próximos Passos Recomendados

1. Executar deploy real mock-first na Vercel.
2. Configurar Supabase remoto e aplicar migrations com cuidado.
3. Validar histórico remoto em preview.
4. Preparar v0.1-beta com upload, chunks, embeddings, pgvector e RAG com fontes.
5. Melhorar UI/UX do workspace depois que o fluxo funcional estiver estável.

## Estado de Honestidade Técnica

A v0.1-alpha é uma fundação funcional, não um produto final. O app já conversa em modo mock, preserva fallback local, tem base de histórico e está preparado para deploy mock-first. Ainda não há RAG, upload de documentos, busca vetorial, streaming, multi-user final ou deploy real executado.
