"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type DocumentsHealth = {
  checkedAt: string;
  status: "ok" | "degraded";
  database: {
    reachable: boolean;
  };
  documents: {
    total: number;
    ready: number;
    pending: number;
    needsReprocess: number;
  };
  chunks: {
    total: number;
    embeddingPending: number;
    embeddingReady: number;
    embeddingError: number;
    embeddingSkipped: number;
  };
  warnings: string[];
};

type DocumentsHealthApiResponse = {
  available?: boolean;
  error?: string;
  health?: DocumentsHealth;
};

type RecoverySmokeResult = {
  documentTitle: string;
  chunkIndex: number;
  score: number;
  content: string;
};

type RecoverySmokeApiResponse = {
  available?: boolean;
  error?: string;
  results?: RecoverySmokeResult[];
};

type RecoveryReadinessStatus = "ready" | "attention" | "blocked";

type RecoveryReadiness = {
  status: RecoveryReadinessStatus;
  label: string;
  detail: string;
};

function getRecoveryReadiness(health: DocumentsHealth) {
  if (!health.database.reachable) {
    return {
      status: "blocked",
      label: "Banco indisponivel",
      detail: "Confirme Supabase e variaveis de ambiente antes de testar recuperacao.",
    };
  }

  if (health.documents.total === 0 || health.chunks.total === 0) {
    return {
      status: "blocked",
      label: "Sem base recuperavel",
      detail: "Cadastre ou carregue fontes antes de avaliar recuperacao.",
    };
  }

  if (health.documents.needsReprocess > 0) {
    return {
      status: "attention",
      label: "Reprocessamento pendente",
      detail: "Reprocesse fontes alteradas antes de rodar evals ou usar o chat.",
    };
  }

  if (health.chunks.embeddingError > 0) {
    return {
      status: "attention",
      label: "Erro em embeddings",
      detail: "Revise chunks com erro antes de confiar no ranking hibrido.",
    };
  }

  if (health.chunks.embeddingPending > 0) {
    return {
      status: "attention",
      label: "Embeddings pendentes",
      detail: "Gere embeddings para melhorar a recuperacao hibrida.",
    };
  }

  return {
    status: "ready",
    label: "Pronto para evals",
    detail: "A base tem chunks e embeddings prontos para validar recuperacao.",
  };
}

function getPendingRecoveryReadiness(
  isLoading: boolean,
  message: string | null,
): RecoveryReadiness {
  if (isLoading) {
    return {
      status: "attention",
      label: "Verificando health",
      detail: "Aguardando leitura da base antes de liberar o teste de recuperacao.",
    };
  }

  if (message) {
    return {
      status: "blocked",
      label: "Health indisponivel",
      detail: "Corrija a configuracao do health documental antes de avaliar recuperacao.",
    };
  }

  return {
    status: "attention",
    label: "Health pendente",
    detail: "Atualize o painel para recalcular a prontidao da recuperacao.",
  };
}

