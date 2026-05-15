# Desenvolvimento

## Comandos Locais

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
```

## Fluxo Esperado

1. Ler os documentos de governança relevantes antes de iniciar uma task.
2. Trabalhar em uma task por vez.
3. Manter mudanças restritas ao escopo da task atual.
4. Rodar comandos de validação adequados aos arquivos alterados.
5. Resumir arquivos alterados, comandos executados, validação, riscos e limite da próxima task.

Para tasks apenas documentais, `git status --short` e buscas/listagens de arquivos geralmente são suficientes. Para mudanças em código, rodar `pnpm lint` e `pnpm build`.

## Recomendações de Branch e Commit

- Usar branches curtas para grupos significativos de tasks.
- Preferir nomes de branch com o número da task, como `codex/task-003-env-config`.
- Fazer commit depois que a task estiver validada e revisada.
- Manter commits focados em uma task.

## Como Reportar Erros ao ChatGPT

Quando algo falhar, colar o erro exato do terminal sempre que possível. Preferir logs em texto em vez de screenshots, porque são pesquisáveis e mais fáceis de diagnosticar.

Incluir:

- comando que falhou;
- saída completa do erro;
- o que mudou imediatamente antes da falha;
- se a falha acontece de forma consistente.

## Handoff de Portfólio

Para apresentar a v0.1-alpha, usar como referência:

- `docs/handoff-portfolio-v0.1-alpha.md`
- `docs/qa-v0.1-alpha.md`
- `docs/deploy-mock-first.md`

O comando recomendado para demo local é:

```bash
env AI_PROVIDER=mock pnpm dev
```
