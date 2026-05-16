import {
  createMockEmbedding,
  formatPgvectorEmbedding,
  MOCK_EMBEDDING_MODEL,
  MOCK_EMBEDDING_PROVIDER,
} from "@/lib/documents/mock-embeddings";
import { hasPrivateAccess, getPrivateAccessResponse } from "@/lib/private-access";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const DEFAULT_BATCH_LIMIT = 10;
const MAX_BATCH_LIMIT = 25;

type EmbeddingRequestBody = {
  limit?: unknown;
};

type PendingChunk = {
  id: string;
  content: string;
};

function normalizeLimit(limit: unknown): number {
  if (typeof limit !== "number" || !Number.isInteger(limit)) {
    return DEFAULT_BATCH_LIMIT;
  }

  return Math.min(Math.max(limit, 1), MAX_BATCH_LIMIT);
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
    const supabase = await createServerSupabaseClient();
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
        const embedding = formatPgvectorEmbedding(
          createMockEmbedding(chunk.content),
        );
        const { error: updateError } = await supabase
          .from("document_chunks")
          .update({
            embedding,
            embedding_provider: MOCK_EMBEDDING_PROVIDER,
            embedding_model: MOCK_EMBEDDING_MODEL,
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

    return Response.json({
      available: true,
      provider: MOCK_EMBEDDING_PROVIDER,
      model: MOCK_EMBEDDING_MODEL,
      limit,
      processedCount: chunks.length,
      embeddedCount,
      failedCount,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Embeddings indisponiveis.";

    return Response.json({
      available: false,
      error: message,
      processedCount: 0,
      embeddedCount: 0,
      failedCount: 0,
    });
  }
}
