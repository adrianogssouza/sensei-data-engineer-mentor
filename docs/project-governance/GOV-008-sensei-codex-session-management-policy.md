# GOV-008 — Codex Session Management Policy

## Finalidade

Definir regras para abrir, manter e encerrar sessões de Codex com eficiência de contexto e continuidade operacional.

O objetivo é evitar sessões longas demais, perda de foco e consumo desnecessário de tokens.

## Política de Sessões Curtas

Trabalhar em sessões curtas por sprint ou bloco de tasks relacionadas.

Uma sessão ideal deve manter:

- uma task ativa por vez;
- contexto recente e relevante;
- handoff claro ao final;
- validação executada antes de avançar.

## Quando Abrir Nova Sessão

Abrir nova sessão quando:

- o contexto estimado passar de 70%;
- houver mudança grande de assunto;
- forem concluídas 3 a 5 tasks;
- a sessão ficar confusa, repetitiva ou dispersa;
- o próximo trabalho exigir foco diferente do bloco atual.

## Continuidade Entre Sessões

Ao iniciar nova sessão, o handoff deve informar:

- repositório correto;
- última task concluída;
- próxima task planejada;
- arquivos ou docs importantes para ler;
- restrições de escopo;
- comandos mínimos de verificação.

Ao encerrar uma sessão, registrar:

- resumo;
- arquivos alterados;
- validação executada;
- riscos;
- confirmação de que a próxima task não começou.

## Eficiência de Tokens

- Preferir prompts cirúrgicos e pequenos.
- Evitar pedir revisão ampla sem objetivo.
- Evitar colar arquivos grandes quando eles já estão no repositório.
- Usar documentação oficial do repo como fonte de continuidade.
- Criar handoff enxuto quando a sessão estiver crescendo.
- Não misturar implementação, auditoria ampla e planejamento futuro na mesma task.

## Requisito Operacional

Codex deve recomendar nova sessão quando:

- o contexto estiver alto;
- a task seguinte for de natureza diferente;
- houver risco de confundir tarefas antigas com a task atual;
- a continuidade puder ser melhor preservada com handoff novo.

## Histórico de Atualizações

## 2026-04-29

Documento sincronizado no repositório antes da TASK 010.
