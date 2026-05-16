# Retrieval Evals v0.1-beta

Status: dataset e fixtures versionados criados até TASK 033.

## O que existe

- Rota protegida `/api/documents/retrieval-evals`.
- UI em `/workspace/documents` para rodar um eval manual.
- Dataset padrão versionado em `src/lib/documents/retrieval-eval-dataset.json`.
- Fixtures versionadas em `src/lib/documents/retrieval-eval-fixtures.json`.
- Botão "Rodar dataset padrão" em `/workspace/documents`.
- Botão "Carregar fontes de eval" em `/workspace/documents`.
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

Quando a rota recebe `useDefaultDataset: true` ou um POST sem corpo, ela roda o
dataset padrão versionado.

Para preparar as fontes do dataset, use `POST /api/documents/retrieval-fixtures`
ou o botão "Carregar fontes de eval". Depois gere embeddings mock e rode o
dataset padrão.

## Dataset atual

- Versão: `retrieval-evals-v1`
- Casos:
  - SQL window functions
  - dbt incremental models
  - Airflow DAG retry

## Fixtures atuais

- Versão: `retrieval-eval-fixtures-v1`
- Fontes:
  - SQL eval fixture
  - dbt eval fixture
  - Airflow eval fixture

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

## Exemplo para rodar dataset padrão

```json
{
  "useDefaultDataset": true
}
```

## Limites atuais

- Até 10 casos por chamada.
- Até 8 resultados recuperados por caso.
- Eval não persiste histórico.
- O dataset depende de fontes compatíveis no Supabase, mas elas podem ser carregadas pelas fixtures versionadas.
- Não há nota agregada por categoria, threshold semântico ou avaliação por LLM.

## Validação feita

- `pnpm lint` passou.
- `pnpm build` passou.
- Produção foi validada carregando fixtures, gerando embeddings mock e rodando o dataset padrão com resultado 3/3.
