import {
  createEmbedding,
  getActiveEmbeddingProviderConfig,
} from "@/lib/documents/embeddings";
import { formatPgvectorEmbedding } from "@/lib/documents/mock-embeddings";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";

const DEFAULT_MAX_RESULTS = 5;

export type VectorChunkSearchResult = {
  chunkId: string;
  documentId: string;
  documentTitle: string;
  chunkIndex: number;
  content: string;
  charCount: number;
  similarity: number;
  embeddingProvider: string;
  embeddingModel: string;
  createdAt: string;
};

type SearchVectorDocumentChunksOptions = {
  maxResults?: number;
};

export async function searchVectorDocumentChunks(
  query: string,
  options: SearchVectorDocumentChunksOptions = {},
): Promise<VectorChunkSearchResult[]> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  const supabase = createServiceRoleSupabaseClient();
  const provider = getActiveEmbeddingProviderConfig();

  if (!provider.available) {
    return [];
  }

  const embeddingResult = await createEmbedding(normalizedQuery);
  const queryEmbedding = formatPgvectorEmbedding(embeddingResult.embedding);
  const { data, error } = await supabase.rpc("match_document_chunks", {
    query_embedding: queryEmbedding,
    match_count: options.maxResults ?? DEFAULT_MAX_RESULTS,
    embedding_provider_filter: embeddingResult.provider,
    embedding_model_filter: embeddingResult.model,
  });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => ({
    chunkId: row.chunk_id,
    documentId: row.document_id,
    documentTitle: row.document_title,
    chunkIndex: row.chunk_index,
    content: row.content,
    charCount: row.char_count,
    similarity: row.similarity,
    embeddingProvider: embeddingResult.provider,
    embeddingModel: embeddingResult.model,
    createdAt: row.created_at,
  }));
}
