# Deploy Mock-First v0.1-alpha

## Finalidade

Preparar o SENSEI para deploy de v0.1-alpha sem depender de Gemini real. O fluxo oficial enquanto houver bloqueio de quota/billing do Gemini é usar `AI_PROVIDER=mock`.

## Escopo

Esta etapa prepara documentação e validação de build. Ela não executa deploy, não cria projeto Vercel, não aplica migrations remotas e não adiciona RAG, embeddings, upload, pgvector, multi-user/RLS ou novos providers.

## Variáveis de Ambiente

### Obrigatórias para deploy mock-first com histórico remoto

```bash
AI_PROVIDER=mock
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

`AI_PROVIDER=mock` mantém o chat sem chamadas externas de IA. As duas variáveis públicas do Supabase habilitam auth fundacional e histórico remoto de chat.

### Opcionais para Gemini no futuro

```bash
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.0-flash-lite
```

Só configurar `AI_PROVIDER=gemini` quando a conta Google tiver quota/billing disponível. Enquanto o erro `429 RESOURCE_EXHAUSTED` persistir, manter `AI_PROVIDER=mock`.

### Guardrails locais

```bash
DAILY_TOKEN_LIMIT=100000
DAILY_COST_LIMIT_USD=1.00
DAILY_AI_REQUEST_LIMIT=20
MAX_CONTEXT_TOKENS=6000
MAX_OUTPUT_TOKENS=600
AI_ESTIMATED_COST_USD_PER_1K_TOKENS=0
```

Esses valores são seguros para mock-first. Os contadores atuais são em memória e resetam quando o processo reinicia.

## Checklist Vercel

1. Conectar o repositório privado `adrianogssouza/sensei-data-engineer-mentor` na Vercel.
2. Manter framework como Next.js e package manager como `pnpm`.
3. Configurar build command como `pnpm build`.
4. Configurar install command como `pnpm install`.
5. Configurar `AI_PROVIDER=mock` em Production e Preview.
6. Configurar `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` quando o histórico remoto estiver pronto no projeto Supabase.
7. Não configurar `GEMINI_API_KEY` enquanto a quota/billing estiver bloqueada.
8. Não configurar service-role key no frontend ou em variáveis públicas.
9. Fazer primeiro deploy como preview.
10. Validar `/workspace` e `/workspace/chat` antes de promover para produção.

## Validação Local Antes do Deploy

```bash
pnpm lint
pnpm build
```

Validação funcional esperada:

- `/workspace` abre sem login obrigatório.
- `/workspace/chat` abre com provider mock.
- Enviar mensagem retorna resposta mock.
- Sem Supabase configurado, histórico remoto fica indisponível e fallback local permanece funcional.
- Com Supabase configurado, conversas aparecem na lista de histórico.

## Riscos Conhecidos

- Gemini real segue bloqueado por quota/billing (`429 RESOURCE_EXHAUSTED`).
- Sem Supabase configurado na Vercel, o deploy ainda abre o workspace e chat mock, mas não terá histórico remoto.
- Migrations remotas do Supabase não são aplicadas por este checklist.
- Auth continua opcional no fluxo principal; não recolocar login obrigatório sem nova decisão documentada.
