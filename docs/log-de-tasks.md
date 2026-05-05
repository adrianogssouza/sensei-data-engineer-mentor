# Log de Tasks

## Log Cronológico

- TASK 000 - Concluída: bootstrap inicial e auditoria de ambiente.
- TASK 000.1 - Concluída: bloqueios locais de tooling corrigidos; `pnpm` e Supabase CLI validados.
- TASK 000.2 - Concluída: documentação oficial de governança sincronizada no repositório.
- TASK 001 - Concluída: estrutura inicial do projeto Next.js criada e validada com lint/build.
- TASK 002 - Concluída: documentação do repositório e instruções do Codex normalizadas.
- TASK 002.1 - Concluída: pacote documental oficial v2 sincronizado em `docs/project-governance/`.
- TASK 003 - Concluída: fundação Supabase criada com SDK, validação de ambiente e utilitários de client.
- TASK 004 - Concluída: fundação Supabase Auth criada com login email/password, signup, logout, server client com cookies, proxy e dashboard protegido.
- TASK 004.1 - Concluída: fluxo principal do app alterado para modo single-user/private com homepage pública e rota de workspace, preservando auth opcional.
- TASK 005 - Concluída: fundação local de dados Supabase criada com migration inicial single-user e tipos TypeScript do banco.
- TASK 006 - Concluída: shell do workspace e rotas placeholder de navegação criadas para chat, documents, usage e settings.
- TASK 007 - Concluída: UI de chat local-only com respostas determinísticas do assistente mock e estado React em memória.
- TASK 008 - Concluída: persistência local do chat mock adicionada com `localStorage` do navegador e controle para limpar conversa.
- TASK 008.1 - Concluída: GOV-006 Política de Garantia de Qualidade sincronizada no repositório após baseline de QA.
- TASK 009 - Concluída: skeleton de provider de IA criado com contratos tipados, provider mock local, provider registry e chat ainda rodando localmente sem chamadas externas.
- TASK 009.1 - Concluída: docs GOV-007/GOV-008 sincronizados e AGENTS.md atualizado para OPS v1.2.
- TASK 010 - Concluída: integração do provider Gemini adicionada com `@google/genai`, `/api/ai/chat`, fallback do provider registry para mock e wiring do chat API sem RAG, embeddings, upload, persistência Supabase ou streaming.
- TASK 010.1 - Concluída: diagnósticos Gemini e motivo de fallback melhorados para tornar falhas do provider visíveis em logs sanitizados do servidor e metadados mais claros na UI.
- TASK 010.2 - Concluída: limitação de quota runtime do Gemini documentada após resposta real da API retornar `429 RESOURCE_EXHAUSTED`; fallback mock permanece operacional.
- TASK 011 - Concluída: guardrails locais em memória adicionados para limitar chamadas reais de IA, tokens estimados, contexto, output e custo estimado configurável, mantendo fallback mock e sem persistência Supabase.
- Checkpoint atual - Concluído: guardrails locais de uso/custo implementados; próxima task planejada é TASK 012, a definir antes da próxima implementação.
