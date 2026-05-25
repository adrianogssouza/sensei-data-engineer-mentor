# GOV-004 — Log de Decisões

## 2026-04-29

### DEC-001 — Codex como executor principal

Executor principal alterado para Codex.

Motivo:
Melhor fluxo de execução orientado a repositório.

Impacto:
Prompts devem ser estruturados como tasks pequenas e verificáveis.

---

### DEC-002 — ChatGPT como arquiteto/revisor

ChatGPT definido como arquiteto/revisor permanente.

Motivo:
Separar execução de estratégia.

Impacto:
Codex executa; ChatGPT planeja, revisa e controla escopo.

---

### DEC-003 — Camada formal de governança documental

Criada camada formal de governança documental.

Motivo:
Evitar perda de controle conforme crescimento do projeto.

Impacto:
Foram criados documentos GOV, STR e OPS.

---

### DEC-004 — Instalação de pnpm e Supabase CLI

TASK 000.1 concluída com instalação de pnpm e Supabase CLI.

Motivo:
Remover bloqueios técnicos antes da foundation Next.js.

Impacto:
Ambiente local ficou pronto para scaffold do app.

---

### DEC-005 — Fundação Next.js criada

TASK 001 concluiu a base inicial do projeto.

Motivo:
Criar fundação executável antes de backend/auth/IA.

