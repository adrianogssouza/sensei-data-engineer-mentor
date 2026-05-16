# Acesso Privado v0.1-alpha

Status: configurado na TASK 020.

## Decisão

O SENSEI permanece em modo single-user/private. Não haverá uso público nesta fase.

## Proteção aplicada

Quando `SENSEI_PRIVATE_ACCESS_PASSWORD` está configurada no ambiente:

- `/workspace` e subrotas exigem HTTP Basic Auth;
- `/api/chat/*` exige HTTP Basic Auth;
- `/api/ai/*` exige HTTP Basic Auth;
- a homepage `/` continua pública para apresentação do projeto.

Usuário do Basic Auth:

- `sensei`

Senha:

- armazenada apenas como variável sensível na Vercel;
- não deve ser commitada em `.env`, `.env.local` ou documentação.

## Validação feita em produção

- `/` sem senha retornou `200`.
- `/workspace/chat` sem senha retornou `401`.
- `/api/chat/threads` sem senha retornou `401`.
- `/api/chat/threads` com credencial válida retornou `available: true`.

## Fora do escopo

- Multi-user/RLS.
- Login obrigatório para o workspace.
- Contas públicas.
- Billing, planos ou permissões por usuário.
