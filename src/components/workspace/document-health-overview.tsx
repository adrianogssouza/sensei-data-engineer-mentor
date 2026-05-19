"use client";

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

export function DocumentHealthOverview() {
  const [health, setHealth] = useState<DocumentsHealth | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
