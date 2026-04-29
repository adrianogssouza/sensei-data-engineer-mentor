# Development

## Local Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
```

## Expected Workflow

1. Read the relevant governance documents before starting a task.
2. Work on one task at a time.
3. Keep changes scoped to the current task.
4. Run validation commands appropriate to the files changed.
5. Summarize changed files, commands, validation, risks, and the next-task boundary.

For documentation-only tasks, `git status --short` and file listing/search checks are usually enough. For code changes, run `pnpm lint` and `pnpm build`.

## Branch and Commit Recommendations

- Use short-lived branches for meaningful task groups.
- Prefer branch names that include the task number, such as `codex/task-003-env-config`.
- Commit after a task is validated and reviewed.
- Keep commits focused on one task.

## Reporting Errors Back to ChatGPT

When something fails, paste the exact terminal error whenever possible. Prefer text logs over screenshots because they are searchable and easier to diagnose.

Include:

- the command that failed;
- the full error output;
- what changed immediately before the failure;
- whether the failure happens consistently.
