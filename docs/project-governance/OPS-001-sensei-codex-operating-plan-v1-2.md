# OPS-001 — Plano Operacional Codex v1.2

## Modelo operacional

- Uma task por vez
- Mudanças pequenas
- Sempre revisar diff
- Não avançar sem validação
- Confirmar diretório antes de agir

## Estado atual

- Task atual concluída: TASK 046
- Checkpoint: embeddings reais via OpenAI preparados como provider opcional; mock permanece padrão seguro
- Repositório bootstrapado
- Ambiente validado
- Documentação base criada e normalizada
- Gemini integrado tecnicamente
- Runtime real bloqueado por quota/billing do Google (`429 RESOURCE_EXHAUSTED`)
- Mock fallback operacional
- Guardrails locais em memória operacionais
- Próxima implementação definida: configurar embeddings reais em produção ou avançar para parsing avançado/PDF

## Próxima task

Ainda não definida.

Objetivo esperado:
- configurar `EMBEDDINGS_PROVIDER=openai` com `OPENAI_API_KEY` quando houver chave disponível, ou avançar para parsing avançado/PDF
- manter escopo pequeno e validável
- não implementar tudo de uma vez; uma task por vez
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
