# OPS-001 — Plano Operacional Codex v1.2

## Modelo operacional

- Uma task por vez
- Mudanças pequenas
- Sempre revisar diff
- Não avançar sem validação
- Confirmar diretório antes de agir

## Estado atual

- Task atual concluída: TASK 010.2
- Checkpoint: fim do dia após validação de quota Gemini
- Repositório bootstrapado
- Ambiente validado
- Documentação base criada e normalizada
- Gemini integrado tecnicamente
- Runtime real bloqueado por quota/billing do Google (`429 RESOURCE_EXHAUSTED`)
- Mock fallback operacional

## Próxima task

TASK 011 — Guardrails de Uso / Custo

Objetivo esperado:
- definir limites de uso/custo antes de aprofundar IA real
- manter mock fallback seguro
- não implementar RAG, embeddings, upload, pgvector ou persistência Supabase
- continuar usando sessões curtas de Codex
- declarar perfil recomendado de recursos por task conforme GOV-007

## Regras de consumo

Evitar prompts vagos:

- “melhore tudo”
- “refatore geral”
- “analise tudo e arrume”

Preferir prompts específicos:

- corrigir erro X
- implementar TASK Y
- revisar arquivo Z

## Entrega obrigatória do Codex

1. Arquivos alterados
2. Comandos executados
3. Como testar
4. Riscos
5. Confirmação de que não iniciou próxima task

## Regra de comunicação

Quando houver recomendação objetiva, usar formato direto:

> Para seguir para a próxima etapa, agora é preciso fazer isso:
> 1. ...
> 2. ...
