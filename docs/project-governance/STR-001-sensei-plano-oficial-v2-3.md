# STR-001 — SENSEI Data Engineer Mentor — Plano Oficial v2.3

## Visão

Tutor pessoal com IA focado em acelerar a transição para Engenharia de Dados.

## Objetivos iniciais

1. Ferramenta pessoal realmente útil.
2. Portfólio técnico forte.
3. Aumentar empregabilidade em dados/tech.
4. Base futura para micro-SaaS.

## Stack oficial

### Já iniciado no projeto

- Next.js
- TypeScript
- Tailwind CSS
- ESLint
- pnpm

### Planejado para próximas fases

- Supabase
- PostgreSQL
- pgvector
- OpenAI Embeddings
- Anthropic Claude
- Vercel

## Fluxo de trabalho oficial

- Executor principal: Codex
- Arquiteto/Revisor: ChatGPT
- Usuário: Product Owner

## Roadmap macro

- v0.1-alpha: login + chat + histórico + deploy
- v0.1-beta: upload + embeddings + RAG + fontes
- v0.1-final: confiança + eval + custos + PWA
- v0.2+: melhorias incrementais

## Status atual

- TASK 000 concluída
- TASK 000.1 concluída
- TASK 000.2 concluída
- TASK 001 concluída
- TASK 002 concluída
- TASK 003 concluída
- TASK 004 concluída
- TASK 004.1 concluída
- TASK 005 concluída
- TASK 006 concluída
- TASK 007 concluída
- TASK 008 concluída
- TASK 008.1 concluída
- TASK 009 concluída
- TASK 009.1 concluída
- TASK 010 concluída
- TASK 010.1 concluída
- TASK 010.2 concluída
- TASK 011 concluída
- TASK 012 concluída
- TASK 013 concluída
- TASK 014 concluída
- TASK 015 concluída
- TASK 016 concluída
- TASK 017 concluída
- TASK 018 concluída
- TASK 019 concluída
- TASK 020 concluída
- TASK 021 concluída
- TASK 022 concluída
- TASK 023 concluída
- TASK 024 concluída
- TASK 025 concluída
- TASK 026 concluída
- TASK 027 concluída
- TASK 028 concluída
- TASK 029 concluída
- TASK 030 concluída
- TASK 031 concluída
- TASK 032 concluída
- TASK 033 concluída
- TASK 034 concluída
- Ambiente local validado
- Documentação normalizada
- Fundação Next.js criada
- Gemini integrado tecnicamente, mas runtime real está limitado por quota/billing do Google (`429 RESOURCE_EXHAUSTED`).
- Mock fallback permanece operacional.
- Guardrails locais de uso/custo implementados.
- Plano curto da v0.1-alpha definido.
- Persistência Supabase do histórico de chat implementada com fallback local.
- UI mínima de histórico no workspace implementada.
- Preparação de deploy mock-first documentada e build validado.
- QA v0.1-alpha mock-first aprovado localmente.
- Handoff de portfólio v0.1-alpha concluído.
- Deploy real mock-first na Vercel concluído.
- Supabase remoto configurado, migration inicial aplicada e histórico de chat validado em produção.
- Hardening leve single-user/private concluído com proteção por senha no workspace e APIs internas.
- v0.1-beta iniciada com cadastro manual de fontes/documentos no Supabase remoto.
- Ingestão manual inicial de conteúdo implementada com `raw_content`, hash, contagem e status `ready`.
- Chunks simples de conteúdo implementados em `document_chunks`, sem embeddings/RAG.
- Busca lexical/local sobre chunks implementada, sem embeddings/RAG.
- Chat mock conectado à busca lexical/local sobre chunks, sem embeddings/RAG.
- Ranking lexical/local v2 implementado com termos relevantes, score simples e rastreabilidade básica, sem embeddings/RAG.
- Fundação pgvector/embeddings criada em `document_chunks`, ainda sem geração de embeddings/RAG.
- Geração local determinística de embeddings implementada para chunks pendentes, ainda sem RAG semântico.
- Recuperação híbrida lexical + vetorial implementada no chat mock, ainda sem RAG semântico.
- Observabilidade da recuperação exibida no chat com modo, ranking, contagens lexical/vetorial e termos usados.
- Eval manual de recuperação implementado para validar o topo do ranking híbrido.
- Dataset versionado de evals de recuperação implementado e executável pela UI/API.
- Fixtures versionadas de fontes de eval implementadas e carregáveis pela UI/API.
- Upload textual simples para `.txt`, `.md` e `.markdown` implementado no navegador.

## Próximo passo

Decidir próximo incremento após upload textual simples: embeddings reais, parsing avançado/PDF ou gestão de documentos.

## Regra central

O projeto deve aumentar chance real de entrada no mercado, não virar projeto infinito.
