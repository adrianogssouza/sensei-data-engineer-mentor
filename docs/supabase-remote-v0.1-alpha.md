# Supabase Remoto v0.1-alpha

Status: configurado na TASK 019.

## Projeto usado

- Projeto Supabase: `xazgvdegyapkacsijvqw`
- URL pública do projeto: `https://xazgvdegyapkacsijvqw.supabase.co`
- Região observada no dashboard: US East 1
- Modo operacional: single-user/private

## O que foi configurado

- O repositório local foi linkado ao projeto remoto via Supabase CLI.
- A migration `20260429132612_initial_app_schema.sql` foi aplicada no banco remoto.
- A Vercel Production recebeu as variáveis `AI_PROVIDER`, `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- A aplicação foi redeployada em produção.
- Depois da TASK 020, o workspace e as APIs internas foram protegidos por `SENSEI_PRIVATE_ACCESS_PASSWORD` em produção.

## Validação feita

- `supabase migration list` mostrou a migration local e remota sincronizadas.
- `/api/chat/threads` na URL pública retornou `available: true`.
- Foi feito ciclo real de histórico na produção:
  - criar thread com mensagens;
  - ler mensagens persistidas;
  - listar thread ativa;
  - arquivar thread;
  - confirmar lista ativa vazia após o teste.

## Escopo que continua fora

- Gemini real segue bloqueado por quota/billing.
- Upload, embeddings, RAG, pgvector e persistência de uso continuam fora da alpha.
- Multi-user/RLS ainda não foi implementado; antes de abrir uso público, o modelo de segurança precisa ser revisado.
