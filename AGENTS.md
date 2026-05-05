# Regras dos Agentes SENSEI

## Leitura Obrigatória

Antes de alterar código, sempre ler:

- `docs/project-governance/GOV-002-sensei-fonte-oficial-consolidada.md`
- `docs/project-governance/STR-001-sensei-plano-oficial-v2-3.md`
- `docs/project-governance/OPS-001-sensei-codex-operating-plan-v1-2.md`
- `docs/project-governance/GOV-003-sensei-status-atual.md`

Para tasks apenas documentais, ler também os arquivos que serão atualizados.

## Disciplina de Task

- Trabalhar em uma task por vez.
- Não implementar tasks futuras.
- Manter mudanças mínimas e revisáveis.
- Não adicionar dependências sem necessidade da task atual.
- Preservar documentação e código existentes que tenham significado.
- Usar `pnpm` para comandos de pacote e scripts.

## Segredos e Configuração

- Nunca commitar segredos.
- Nunca hardcodar API keys, tokens, service-role keys ou credenciais.
- Não commitar `.env` nem `.env.local`.
- Usar `.env.local` apenas para segredos locais.
- Manter `.env.example` limitado a placeholders e defaults seguros.

## Qualidade de Código

- Preservar strictness do TypeScript.
- Preservar premissas de RLS do Supabase e filtro por `user_id` quando o trabalho de banco começar.
- Rodar `pnpm lint` e `pnpm build` quando houver mudança de código.
- Para tasks apenas documentais, build não é obrigatório a menos que arquivos de código mudem inesperadamente.

## Relatório

Sempre retornar:

1. Resumo
2. Arquivos alterados
3. Comandos executados
4. Validação
5. Riscos / notas
6. Confirmação de que a próxima task não foi iniciada