Impacto:
Next.js, TypeScript, Tailwind, ESLint, src/ e alias @/* foram configurados.

---

### DEC-006 — Documentação e AGENTS.md normalizados

TASK 002 normalizou README, AGENTS.md, arquitetura, desenvolvimento e log de tasks.

Motivo:
Reduzir risco de drift operacional antes de backend/auth.

Impacto:
Codex passou a ter instruções internas mais claras.

---

### DEC-007 — GOV-005 criado como regras operacionais vivas

Criado documento permanente para regras operacionais do projeto.

Motivo:
Toda regra nova deve ser registrada nas fontes para evitar regressão.

Impacto:
Regras de execução, segurança, consumo, qualidade e comunicação passam a ter registro oficial.

---

### DEC-008 — Recomendações objetivas e executáveis

Definido que recomendações práticas devem ser diretas.

Motivo:
Reduzir textos longos quando a próxima ação já estiver clara.

Impacto:
Ao recomendar próximos passos, usar formato simples:
“Para seguir para a próxima etapa, agora é preciso fazer isso: ...”

---

### DEC-009 — Fundação Supabase antes de auth/database

TASK 003 criou a fundação mínima do Supabase antes de autenticação e migrations.

Motivo:
Preparar SDK, validação de ambiente e clients reutilizáveis sem antecipar UI de login, schema, RLS ou integrações de produto.

Impacto:
O projeto agora tem uma base Supabase validável por lint/build, mantendo auth, banco e migrations para tasks futuras.

---

### DEC-010 — Fundação Supabase Auth antes de schema/migrations

TASK 004 implementou a fundação de autenticação Supabase antes de criar schema de banco ou migrations.

Motivo:
Validar o fluxo mínimo de sessão com email/password, cookies e rota protegida antes de introduzir tabelas, RLS ou features de produto.

Impacto:
O projeto agora possui login, signup, logout, proxy de sessão e dashboard protegido, mantendo database schema, profiles, migrations e políticas RLS para tasks futuras.

---

### DEC-011 — Auth despriorizado e modo Single-User ativado

TASK 004.1 mudou o fluxo operacional para modo Single-User.

Motivo:
O projeto está privado e voltado a um único usuário neste momento. Remover login obrigatório acelera validação de produto e reduz fricção antes das features principais.

Impacto:
A homepage e `/workspace` ficam públicas para uso diário. Login, signup e `/dashboard` protegido continuam no código para uso futuro, mas auth não é mais o fluxo principal imediato.

---

### DEC-012 — Schema inicial single-user antes de IA/RAG

TASK 005 criou o schema inicial de dados em modo single-user antes de qualquer implementação de IA/RAG.

Motivo:
Preparar uma base local para histórico futuro, eventos de uso e documentos sem antecipar embeddings, upload, pgvector, chat UI ou multi-user/RLS.

Impacto:
O repositório agora possui estrutura `supabase/`, migration inicial e tipos TypeScript para as tabelas base. Migrations ainda não foram aplicadas a banco remoto.

---

### DEC-013 — Shell do workspace antes da implementação de features

TASK 006 criou o shell de workspace antes de implementar módulos funcionais.

Motivo:
Estabelecer navegação e estrutura visual para os futuros módulos do SENSEI sem acoplar cedo a banco, IA, RAG, upload ou chat.

Impacto:
O workspace agora possui layout, navegação interna e rotas placeholder para chat, documents, usage e settings. As páginas ainda não executam lógica de produto.

---

### DEC-014 — Local mock chat antes de provider real

TASK 007 implementou um chat local com respostas mock antes de integrar qualquer provider de IA.

Motivo:
Validar a experiência básica de conversa sem custo de API, sem dependência externa e sem acoplar cedo persistência, RAG ou provider real.

Impacto:
`/workspace/chat` agora permite enviar mensagens e receber respostas determinísticas locais. Integrações com IA, banco, streaming e RAG permanecem para tasks futuras.

---

### DEC-015 — Persistência local do chat antes de persistência no backend

TASK 008 adicionou persistência local do chat mock via `localStorage`.

Motivo:
Manter a experiência básica utilizável entre refreshes sem custo, sem API route, sem Supabase writes e sem complexidade de backend.

Impacto:
`/workspace/chat` agora preserva mensagens neste navegador e permite limpar a conversa. Persistência em Supabase, sync, histórico multi-dispositivo e integração com AI/RAG permanecem para tasks futuras.

---

### DEC-017 — Skeleton de provider de IA antes da integração com provider real

TASK 009 criou uma abstração interna de provider de IA antes de integrar Anthropic, OpenAI ou qualquer provider real.

Motivo:
Preparar contratos, seleção segura de provider e metadados de uso/custo sem risco de chamada externa, custo de API, dependência prematura ou acoplamento com backend.

Impacto:
O chat local passa a usar o provider mock por meio do skeleton. Anthropic/OpenAI seguem planejados, sem SDK instalado, sem API route, sem RAG, sem embeddings e sem chamadas externas.

---

### DEC-018 — Gemini escolhido como primeiro provider real para testes com controle de custo

TASK 010 integrou Gemini como primeiro provider real por trás da abstração interna de IA.

Motivo:
Gemini oferece caminho adequado para experimentação inicial com controle de custo/free-dev tier, permitindo validar integração real antes de OpenAI/Anthropic, RAG, embeddings ou persistência.

Impacto:
`@google/genai` foi adicionado, `/api/ai/chat` foi criado e o chat passou a chamar a API interna. Gemini só é usado quando `AI_PROVIDER=gemini` e `GEMINI_API_KEY` estão configurados; caso contrário, o mock provider continua como fallback seguro.

---

### DEC-019 — Provider Gemini validado tecnicamente; quota bloqueia resposta em runtime

TASK 010.2 registrou o status real de runtime do provider Gemini.

Motivo:
Teste manual confirmou que a integração alcança a API Gemini e recebe resposta real, mas a chamada é bloqueada por quota/billing do Google com `429 RESOURCE_EXHAUSTED`. O limite free tier parece estar em `0` para o modelo testado.

Impacto:
O bloqueio atual deve ser tratado como limitação de quota/billing, não como falha conhecida de integração. O mock fallback permanece operacional até haver quota disponível ou billing habilitado.

---

### DEC-020 — Checkpoint de fim do dia após TASK 010.2

O checkpoint de fim do dia sincronizou documentação e governança após a validação de quota Gemini.

Motivo:
Encerrar o bloco de trabalho com estado claro: Gemini está tecnicamente integrado, runtime real está bloqueado por quota/billing do Google, e o fallback mock permanece operacional.

Impacto:
A próxima sessão deve começar por TASK 011 — Guardrails de Uso / Custo. Não iniciar RAG, embeddings, upload, pgvector, persistência Supabase ou deploy antes dessa etapa.

---

### DEC-021 — Guardrails locais antes de aprofundar IA real

TASK 011 implementou guardrails locais em memória para chamadas reais de IA.

Motivo:
Antes de avançar com IA real, RAG ou persistência, o projeto precisa ter limites explícitos de uso/custo e fallback seguro para evitar consumo acidental de API.

Impacto:
`/api/ai/chat` passa a validar contexto, output, chamadas reais por dia, tokens estimados e custo estimado configurável. Quando um provider real excede limites, a rota usa fallback mock. A implementação não grava eventos em Supabase e os contadores são resetados ao reiniciar o processo.

---

### DEC-022 — Sequência curta da v0.1-alpha definida

TASK 012 definiu a sequência curta de trabalho até o fechamento da v0.1-alpha.

Motivo:
O projeto precisa avançar para histórico e deploy sem abrir escopo de RAG, embeddings, upload ou projeto infinito. Como o Gemini real segue bloqueado por quota/billing, o provider real não deve impedir o avanço do MVP.

Impacto:
A próxima implementação será TASK 013 — Persistência Supabase do histórico de chat. Em seguida, o plano prioriza UI mínima de histórico, preparação de deploy mock-first, QA da v0.1-alpha e handoff de portfólio. Gemini continua integrado, mas o fluxo oficial segue com mock fallback até haver quota/billing disponível.

---

### DEC-023 — Persistência Supabase do histórico com fallback local

TASK 013 implementou persistência do histórico de chat usando o schema existente de `chat_threads` e `chat_messages`.

Motivo:
Histórico de chat é parte explícita da v0.1-alpha e aumenta a utilidade diária do app sem exigir RAG, embeddings ou provider real funcionando.

Impacto:
Foram criadas rotas internas para threads e mensagens, e `/workspace/chat` passou a sincronizar com Supabase quando configurado. Se Supabase não estiver configurado ou falhar, o chat continua usando `localStorage`. Limpar chat arquiva o thread remoto atual quando possível.

---

### DEC-024 — UI mínima de histórico antes do deploy

TASK 014 implementou a UI mínima de histórico no workspace.

Motivo:
Persistir conversas sem permitir navegação pelo histórico deixa o benefício incompleto para a v0.1-alpha.

Impacto:
`/workspace/chat` agora lista conversas remotas quando Supabase está disponível, permite abrir conversa existente, iniciar nova conversa e limpar conversa. O fallback local em `localStorage` permanece operacional quando Supabase não está configurado.

---

### DEC-025 — Deploy mock-first antes de depender de provider real

TASK 015 preparou o caminho de deploy mock-first para a v0.1-alpha.

Motivo:
Gemini segue bloqueado por quota/billing, então o deploy inicial precisa ser útil e validável com `AI_PROVIDER=mock`.

Impacto:
`.env.example` foi normalizado para variáveis atuais, o checklist `docs/deploy-mock-first.md` foi criado e `pnpm build` foi validado. Deploy real, projeto Vercel e migrations remotas ainda não foram executados. A próxima task planejada é TASK 016 — QA v0.1-alpha.

---

### DEC-026 — QA mock-first antes do handoff de portfólio

TASK 016 validou o fluxo local da v0.1-alpha em modo mock-first.

Motivo:
Antes de preparar o handoff de portfólio, o fluxo principal precisava estar verificável sem depender de Gemini real ou deploy.

Impacto:
Rotas principais, API de IA com provider mock, fallback de histórico sem Supabase, lint, build e diff check foram validados. O relatório foi registrado em `docs/qa-v0.1-alpha.md`. A próxima task planejada é TASK 017 — Handoff de portfólio v0.1-alpha.

---

### DEC-027 — Handoff de portfólio fecha a sequência curta da alpha

TASK 017 criou o handoff de portfólio da v0.1-alpha.

Motivo:
O objetivo principal do projeto é gerar utilidade real e ativo de carreira. Após histórico, deploy mock-first documentado e QA local, era necessário transformar a entrega em material apresentável.

Impacto:
`docs/handoff-portfolio-v0.1-alpha.md` foi criado com descrição, pitch, entregas, demo, decisões e próximos passos. O README foi reorganizado para leitura externa. A sequência curta da v0.1-alpha está concluída no escopo local/mock-first. O próximo bloco deve ser decidido entre deploy real mock-first e planejamento da v0.1-beta.

---

### DEC-028 — v0.1-alpha publicada em modo mock-first

TASK 018 executou o deploy real mock-first na Vercel.

Motivo:
Depois do handoff de portfólio, a alpha precisava sair do ambiente local para se tornar um ativo demonstrável.

Impacto:
O projeto foi linkado na Vercel como `adrianogssouzas-projects/sensei-data-engineer-mentor`, conectado ao GitHub e publicado em `https://sensei-data-engineer-mentor.vercel.app`. O deploy foi validado com provider mock e sem chamada externa de IA. Supabase remoto e migrations continuam para um próximo bloco.

---

### DEC-029 — Supabase remoto passa a armazenar histórico real

TASK 019 configurou o Supabase remoto para o histórico de chat em produção.

Motivo:
Depois da publicação mock-first, a aplicação precisava deixar de depender apenas do fallback local para histórico e provar persistência real na URL pública.

Impacto:
O projeto Supabase `xazgvdegyapkacsijvqw` foi linkado, recebeu a migration inicial `20260429132612` e foi configurado na Vercel Production com variáveis públicas de Supabase e `AI_PROVIDER=mock`. A URL `https://sensei-data-engineer-mentor.vercel.app` foi redeployada e validada com ciclo real de criar, ler, listar e arquivar conversa. O provider de IA continua mock por causa do bloqueio de quota/billing do Gemini.

---

### DEC-030 — Uso segue privado e protegido por senha simples

TASK 020 implementou hardening leve para o modo single-user/private.

Motivo:
O produto não terá uso público nesta fase; será usado apenas pelo Product Owner. Mesmo assim, como a URL está online, o workspace e as APIs internas precisam de uma barreira simples contra acesso externo acidental.

Impacto:
Foi adicionada a variável `SENSEI_PRIVATE_ACCESS_PASSWORD` e o proxy passou a proteger `/workspace`, `/api/chat/*` e `/api/ai/*` com HTTP Basic Auth quando essa variável está configurada. A homepage permanece pública para apresentação do projeto. A Vercel Production recebeu a senha como variável sensível e foi validada com bloqueio `401` sem credencial e acesso bem-sucedido com credencial válida. Multi-user/RLS e login obrigatório continuam fora do escopo por decisão de uso pessoal.

---

### DEC-031 — v0.1-beta começa por cadastro manual de fontes

TASK 021 iniciou o primeiro bloco funcional da v0.1-beta.

Motivo:
Antes de embeddings e RAG, o sistema precisa ter um inventário confiável de fontes que o usuário quer estudar ou transformar em base de conhecimento.

Impacto:
Foi criada a API protegida `/api/documents` para listar, cadastrar e remover registros da tabela `documents`. A tela `/workspace/documents` agora permite registrar título, tipo, referência e notas. A produção foi redeployada e validada com criação, listagem e remoção de fonte de teste. Upload físico, parsing, embeddings, pgvector e RAG permanecem fora do escopo até a próxima decisão.

---

### DEC-032 — Conteúdo bruto manual antes de chunks e embeddings

TASK 022 implementou a primeira ingestão manual de conteúdo.

Motivo:
Antes de chunks, embeddings e RAG, o sistema precisa guardar texto real das fontes de forma simples e auditável. A decisão foi começar por conteúdo bruto colado manualmente, evitando upload/parsing prematuro.

Impacto:
A tabela `documents` recebeu `raw_content`, `content_char_count` e `ingested_at` pela migration `20260516012500`. A API `/api/documents` passou a aceitar `rawContent`, calcular hash SHA-256 e marcar fontes com conteúdo como `ready`. A tela `/workspace/documents` ganhou campo de conteúdo bruto e visualização do texto salvo. A produção foi redeployada e validada com criação, listagem e remoção de fonte com conteúdo.

---

### DEC-033 — Chunks determinísticos antes de embeddings

TASK 023 implementou chunks simples de conteúdo.

Motivo:
Antes de embeddings, pgvector ou RAG, o sistema precisa ter uma etapa auditável de segmentação de conteúdo. Isso permite validar tamanho, contagem e persistência dos blocos sem depender de IA externa.

Impacto:
A migration `20260516014500` criou `document_chunks` e adicionou `chunk_count` em `documents`. A API `/api/documents` agora divide `rawContent` em chunks determinísticos com tamanho base de 1200 caracteres e sobreposição de 160 caracteres. A tela de documentos mostra a contagem de chunks. A produção foi redeployada e validada com criação, consulta no banco e remoção em cascade de chunks.

---

### DEC-034 — Busca lexical antes de busca semântica

TASK 024 implementou busca lexical/local sobre chunks.

Motivo:
Antes de embeddings e RAG, o projeto precisa provar que consegue recuperar trechos relevantes das fontes já cadastradas usando uma estratégia simples, auditável e barata.

Impacto:
Foi criada a rota protegida `/api/documents/search?q=...`, que consulta `document_chunks.content` com `ilike`, calcula um score simples por ocorrência do termo e retorna trechos ranqueados. A tela `/workspace/documents` ganhou a seção "Buscar nos chunks". A produção foi validada com criação de fonte temporária, busca por termos, retorno do chunk esperado e limpeza final.

---

### DEC-035 — Recuperação lexical no chat mock antes de embeddings

TASK 025 conectou a busca lexical/local ao fluxo de chat mock.

Motivo:
Antes de embeddings, pgvector e RAG semântico, o projeto precisa validar a experiência básica de o tutor responder usando trechos de fontes cadastradas. A decisão foi reaproveitar a busca lexical já validada e manter o provider mock determinístico, barato e auditável.

Impacto:
A lógica de busca em chunks foi extraída para um helper server compartilhado. A rota `/api/ai/chat` agora extrai termos da última mensagem do usuário, consulta `document_chunks` e envia os trechos encontrados ao provider mock por metadados internos. Quando há resultado, o mock responde citando a fonte, o índice do chunk e o trecho recuperado. Embeddings, pgvector, RAG semântico, streaming e providers pagos continuam fora do escopo.

---

### DEC-036 — Ranking lexical v2 antes de embeddings

TASK 026 melhorou o ranking lexical/local.

Motivo:
Antes de introduzir embeddings ou pgvector, o projeto precisa tornar a recuperação lexical atual mais confiável e rastreável. Isso reduz incerteza no comportamento do chat com fontes e cria uma base de comparação simples para a futura busca vetorial.

Impacto:
O helper de busca em chunks agora extrai termos relevantes, consulta frase e termos, consolida candidatos por chunk e calcula um score simples com `phraseMatches`, `termMatches` e `matchedTerms`. A rota de documentos e a rota de chat compartilham a mesma estratégia. O chat mock exibe score lexical e termos encontrados quando responde com fonte. Embeddings, pgvector e RAG semântico continuam fora do escopo.

---

### DEC-037 — Fundação pgvector antes de gerar embeddings

TASK 027 preparou o schema para embeddings.

Motivo:
Antes de gerar embeddings ou alterar o chat para busca semântica, o banco precisa ter uma estrutura explícita, versionada e validada para armazenar vetores por chunk. Isso mantém a evolução auditável e evita misturar schema, geração e ranking semântico em uma única task.

Impacto:
A migration `20260516120500` habilitou a extensão `vector` e adicionou campos de embedding em `document_chunks`: vetor de dimensão 1536, provider, modelo, status, erro e timestamp. Chunks novos ficam com `embedding_status = pending`. Os tipos TypeScript foram atualizados. A migration foi aplicada no Supabase remoto e validada com criação/remocão de fonte temporária. Geração de embeddings, busca vetorial e RAG semântico permanecem para tasks futuras.

---

### DEC-038 — Embeddings mock antes de embeddings pagos

TASK 028 implementou geração local determinística de embeddings.

Motivo:
Antes de usar OpenAI Embeddings ou outro provider pago, o projeto precisa validar persistência de vetores no pgvector, atualização de status e fluxo operacional de geração. Um provider mock determinístico evita custo, segredo e bloqueios de quota, mantendo a arquitetura preparada para trocar o backend depois.

Impacto:
Foi criado o provider `mock-hash-embedding-v1`, que gera vetores de 1536 dimensões a partir do texto do chunk. A rota protegida `/api/documents/embeddings` processa chunks pendentes e salva `embedding`, provider, modelo, status e timestamp. A tela de documentos ganhou botão para gerar embeddings. A produção foi validada com criação de fonte temporária, geração de 1 embedding e remoção da fonte. Busca vetorial e RAG semântico permanecem para tasks futuras.

---

### DEC-039 — Recuperação híbrida antes de RAG semântico

TASK 029 combinou busca lexical e vetorial no chat mock.

Motivo:
Antes de transformar o chat em RAG semântico, o projeto precisa validar que consegue recuperar fontes por dois sinais complementares: termos lexicais e similaridade vetorial. Manter fallback lexical reduz risco enquanto os embeddings ainda são mock/determinísticos.

Impacto:
A migration `20260516123000` criou a função SQL `match_document_chunks` para busca vetorial em pgvector. A rota protegida `/api/documents/vector-search` permite validar similaridade diretamente. A rota `/api/ai/chat` passou a combinar ranking lexical v2 com resultados vetoriais, gerando score híbrido e preservando fallback lexical. A produção foi validada com fonte temporária, geração de embedding, busca vetorial, resposta híbrida no chat e limpeza final.

---

### DEC-040 — Observabilidade antes de embeddings reais

TASK 030 tornou a recuperação visível na UI do chat.

Motivo:
Antes de trocar embeddings mock por embeddings reais ou avançar para upload/parsing, o usuário precisa enxergar por que uma resposta usou determinada fonte. Mostrar modo, ranking, contagens e termos reduz incerteza e facilita QA manual.

Impacto:
`ChatMessage` passou a aceitar `metadata`; `/api/chat/messages` persiste e lê esses metadados; o fallback local preserva mensagens com metadata seguro; e a lista de mensagens exibe um bloco de diagnóstico quando há recuperação. A produção foi validada com resposta `hybrid-local · hybrid-lexical-vector-v1`, contagens lexical/vetorial e termos usados. Embeddings reais, upload/parsing, evals e RAG semântico completo continuam para próximas tasks.

---

### DEC-041 — Eval manual antes de dataset versionado

TASK 031 criou avaliação manual de recuperação.

Motivo:
Antes de criar dataset versionado, embeddings reais ou upload/parsing, o projeto precisa de uma forma simples de checar se a recuperação híbrida retorna a fonte esperada no topo. Isso transforma QA manual em um fluxo repetível sem criar novas tabelas.

Impacto:
A lógica híbrida foi extraída para `src/lib/documents/hybrid-search.ts` e reutilizada pelo chat. A rota protegida `/api/documents/retrieval-evals` aceita casos manuais com pergunta, título esperado e trecho esperado, retornando passou/falhou e o resultado do topo. A tela `/workspace/documents` ganhou seção para rodar um eval manual. A produção foi validada com fonte temporária, embedding mock, eval aprovado e limpeza final.

---

### DEC-042 — Dataset versionado antes de embeddings reais

TASK 032 criou um dataset padrão de evals de recuperação.

Motivo:
Antes de trocar o mecanismo de embeddings ou adicionar upload/parsing, o projeto precisa de uma referência repetível para detectar regressões no ranking híbrido. Um dataset pequeno em JSON mantém a validação versionada no Git sem criar schema novo.

Impacto:
Foi criado `src/lib/documents/retrieval-eval-dataset.json` com versão `retrieval-evals-v1` e casos padrão de SQL, dbt e Airflow. A rota `/api/documents/retrieval-evals` roda o dataset quando recebe `useDefaultDataset: true` ou POST vazio, e a UI ganhou botão "Rodar dataset padrão" com resumo e resultado por caso. A produção foi validada com fontes temporárias compatíveis com o dataset, embeddings mock, execução 3/3 e limpeza final.

---

### DEC-043 — Fixtures versionadas antes de embeddings reais

TASK 033 criou fontes fixture para o dataset de evals.

Motivo:
O dataset versionado só é repetível se as fontes esperadas também puderem ser recriadas de forma controlada. Antes de avançar para embeddings reais ou upload/parsing, o projeto precisa de fixtures carregáveis que eliminem cadastro manual durante QA.

Impacto:
Foi criado `src/lib/documents/retrieval-eval-fixtures.json` com versão `retrieval-eval-fixtures-v1` e fontes padrão para SQL, dbt e Airflow. A rota protegida `/api/documents/retrieval-fixtures` recria essas fontes no Supabase de forma idempotente, com chunks prontos e embeddings pendentes. A tela `/workspace/documents` ganhou o botão "Carregar fontes de eval". A produção foi validada carregando fixtures, gerando embeddings mock e rodando o dataset padrão com resultado 3/3.

---

### DEC-044 — Upload textual local antes de storage/parsing avançado

TASK 034 implementou importação simples de arquivos textuais.

Motivo:
Antes de adicionar storage de arquivos, parsing de PDF ou pipeline assíncrono, o projeto precisa de um caminho prático para carregar conteúdo de estudo sem colar manualmente. Arquivos `.txt` e `.md` cobrem uma etapa útil com baixo risco e sem nova dependência.

Impacto:
`/workspace/documents` ganhou um input de arquivo que aceita `.txt`, `.md` e `.markdown`. O arquivo é lido localmente no navegador, preenche o conteúdo bruto, sugere título/sourcePath e usa o fluxo existente de cadastro para salvar documento, chunks, hash e status. Storage físico, PDF, DOCX, HTML remoto, OCR e embeddings reais continuam fora do escopo.

---

### DEC-045 — Reprocessamento de chunks antes de edição avançada

TASK 035 implementou reprocessamento de documentos pela UI/API.

Motivo:
Depois do cadastro por texto colado ou arquivo textual, o usuário precisa conseguir regenerar chunks de uma fonte já salva sem remover e recriar o documento inteiro. Isso torna a gestão de documentos mais segura antes de avançar para embeddings reais, parsing avançado ou edição completa de conteúdo.

Impacto:
O chunking foi extraído para `src/lib/documents/chunking.ts` e reutilizado pela rota principal e pela nova rota protegida `/api/documents/reprocess`. A tela `/workspace/documents` ganhou botão "Reprocessar" por fonte com `raw_content`. O reprocessamento apaga os chunks antigos do documento, cria novos chunks com `embedding_status = pending`, atualiza `chunk_count`/status de ingestão e orienta gerar embeddings novamente. Storage físico, PDF/DOCX/HTML, edição avançada e embeddings reais continuam fora do escopo.

---

### DEC-046 — Edição básica antes de parsing avançado

TASK 036 implementou edição básica de documentos existentes.

Motivo:
Depois de importar, cadastrar e reprocessar documentos, o usuário precisa corrigir título, referência, notas ou o próprio conteúdo bruto sem remover a fonte e recriá-la. Essa etapa torna a gestão documental prática antes de adicionar parsing de PDF, storage físico ou embeddings reais.

Impacto:
`PUT /api/documents` passou a atualizar título, tipo, referência, notas e `raw_content`. Quando o conteúdo muda, os chunks antigos são removidos e a fonte fica com `ingestion_status = needs_reprocess`, evitando que a busca use trechos desatualizados. A tela `/workspace/documents` ganhou botão "Editar" e formulário inline para salvar alterações. Parsing avançado, storage físico, embeddings reais e RAG semântico completo continuam fora do escopo.

---

### DEC-047 — Status operacional antes de nova capacidade de ingestão

TASK 037 implementou filtros e contadores de status na lista de documentos.

Motivo:
Depois de adicionar edição e reprocessamento, a tela passou a ter estados operacionais importantes: fontes prontas, pendentes e fontes com conteúdo alterado que precisam reprocessar. Antes de avançar para embeddings reais ou parsing avançado, o usuário precisa conseguir identificar rapidamente o que está pronto para busca/evals e o que exige ação.

Impacto:
`/workspace/documents` passou a exibir contadores de documentos prontos, pendentes e a reprocessar, além de filtros para todos, prontos, pendentes e reprocessar. A mudança é apenas de UI/QA operacional, sem novas rotas, migrations, storage físico, parsing avançado ou embeddings reais.

---

### DEC-048 — Reprocessamento em lote antes de embeddings reais

TASK 038 implementou reprocessamento em lote da fila `needs_reprocess`.

Motivo:
Depois de editar múltiplas fontes, reprocessar uma por uma gera atrito e aumenta chance de deixar a base em estado parcialmente desatualizado. Antes de avançar para embeddings reais, é melhor tornar o ciclo editar → reprocessar → gerar embeddings mais operacional.

Impacto:
`/workspace/documents` ganhou o botão "Reprocessar fila", que processa documentos com `ingestion_status = needs_reprocess` e `raw_content` disponível reutilizando a rota protegida `/api/documents/reprocess`. A mudança é apenas de UI/orquestração client-side, sem novas rotas, migrations, storage físico, parsing avançado ou embeddings reais.

---

### DEC-049 — Fila de embeddings antes de embeddings reais

TASK 039 implementou observabilidade da fila de embeddings.

Motivo:
Antes de trocar embeddings mock por embeddings reais, o usuário precisa enxergar quantos chunks ainda estão pendentes, prontos ou com erro. Isso reduz risco operacional e facilita QA sem custo externo.

Impacto:
`GET /api/documents/embeddings` passou a retornar contadores da fila por `embedding_status`, e `/workspace/documents` passou a exibir total, pendentes, prontos, erro e skipped com atualização manual. O `POST` de geração também retorna a fila atualizada. Não houve nova migration, job assíncrono, storage físico, parsing avançado ou embeddings reais.

---

### DEC-050 — RLS ativo com service-role server-only

TASK 040 implementou hardening de RLS no Supabase.

Motivo:
O Security Advisor do Supabase apontou tabelas públicas sem RLS. Como o projeto é single-user/private, a correção segura é bloquear acesso direto via anon key e manter acesso operacional somente pelas APIs internas protegidas do Next.js.

Impacto:
As APIs internas de chat, documentos, busca, embeddings e fixtures passaram a usar `SUPABASE_SERVICE_ROLE_KEY` apenas no servidor. A migration `20260519193000_enable_private_app_rls.sql` habilitou RLS nas tabelas `app_settings`, `chat_threads`, `chat_messages`, `usage_events`, `documents` e `document_chunks`, sem criar policies públicas. As rotas continuam protegidas por senha privada em produção.

---

### DEC-051 — QA pós-RLS antes de novas capacidades

TASK 041 validou o hardening de RLS antes de avançar para embeddings reais, parsing avançado ou QA documental novo.

Motivo:
Depois de ativar RLS em produção, era necessário confirmar que o schema remoto não tinha erros, que a anon key não conseguia escrever diretamente no banco e que as APIs públicas continuavam protegidas.

Impacto:
`supabase db lint --linked` passou sem erros, a tentativa de `POST` direto em `app_settings` com anon key retornou bloqueio por RLS, e as rotas públicas `/api/documents` e `/api/documents/embeddings` seguiram respondendo `401` sem credenciais. O teste autenticado via CLI não foi executado porque a Vercel não expõe o valor da senha privada no env pull; a validação visual/autenticada pode ser feita pelo usuário no browser.

---

### DEC-052 — Health documental antes de novas capacidades

TASK 042 implementou health documental protegido.

Motivo:
Depois do hardening de RLS, o projeto precisa de uma visão rápida para confirmar se o banco está acessível pelas APIs internas e se a base documental tem pendências de ingestão, chunks ou embeddings antes de avançar para embeddings reais ou parsing avançado.

Impacto:
Foi criada a rota protegida `/api/documents/health` com contagens de documentos, chunks e estados de embedding. A tela `/workspace/documents` passou a mostrar o painel "Health documental" e o botão "Verificar health". Não houve nova migration, provider externo, storage físico ou parsing de PDF.

---

### DEC-053 — Health documental no overview

TASK 043 levou o health documental para o overview do workspace.

Motivo:
Depois de criar o health na área de documentos, o usuário precisa ver o estado operacional da base logo ao abrir o workspace, sem navegar primeiro para a página de documentos.

Impacto:
`/workspace` passou a carregar um componente client que consulta `/api/documents/health`, mostra status, fontes, chunks e embeddings pendentes, e permite atualizar o sinal. Os cards do overview foram alinhados ao estado real do produto. Não houve nova migration, provider externo, storage físico ou parsing de PDF.

---

### DEC-054 — Prontidão de recuperação no overview

TASK 044 adicionou prontidão de recuperação/evals ao overview do workspace.

Motivo:
Depois de exibir o health documental no overview, o próximo passo pequeno era transformar os sinais de banco, fontes, chunks e embeddings em uma leitura operacional direta: bloqueado, atenção ou pronto para testar recuperação no chat/evals.

Impacto:
`/workspace` passou a derivar o estado "Recuperacao" a partir de `/api/documents/health`, com estados para health carregando/indisponível, base sem chunks, reprocessamento pendente, erro/pêndencia de embeddings e pronto para evals. O painel também inclui atalhos para `/workspace/documents` e `/workspace/chat`. Não houve nova migration, provider externo, storage físico, parsing de PDF ou embeddings reais.

---

### DEC-055 — Smoke test de recuperação no overview

TASK 045 adicionou um smoke test de recuperação ao overview do workspace.

Motivo:
Depois de mostrar prontidão de recuperação, o usuário precisa validar rapidamente se uma consulta simples retorna chunks sem navegar para a página de documentos e sem acionar provider externo.

Impacto:
`/workspace` passou a ter um campo de smoke test que chama `/api/documents/search`, mostra a quantidade de chunks recuperados e exibe o primeiro resultado quando existir. A mudança reaproveita a busca lexical/local existente, sem nova migration, provider externo, storage físico, parsing de PDF ou embeddings reais.

---

### DEC-056 — Fundação de embeddings reais via OpenAI

TASK 046 preparou embeddings reais como provider opcional.

Motivo:
Para o SENSEI ficar operacional de verdade com RAG, a base precisa sair do embedding mock e suportar embeddings reais sem quebrar o modo seguro atual. O próximo passo pequeno era criar a fundação server-side e manter a ativação dependente de variável de ambiente segura.

Impacto:
Foi criado provider de embeddings `mock`/`openai`, com mock como padrão e OpenAI ativável por `EMBEDDINGS_PROVIDER=openai`, `OPENAI_API_KEY` e `OPENAI_EMBEDDING_MODEL`. A rota `/api/documents/embeddings` passou a usar o provider ativo. A busca vetorial passou a gerar query embedding com o mesmo provider e a RPC `match_document_chunks` foi atualizada para filtrar `embedding_provider` e `embedding_model`, evitando misturar espaços vetoriais mock e reais. Não houve SDK novo, segredo commitado, storage físico ou parsing de PDF.

---

### DEC-057 — Visibilidade operacional do provider de embeddings

TASK 047 tornou o provider de embeddings visível em `/workspace/documents`.

Motivo:
Depois de preparar OpenAI como provider opcional, a operação precisava deixar claro se a geração está usando mock ou provider real e se a configuração atual permite gerar embeddings.

Impacto:
`/workspace/documents` passou a exibir provider, modelo e disponibilidade na área da fila de embeddings. Quando o provider configurado estiver indisponível, a ação de gerar embeddings fica bloqueada e a UI orienta configurar a chave antes de tentar gerar embeddings reais. Não houve nova migration, segredo commitado, provider novo, storage físico ou parsing de PDF.
