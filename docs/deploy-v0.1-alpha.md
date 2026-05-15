# Deploy v0.1-alpha

## Resultado

Deploy real mock-first executado na Vercel.

URL pública:

```text
https://sensei-data-engineer-mentor.vercel.app
```

URL de chat:

```text
https://sensei-data-engineer-mentor.vercel.app/workspace/chat
```

Inspect URL:

```text
https://vercel.com/adrianogssouzas-projects/sensei-data-engineer-mentor/54djGbbMkLUAm8udEKGUcXfcLQXX
```

## Escopo

- Deploy executado em modo mock-first.
- Projeto Vercel linkado como `adrianogssouzas-projects/sensei-data-engineer-mentor`.
- Repositório GitHub conectado pela Vercel.
- `AI_PROVIDER=mock` passado no deploy.
- Nenhum Gemini real foi usado.
- Nenhuma migration remota Supabase foi aplicada.
- Nenhum RAG, upload, embeddings, pgvector ou multi-user/RLS foi implementado.

## Validação

- `/` respondeu `200`.
- `/workspace/chat` respondeu `200`.
- `/api/ai/chat` respondeu com `provider: mock` e `externalApiCall: false`.
- `/api/chat/threads` retornou indisponibilidade controlada por ausência de `NEXT_PUBLIC_SUPABASE_URL`.
- Browser interno confirmou workspace, chat, modo mock e painel de histórico na URL publicada.

## Notas

- Sem Supabase configurado na Vercel, o histórico remoto não fica disponível; o fallback local continua sendo o comportamento esperado.
- `.vercel/` foi criado localmente pela CLI e deve permanecer fora do Git.
- O domínio canônico atual é o domínio padrão da Vercel.
