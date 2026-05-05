# GOV-006 — Política de Garantia de Qualidade

## Finalidade

Definir a política de QA do projeto SENSEI Data Engineer Mentor para manter qualidade sem transformar cada task pequena em um processo pesado.

QA deve proteger o projeto contra regressões, custos desnecessários e integrações frágeis, mantendo o ritmo incremental.

## Princípios

- QA leve por task.
- QA robusto por milestone.
- QA obrigatório antes de real AI.
- QA obrigatório antes de persistência em banco.
- QA obrigatório antes de deploy.
- Nenhum QA deve inventar escopo de produto.

## QA Leve por Task

Toda task com mudança de código deve validar, no mínimo:

```bash
pnpm lint
pnpm build
git status --short
```

Também verificar:

- arquivos alterados estão dentro do escopo;
- nenhuma dependência foi adicionada sem motivo;
- nenhum segredo foi criado ou versionado;
- próxima task não foi iniciada.

Tasks somente documentais não precisam rodar build/lint, salvo se código mudar por acidente.

## QA Robusto por Marco

Antes de fechar uma fase ou milestone, executar QA mais amplo:

- build e lint;
- revisão de rotas principais;
- revisão de navegação;
- revisão de variáveis de ambiente;
- revisão de dependências;
- revisão de documentação/status;
- teste manual dos fluxos principais.

## QA Antes de IA Real

Antes de integrar OpenAI, Anthropic ou outro provider real, validar:

- fluxo mock/local funcionando;
- UI não quebra em erro;
- não há chamadas automáticas desnecessárias;
- limites de custo/tokens estão planejados;
- nenhuma API key está hardcoded;
- `.env.local` continua fora do git;
- comportamento sem credenciais é claro.

## QA Antes de Persistência em Banco

Antes de persistir dados em Supabase/PostgreSQL, validar:

- schema/migrations revisadas;
- tipos TypeScript alinhados;
- impacto de single-user vs multi-user documentado;
- policy RLS/`user_id` não foi improvisada;
- nenhuma service role key é usada em fluxo de UI;
- falhas de banco são tratáveis.

## QA Antes de Deploy

Antes de qualquer deploy:

- `pnpm build` passa localmente;
- variáveis de ambiente necessárias estão documentadas;
- segredos não foram commitados;
- rotas principais carregam;
- auth/degradação sem env vars está compreendida;
- README e GOV-003 estão atualizados.

## Template Operacional de QA

Usar este formato para auditorias de baseline:

```md
1. Caminho do repo confirmado
2. Resumo executivo (PASS / PASS WITH WARNINGS / FAIL)
3. Resultado de build & lint
4. Rotas auditadas
5. Achados funcionais
6. Riscos encontrados
7. Correções recomendadas antes da próxima task
8. Go / No-Go
9. Confirmação de que nenhuma mudança de código foi feita
```

## Política de Go / No-Go

GO quando:

- lint passa;
- build passa;
- rotas esperadas existem;
- não há blocker TypeScript;
- não há dependência perigosa ou inesperada;
- não há segredo no repo;
- escopo da próxima task está claro.

PASS WITH WARNINGS quando:

- app está funcional;
- há riscos menores documentados;
- não há blocker para próxima task.

NO-GO quando:

- build falha;
- lint falha sem justificativa aceita;
- rotas principais quebram;
- segredo foi exposto;
- task anterior deixou escopo ambíguo;
- custo/API real pode ser acionado sem controle.

## Histórico de Atualizações

## 2026-04-29

Documento sincronizado no repositório após baseline de QA antes da integração com provider real de IA.
