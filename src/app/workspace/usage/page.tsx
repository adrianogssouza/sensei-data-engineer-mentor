import { getAiUsageGuardrailStatus } from "@/lib/ai/usage-guardrails";

export const dynamic = "force-dynamic";

export default function WorkspaceUsagePage() {
  const { config, state } = getAiUsageGuardrailStatus();

  return (
    <div>
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
        Uso
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
        Guardrails locais de uso e custo
      </h2>
      <p className="mt-4 max-w-2xl text-zinc-700 dark:text-zinc-300">
        Esta tela mostra limites locais em memória para chamadas reais de IA.
        Ainda não há persistência em banco, RAG, embeddings ou sync com
        Supabase. Se um provider real exceder os limites, o chat usa fallback
        mock.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="border border-zinc-200 p-4 dark:border-zinc-800">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            Limites
          </p>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Chamadas reais/dia</dt>
              <dd className="font-medium text-zinc-950 dark:text-zinc-50">
                {config.DAILY_AI_REQUEST_LIMIT}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Tokens/dia</dt>
              <dd className="font-medium text-zinc-950 dark:text-zinc-50">
                {config.DAILY_TOKEN_LIMIT}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Contexto máximo</dt>
              <dd className="font-medium text-zinc-950 dark:text-zinc-50">
                {config.MAX_CONTEXT_TOKENS}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Output máximo</dt>
              <dd className="font-medium text-zinc-950 dark:text-zinc-50">
                {config.MAX_OUTPUT_TOKENS}
              </dd>
            </div>
          </dl>
        </div>

        <div className="border border-zinc-200 p-4 dark:border-zinc-800">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            Uso em memória
          </p>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Data</dt>
              <dd className="font-medium text-zinc-950 dark:text-zinc-50">
                {state.dateKey}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Chamadas reais</dt>
              <dd className="font-medium text-zinc-950 dark:text-zinc-50">
                {state.externalRequests}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Tokens estimados</dt>
              <dd className="font-medium text-zinc-950 dark:text-zinc-50">
                {state.tokens}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Custo estimado</dt>
              <dd className="font-medium text-zinc-950 dark:text-zinc-50">
                US$ {state.estimatedCostUsd.toFixed(4)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