export function DocumentHealthOverview() {
  const [health, setHealth] = useState<DocumentsHealth | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [smokeQuery, setSmokeQuery] = useState("window functions");
  const [smokeResults, setSmokeResults] = useState<RecoverySmokeResult[]>([]);
  const [smokeMessage, setSmokeMessage] = useState<string | null>(null);
  const [isRunningSmoke, setIsRunningSmoke] = useState(false);

  async function loadHealth() {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/documents/health", {
        cache: "no-store",
      });
      const payload = (await response.json()) as DocumentsHealthApiResponse;

      if (!response.ok || !payload.available || !payload.health) {
        setHealth(null);
        setMessage(payload.error ?? "Health documental indisponivel.");
        return;
      }

      setHealth(payload.health);
    } catch {
      setHealth(null);
      setMessage("Health documental indisponivel.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadHealth();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const recoveryReadiness = health
    ? getRecoveryReadiness(health)
    : getPendingRecoveryReadiness(isLoading, message);

  async function runRecoverySmoke(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = smokeQuery.trim();

    if (!query) {
      setSmokeResults([]);
      setSmokeMessage("Informe uma pergunta ou termo para testar.");
      return;
    }

    setIsRunningSmoke(true);
    setSmokeMessage(null);

    try {
      const response = await fetch(
        `/api/documents/search?q=${encodeURIComponent(query)}`,
        { cache: "no-store" },
      );
      const payload = (await response.json()) as RecoverySmokeApiResponse;
      const results = payload.results ?? [];

      if (!response.ok || !payload.available) {
        setSmokeResults([]);
        setSmokeMessage(payload.error ?? "Smoke test indisponivel.");
        return;
      }

      setSmokeResults(results);
      setSmokeMessage(
        results.length > 0
          ? `${results.length} chunk(s) recuperado(s).`
          : "Nenhum chunk encontrado para esta consulta.",
      );
    } catch {
      setSmokeResults([]);
      setSmokeMessage("Smoke test indisponivel.");
    } finally {
      setIsRunningSmoke(false);
    }
  }

  return (
    <section className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-medium text-zinc-950 dark:text-zinc-50">
            Health documental
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Sinal rapido da base de fontes, chunks e embeddings.
          </p>
        </div>
        <button
          className="border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-950 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-50 dark:hover:text-zinc-50"
          disabled={isLoading}
          onClick={() => void loadHealth()}
          type="button"
        >
          {isLoading ? "Verificando..." : "Atualizar"}
        </button>
      </div>

      {health ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <div className="border border-zinc-200 p-3 dark:border-zinc-800">
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
              Status
            </p>
            <p
              className={`mt-2 text-xl font-semibold ${
                health.status === "ok"
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-amber-700 dark:text-amber-400"
              }`}
            >
              {health.status}
            </p>
          </div>
          <div className="border border-zinc-200 p-3 dark:border-zinc-800">
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
              Fontes
            </p>
            <p className="mt-2 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
              {health.documents.total}
            </p>
          </div>
          <div className="border border-zinc-200 p-3 dark:border-zinc-800">
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
              Chunks
            </p>
            <p className="mt-2 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
              {health.chunks.total}
            </p>
          </div>
          <div className="border border-zinc-200 p-3 dark:border-zinc-800">
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
              Emb. pendentes
            </p>
            <p className="mt-2 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
              {health.chunks.embeddingPending}
            </p>
          </div>
        </div>
      ) : null}

      {health ? (
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          Banco {health.database.reachable ? "online" : "offline"} · prontas{" "}
          {health.documents.ready} · reprocessar{" "}
          {health.documents.needsReprocess} · erros de embedding{" "}
          {health.chunks.embeddingError}
        </p>
      ) : null}

      <div className="mt-4 border border-zinc-200 p-4 dark:border-zinc-800">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
              Recuperacao
            </p>
            <p
              className={`mt-2 text-base font-medium ${
                recoveryReadiness.status === "ready"
                  ? "text-emerald-700 dark:text-emerald-400"
                  : recoveryReadiness.status === "attention"
                    ? "text-amber-700 dark:text-amber-400"
                    : "text-red-700 dark:text-red-400"
              }`}
            >
              {recoveryReadiness.label}
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {recoveryReadiness.detail}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              className="border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:border-zinc-950 hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-50 dark:hover:text-zinc-50"
              href="/workspace/documents"
            >
              Abrir documentos
            </Link>
            <Link
              className="border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:border-zinc-950 hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-50 dark:hover:text-zinc-50"
              href="/workspace/chat"
            >
              Testar chat
            </Link>
          </div>
        </div>

        <form className="mt-4" onSubmit={runRecoverySmoke}>
          <label
            className="text-xs uppercase tracking-[0.16em] text-zinc-500"
            htmlFor="recovery-smoke-query"
          >
            Smoke test
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            <input
              className="min-w-0 flex-1 border border-zinc-300 bg-transparent px-3 py-2 text-sm text-zinc-950 outline-none transition-colors placeholder:text-zinc-500 focus:border-zinc-950 dark:border-zinc-700 dark:text-zinc-50 dark:focus:border-zinc-50"
              id="recovery-smoke-query"
              onChange={(event) => setSmokeQuery(event.target.value)}
              placeholder="Ex.: window functions"
              type="text"
              value={smokeQuery}
            />
            <button
              className="border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-950 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-50 dark:hover:text-zinc-50"
              disabled={isRunningSmoke}
              type="submit"
            >
              {isRunningSmoke ? "Testando..." : "Testar recuperacao"}
            </button>
          </div>
        </form>

        {smokeMessage ? (
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            {smokeMessage}
          </p>
        ) : null}

        {smokeResults[0] ? (
          <div className="mt-3 border-t border-zinc-200 pt-3 text-sm dark:border-zinc-800">
            <p className="font-medium text-zinc-950 dark:text-zinc-50">
              {smokeResults[0].documentTitle} · chunk{" "}
              {smokeResults[0].chunkIndex + 1} · score{" "}
              {smokeResults[0].score}
            </p>
            <p className="mt-2 line-clamp-3 leading-6 text-zinc-600 dark:text-zinc-400">
              {smokeResults[0].content}
            </p>
          </div>
        ) : null}
      </div>

      {health?.warnings.length ? (
        <p className="mt-3 text-sm text-amber-700 dark:text-amber-400">
          {health.warnings.join(" ")}
        </p>
      ) : null}

      {message ? (
        <p className="mt-3 text-sm text-red-700 dark:text-red-400">
          {message}
        </p>
      ) : null}
    </section>
  );
}
