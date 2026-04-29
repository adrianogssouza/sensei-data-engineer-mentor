# GOV-005 — Regras Operacionais do Projeto

## Finalidade

Este documento registra regras operacionais permanentes do projeto SENSEI Data Engineer Mentor.

Toda regra criada durante a execução do projeto deve ser adicionada aqui para evitar regressão, retrabalho, confusão operacional ou desperdício de uso.

## Escopo

Estas regras valem para:

- ChatGPT
- Codex
- Usuário
- Repositório local
- Fontes documentais
- Fluxo de tarefas
- Gestão de custo e contexto

---

# BLOCO 1 — Execução no Codex

## REG-001 — Uma task por vez

O Codex deve executar apenas a task atual.

## REG-002 — Declarar task ativa

Todo prompt operacional deve informar:

- código da task
- objetivo
- limites de escopo

## REG-003 — Confirmar que próxima task não foi iniciada

Toda resposta do Codex deve confirmar que a próxima task não começou.

## REG-004 — Mudanças pequenas e revisáveis

Preferir alterações pequenas e específicas.

## REG-005 — Explicar arquivos alterados

Toda entrega deve informar:

- arquivos criados
- arquivos alterados
- comandos rodados
- validação executada

---

# BLOCO 2 — Segurança Operacional

## REG-006 — Confirmar diretório antes de agir

Antes de qualquer task relevante, rodar:

```bash
pwd
git status --short --branch
```

Objetivo: evitar trabalhar no projeto errado.

## REG-007 — Nunca hardcodar segredos

É proibido inserir API keys, tokens, senhas ou secrets no código versionado.

## REG-008 — Usar apenas .env.local para segredos locais

Arquivos proibidos no git:

- `.env`
- `.env.local`

## REG-009 — Não operar em projeto errado

Se o diretório atual não for o repositório SENSEI, a task deve ser interrompida.

---

# BLOCO 3 — Governança Documental

## REG-010 — GOV-002 é Source of Truth

Em conflito documental, seguir a precedência definida no GOV-002.

## REG-011 — Toda decisão importante vira log

Mudanças relevantes devem entrar em:

```txt
GOV-004-sensei-decision-log.md
```

## REG-012 — Toda regra nova entra neste arquivo

Sempre que surgir uma nova regra operacional válida, atualizar GOV-005.

## REG-013 — Atualizar status do projeto

Ao concluir task relevante, atualizar:

```txt
GOV-003-sensei-status-atual.md
```

---

# BLOCO 4 — Comunicação e Eficiência

## REG-014 — Recomendações devem ser diretas e executáveis

Quando houver recomendação prática, priorizar formato objetivo.

Evitar textos longos como:

- “O que eu faria no seu lugar”
- “Minha recomendação ideal”
- análises extensas quando a próxima ação já está clara

Preferir:

```txt
Para seguir para a próxima etapa, agora é preciso fazer isso:
1. ...
2. ...
3. ...
```

Objetivo:

- acelerar execução
- reduzir ruído
- facilitar decisão
- manter foco na próxima etapa

## REG-015 — Evitar prompts vagos

Evitar prompts como:

- melhora tudo
- refatora geral
- vê o projeto inteiro
- arruma qualquer problema

## REG-016 — Preferir prompts cirúrgicos

Usar prompts claros:

- corrigir erro X
- implementar TASK 004
- revisar migration Y

## REG-017 — Encerrar sessão degradada

Se contexto ficar confuso, repetitivo ou disperso, recomendar nova sessão.

---

# BLOCO 5 — Qualidade Técnica

## REG-018 — Quando código mudar, validar

Rodar quando aplicável:

```bash
pnpm lint
pnpm build
```

## REG-019 — Não instalar dependência sem motivo

Toda nova dependência deve ter justificativa clara.

## REG-020 — Não implementar feature futura

Cada task deve respeitar roadmap atual.

## REG-021 — Primeiro funcional, depois bonito

UX refinada vem depois da base funcionando.

---

# BLOCO 6 — Estratégia

## REG-022 — Objetivo principal não é app perfeito

Objetivo principal:

- aumentar empregabilidade
- gerar portfólio real
- aprender stack moderna
- criar MVP útil

## REG-023 — Evitar projeto infinito

Toda nova ideia deve responder:

> Isso aproxima da versão executável?

Se não, adiar.

---

# Histórico de Atualizações

## 2026-04-29

Documento criado e atualizado com regra de recomendações objetivas.
