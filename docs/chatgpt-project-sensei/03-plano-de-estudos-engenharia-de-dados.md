# Plano de Estudos — Engenharia de Dados

Este plano é uma base inicial. O mentor pode adaptar conforme progresso, tempo disponível e dificuldades.

## Fase 1 — Fundamentos Essenciais

Objetivo: construir base sólida para não depender de ferramentas sem entender dados.

Tópicos:

- SQL básico e intermediário;
- joins;
- agregações;
- subqueries;
- CTEs;
- window functions;
- tipos de dados;
- normalização básica;
- leitura de plano de execução em nível introdutório.

Projetos pequenos:

- analisar vendas de uma loja fictícia;
- criar consultas para ranking, cohort simples e métricas de retenção;
- explicar cada query em linguagem natural.

Critério de pronto:

- escrever queries sem copiar;
- explicar joins e window functions;
- identificar quando uma query está errada.

## Fase 2 — Python para Dados

Objetivo: usar Python como ferramenta de automação e transformação.

Tópicos:

- leitura e escrita de arquivos;
- requests para APIs;
- tratamento de JSON;
- pandas básico;
- validação simples de dados;
- logs;
- organização de scripts.

Projetos pequenos:

- consumir uma API pública;
- salvar dados em CSV e PostgreSQL;
- tratar campos nulos e tipos;
- documentar o fluxo.

Critério de pronto:

- construir um script de ingestão simples;
- explicar cada etapa;
- lidar com erro básico de API ou dado inválido.

## Fase 3 — Banco de Dados e Modelagem

Objetivo: entender como organizar dados para análise.

Tópicos:

- PostgreSQL;
- chaves primárias e estrangeiras;
- índices básicos;
- modelagem dimensional;
- fatos e dimensões;
- granularidade;
- tabelas staging, intermediate e marts.

Projetos pequenos:

- modelar base de pedidos;
- criar fato de vendas e dimensões;
- escrever queries analíticas sobre o modelo.

Critério de pronto:

- explicar diferença entre OLTP e OLAP;
- definir granularidade;
- modelar fato/dimensão simples.

## Fase 4 — Pipelines ETL/ELT

Objetivo: criar fluxo de dados de ponta a ponta.

Tópicos:

- extração;
- transformação;
- carga;
- incremental vs full refresh;
- idempotência;
- logs;
- qualidade básica;
- tratamento de falhas.

Projetos pequenos:

- pipeline API -> staging -> marts;
- carga incremental por data;
- validação de contagem de linhas;
- documentação do pipeline.

Critério de pronto:

- executar pipeline repetidamente sem duplicar dados;
- explicar falhas e recuperação;
- documentar premissas.

## Fase 5 — dbt e Boas Práticas Analíticas

Objetivo: organizar transformações como projeto profissional.

Tópicos:

- models;
- sources;
- seeds;
- tests;
- docs;
- staging/intermediate/marts;
- lineage.

Projetos pequenos:

- transformar o projeto de pipeline em dbt;
- criar testes;
- gerar documentação;
- explicar lineage.

Critério de pronto:

- rodar dbt com sucesso;
- criar testes úteis;
- explicar organização do projeto.

## Fase 6 — Orquestração e Cloud Básica

Objetivo: entender operação de pipelines.

Tópicos:

- agendamento;
- retries;
- dependências;
- variáveis de ambiente;
- secrets;
- logs;
- deploy simples;
- noções de cloud.

Projetos pequenos:

- orquestrar pipeline com Prefect ou Airflow;
- configurar execução diária;
- registrar logs;
- simular falha e retry.

Critério de pronto:

- explicar o DAG/flow;
- recuperar falhas;
- separar segredo de código.

## Fase 7 — Portfólio e Entrevista

Objetivo: transformar aprendizado em evidência clara.

Entregáveis:

- README forte;
- diagrama de arquitetura;
- explicação do problema;
- decisões técnicas;
- limitações;
- próximos passos;
- queries demonstrativas;
- dashboard simples opcional.

Critério de pronto:

- apresentar o projeto em 5 minutos;
- responder perguntas técnicas;
- explicar trade-offs sem depender de IA.
