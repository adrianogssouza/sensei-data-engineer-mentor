import { getPrivateAccessResponse, hasPrivateAccess } from "@/lib/private-access";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";

type CountTable = "documents" | "document_chunks";
type DocumentStatus = "ready" | "pending" | "needs_reprocess";
type EmbeddingStatus = "pending" | "ready" | "error" | "skipped";

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

async function getTableCount(table: CountTable): Promise<number> {
  const supabase = createServiceRoleSupabaseClient();
  const { count, error } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true });

  if (error) {
    throw error;
  }

  return count ?? 0;
}

async function getDocumentStatusCount(status: DocumentStatus): Promise<number> {
  const supabase = createServiceRoleSupabaseClient();
  const { count, error } = await supabase
    .from("documents")
    .select("id", { count: "exact", head: true })
    .eq("ingestion_status", status);

  if (error) {
    throw error;
  }

  return count ?? 0;
}

async function getEmbeddingStatusCount(status: EmbeddingStatus): Promise<number> {
  const supabase = createServiceRoleSupabaseClient();
  const { count, error } = await supabase
    .from("document_chunks")
    .select("id", { count: "exact", head: true })
    .eq("embedding_status", status);

  if (error) {
    throw error;
  }

  return count ?? 0;
}

function getWarnings(health: Omit<DocumentsHealth, "warnings" | "status">) {
  const warnings: string[] = [];

  if (health.documents.total === 0) {
    warnings.push("Nenhum documento cadastrado.");
  }

  if (health.documents.needsReprocess > 0) {
    warnings.push("Ha documentos aguardando reprocessamento.");
  }

  if (health.chunks.embeddingPending > 0) {
    warnings.push("Ha chunks aguardando geracao de embeddings.");
  }

  if (health.chunks.embeddingError > 0) {
    warnings.push("Ha chunks com erro de embedding.");
  }

  return warnings;
}

export async function GET(request: Request) {
  if (!hasPrivateAccess(request)) {
    return getPrivateAccessResponse();
  }

  try {
    const baseHealth = {
      checkedAt: new Date().toISOString(),
      database: {
        reachable: true,
      },
      documents: {
        total: await getTableCount("documents"),
        ready: await getDocumentStatusCount("ready"),
        pending: await getDocumentStatusCount("pending"),
        needsReprocess: await getDocumentStatusCount("needs_reprocess"),
      },
      chunks: {
        total: await getTableCount("document_chunks"),
        embeddingPending: await getEmbeddingStatusCount("pending"),
        embeddingReady: await getEmbeddingStatusCount("ready"),
        embeddingError: await getEmbeddingStatusCount("error"),
        embeddingSkipped: await getEmbeddingStatusCount("skipped"),
      },
    };
    const warnings = getWarnings(baseHealth);

    return Response.json({
      available: true,
      health: {
        ...baseHealth,
        status: warnings.length > 0 ? "degraded" : "ok",
        warnings,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Health check indisponivel.";

    return Response.json({
      available: false,
      error: message,
      health: {
        checkedAt: new Date().toISOString(),
        status: "degraded",
        database: {
          reachable: false,
        },
        documents: {
          total: 0,
          ready: 0,
          pending: 0,
          needsReprocess: 0,
        },
        chunks: {
          total: 0,
          embeddingPending: 0,
          embeddingReady: 0,
          embeddingError: 0,
          embeddingSkipped: 0,
        },
        warnings: [message],
      },
    });
  }
}
