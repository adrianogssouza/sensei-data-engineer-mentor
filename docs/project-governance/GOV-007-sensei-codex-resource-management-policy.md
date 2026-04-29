# GOV-007 — Codex Resource Management Policy

## Finalidade

Definir como escolher perfis de execução do Codex para equilibrar inteligência, velocidade, custo e risco por task.

O objetivo é usar capacidade suficiente para executar bem, sem desperdiçar contexto, tempo ou recursos.

## Política de Seleção de Modelo

Cada task operacional deve informar o perfil recomendado de Codex antes da execução.

Perfis recomendados:

- `fast`: tarefas simples, documentação pequena, inspeções diretas e validações leves.
- `balanced`: implementação comum, pequenas integrações, ajustes em UI, documentação com impacto moderado.
- `deep`: arquitetura, integrações sensíveis, debugging complexo, segurança, banco de dados, auth, IA real, RAG e decisões com risco alto.

Na dúvida, escolher o menor perfil que ainda preserve qualidade e segurança.

## Política de Inteligência

Usar mais raciocínio quando a task envolver:

- mudanças em contratos internos;
- autenticação, banco, RLS ou dados sensíveis;
- integração com providers pagos;
- decisões arquiteturais difíceis de reverter;
- risco de custo, segurança ou perda de dados.

Usar menos raciocínio quando a task for:

- leitura simples;
- atualização documental pequena;
- validação de comandos;
- correção pontual com baixo risco.

## Política de Velocidade

Preferir execução rápida quando:

- o escopo estiver bem definido;
- os arquivos afetados forem poucos;
- a validação for direta;
- não houver integração externa.

Aceitar execução mais lenta quando:

- a mudança tiver alto impacto;
- houver ambiguidade técnica;
- a task puder afetar custos, dados, auth ou deploy.

## Guia de Risco e Uso

- Não usar perfis altos para tarefas triviais.
- Não usar perfis baixos para tasks de IA real, banco, auth, segurança ou deploy.
- Evitar investigações amplas sem pergunta específica.
- Interromper ou propor nova sessão se o contexto ficar grande ou confuso.
- Registrar riscos relevantes no relatório final da task.

## Requisito Operacional

Todo prompt de task para Codex deve declarar:

- task ativa;
- objetivo;
- limites de escopo;
- perfil recomendado (`fast`, `balanced` ou `deep`).

Se o prompt não declarar perfil, Codex deve inferir o menor perfil seguro e registrar a escolha no relatório quando relevante.

## Histórico de Atualizações

## 2026-04-29

Documento sincronizado no repositório antes da TASK 010.
