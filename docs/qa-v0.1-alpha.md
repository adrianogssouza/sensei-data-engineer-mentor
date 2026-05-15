# QA v0.1-alpha

## Escopo

Validação mínima do fluxo principal da v0.1-alpha, mantendo o projeto em modo mock-first e single-user/private.

Fora do escopo desta validação:

- RAG.
- Embeddings.
- Upload de documentos.
- pgvector.
- Multi-user/RLS final.
- Deploy real.
- Gemini real.

## Ambiente

- Data: 2026-05-15
- Servidor local: `env AI_PROVIDER=mock pnpm dev`
- URL base: `http://localhost:3000`
- Supabase remoto: não configurado nesta validação
- Provider oficial da validação: `mock`

## Validações Executadas

### Rotas principais

- `/` respondeu `200`.
- `/workspace` respondeu `200`.
- `/workspace/chat` respondeu `200`.
- `/workspace/documents` respondeu `200`.
- `/workspace/usage` respondeu `200`.
- `/workspace/settings` respondeu `200`.

### API de IA

Request testado:

```bash
curl -s -X POST http://localhost:3000/api/ai/chat \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"Teste QA mock"}]}'
```

Resultado:

- `provider` retornou `mock`.
- `externalApiCall` retornou `false`.
- Resposta foi gerada sem chamada externa.

### Histórico / fallback

Request testado:

```bash
curl -s http://localhost:3000/api/chat/threads
```

Resultado:

- API retornou `available: false` por ausência de `NEXT_PUBLIC_SUPABASE_URL`.
- A UI manteve fallback local ativo.
- `/workspace/chat` mostrou histórico local e painel de histórico remoto vazio sem quebrar.

### Browser

Verificação visual feita no navegador interno:

- `/workspace/chat` carregou em modo `MODO DO PROVIDER: MOCK`.
- Painel de histórico carregou e exibiu estado vazio quando Supabase não estava configurado.
- Navegação do workspace apareceu com Overview, Chat, Documents, Usage e Settings.

Observação:

- A automação do navegador interno encontrou limitação ao preencher o textarea, então o envio de mensagem foi validado pela API `/api/ai/chat`. A prévia manual da tela permanece disponível no navegador.

### Qualidade técnica

- `pnpm lint` passou.
- `pnpm build` passou.
- `git diff --check` passou.

## Resultado

QA v0.1-alpha aprovado para o escopo mock-first local.

## Riscos Residuais

- Histórico remoto depende de Supabase configurado e migrations aplicadas no ambiente alvo.
- Deploy real ainda não foi executado.
- Gemini real segue bloqueado por quota/billing (`429 RESOURCE_EXHAUSTED`).
- O fluxo multi-user/RLS final continua fora do escopo.
