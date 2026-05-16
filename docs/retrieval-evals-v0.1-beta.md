# Retrieval Evals v0.1-beta

Status: avaliação manual de recuperação criada na TASK 031.

## O que existe

- Rota protegida `/api/documents/retrieval-evals`.
- UI em `/workspace/documents` para rodar um eval manual.
- Reuso do mesmo ranking híbrido usado pelo chat.
- Saída com passou/falhou, resultado do topo, score híbrido e metadados de recuperação.

## Como funciona

Um caso de eval informa:

- pergunta;
- parte esperada do título da fonte;
- trecho esperado no conteúdo;
- opcionalmente, índice esperado do chunk pela API.

O sistema roda a recuperação híbrida lexical + vetorial e valida apenas o topo
do ranking. O caso passa quando o primeiro resultado bate com os critérios
informados.

## Exemplo de payload

```json
{
  "cases": [
    {
      "name": "Window functions",
      "query": "Explique window functions",
      "expectedDocumentTitle": "SQL",
      "expectedContentIncludes": "window",
      "expectedChunkIndex": 0
    }
  ],
  "maxResults": 3
}
```

## Limites atuais

- Até 10 casos por chamada.
- Até 8 resultados recuperados por caso.
- Eval é manual e não persiste histórico.
- Não há dataset versionado de evals ainda.
- Não há nota agregada por categoria, threshold semântico ou avaliação por LLM.

## Validação feita

- `pnpm lint` passou.
- `pnpm build` passou.
- Produção foi validada com fonte temporária, embedding mock, eval aprovado e limpeza final.
