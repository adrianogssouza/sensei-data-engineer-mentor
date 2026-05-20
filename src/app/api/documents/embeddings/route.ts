import {
  createEmbedding,
  getActiveEmbeddingProviderConfig,
} from "@/lib/documents/embeddings";
import { formatPgvectorEmbedding } from "@/lib/documents/mock-embeddings";
import { hasPrivateAccess, getPrivateAccessResponse } from "@/lib/private-access";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";

const DEFAULT_BATCH_LIMIT = 10;
const MAX_BATCH_LIMIT = 25;

type EmbeddingRequestBody = {
  limit?: unknown;
};

type PendingChunk = {
  id: string;
  content: string;
};

type EmbeddingQueueSummary = {
  total: number;
  pending: number;
  ready: number;
  error: number;
  skipped: number;
};

function normalizeLimit(limit: unknown): number {
  if (typeof limit !== "number" || !Number.isInteger(limit)) {
    return DEFAULT_BATCH_LIMIT;
  }

  return Math.min(Math.max(limit, 1), MAX_BATCH_LIMIT);
}

function getEmptyQueueSummary(): EmbeddingQueueSummary {
  return {
    total: 0,
    pending: 0,
    ready: 0,
    error: 0,
    skipped: 0,
  };
}

async function getEmbeddingQueueSummary(
  supabase: ReturnType<typeof createServiceRoleSupabaseClient>,
): Promise<EmbeddingQueueSummary> {
  const { data, error } = await supabase
    .from("document_chunks")
    .select("embedding_status")
    .limit(1000);

  if (error) {
    throw error;
  }

  return (data ?? []).reduce<EmbeddingQueueSummary>((summary, chunk) => {
    const status = chunk.embedding_status;
    summary.total += 1;

    if (status === "pending") {
      summary.pending += 1;
    } else if (status === "ready") {
      summary.ready += 1;
    } else if (status === "error") {
      summary.error += 1;
    } else {
      summary.skipped += 1;
    }

    return summary;
  }, getEmptyQueueSummary());
}

export async function GET(request: Request) {
  if (!hasPrivateAccess(request)) {
    return getPrivateAccessResponse();
  }

  try {
    const supabase = createServiceRoleSupabaseClient();
    const provider = getActiveEmbeddingProviderConfig();
    const queue = await getEmbeddingQueueSummary(supabase);

    return Response.json({
      available: true,
      provider: provider.provider,
      model: provider.model,
      providerAvailable: provider.available,
      queue,
    });
  } catch (error) {
    const provider = getActiveEmbeddingProviderConfig();
    const message =
      error instanceof Error ? error.message : "Fila de embeddings indisponivel.";

    return Response.json({
      available: false,
      error: message,
      provider: provider.provider,
      model: provider.model,
      providerAvailable: provider.available,
      queue: getEmptyQueueSummary(),
    });
  }
}

export async function POST(request: Request) {
  if (!hasPrivateAccess(request)) {
    return getPrivateAccessResponse();
  }

  let body: EmbeddingRequestBody = {};

  try {
    body = (await request.json()) as EmbeddingRequestBody;
  } catch {
    body = {};
  }

  const limit = normalizeLimit(body.limit);

  try {
    const supabase = createServiceRoleSupabaseClient();
    const provider = getActiveEmbeddingProviderConfig();

    if (!provider.available) {
      throw new Error("Provider de embeddings indisponivel.");
    }

    const { data, error } = await supabase
      .from("document_chunks")
      .select("id,content")
      .eq("embedding_status", "pending")
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error) {
      throw error;
    }

    const chunks = (data ?? []) as PendingChunk[];
    let embeddedCount = 0;
    let failedCount = 0;

    for (const chunk of chunks) {
      try {
        const result = await createEmbedding(chunk.content);
        const embedding = formatPgvectorEmbedding(result.embedding);
        const { error: updateError } = await supabase
          .from("document_chunks")
          .update({
            embedding,
            embedding_provider: result.provider,
            embedding_model: result.model,
            embedding_status: "ready",
            embedding_error: null,
            embedded_at: new Date().toISOString(),
          })
          .eq("id", chunk.id);

        if (updateError) {
          throw updateError;
        }

        embeddedCount += 1;
      } catch (error) {
        failedCount += 1;
        await supabase
          .from("document_chunks")
          .update({
            embedding_status: "error",
            embedding_error:
              error instanceof Error ? error.message : "Embedding failed.",
          })
          .eq("id", chunk.id);
      }
    }

    const queue = await getEmbeddingQueueSummary(supabase);

    return Response.json({
      available: true,
      provider: provider.provider,
      model: provider.model,
      providerAvailable: provider.available,
      limit,
      processedCount: chunks.length,
      embeddedCount,
      failedCount,
      queue,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Embeddings indisponiveis.";

    return Response.json({
      available: false,
      error: message,
      provider: getActiveEmbeddingProviderConfig().provider,
      model: getActiveEmbeddingProviderConfig().model,
      providerAvailable: getActiveEmbeddingProviderConfig().available,
      processedCount: 0,
      embeddedCount: 0,
      failedCount: 0,
      queue: getEmptyQueueSummary(),
    });
  }
}
