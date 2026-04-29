# SENSEI Agent Rules

## Required Reading

Before changing code, always read:

- `docs/project-governance/GOV-002-sensei-fonte-oficial-consolidada.md`
- `docs/project-governance/STR-001-sensei-plano-oficial-v2-3.md`
- `docs/project-governance/OPS-001-sensei-codex-operating-plan-v1-2.md`
- `docs/project-governance/GOV-003-sensei-status-atual.md`

For documentation-only tasks, also read the files being updated.

## Task Discipline

- Work one task at a time.
- Do not implement future tasks.
- Keep changes minimal and reviewable.
- Do not add dependencies unless necessary for the current task.
- Preserve existing meaningful documentation and code.
- Use `pnpm` for package and script commands.

## Secrets and Configuration

- Never commit secrets.
- Never hardcode API keys, tokens, service-role keys, or credentials.
- Do not commit `.env` or `.env.local`.
- Use `.env.local` only for local secrets.
- Keep `.env.example` limited to placeholders and safe defaults.

## Code Quality

- Preserve TypeScript strictness.
- Preserve Supabase RLS assumptions and `user_id` filtering once database work begins.
- Run `pnpm lint` and `pnpm build` when code changes.
- For documentation-only tasks, no build is required unless code files changed unexpectedly.

## Reporting

Always return:

1. Summary
2. Files changed
3. Commands run
4. Validation
5. Risks / notes
6. Confirmation next task was not started
