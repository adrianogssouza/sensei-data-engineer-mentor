import { createServerSupabaseClient } from "@/lib/supabase/server";

export const MAX_CHUNK_SEARCH_QUERY_LENGTH = 120;
const DEFAULT_MAX_RESULTS = 8;
const MAX_SCAN_RESULTS = 50;

export type ChunkSearchResult = {
  chunkId: string;
  documentId: string;
  documentTitle: string;
  chunkIndex: number;
  content: string;
  charCount: number;
  score: number;
  createdAt: string;
};

type DocumentJoin = {
  title?: string | null;
};

type DocumentChunkRow = {
  id: string;
  document_id: string;
  chunk_index: number;
  content: string;
  char_count: number;
  created_at: string;
  documents: DocumentJoin | DocumentJoin[] | null;
};

type SearchDocumentChunksOptions = {
  maxResults?: number;
};

export function normalizeChunkSearchQuery(query: string | null): string | undefined {
  const trimmedQuery = query?.trim();

  if (!trimmedQuery) {
    return undefined;
  }

  return trimmedQuery.slice(0, MAX_CHUNK_SEARCH_QUERY_LENGTH);
}

function escapeIlikePattern(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");
}

function countOccurrences(content: string, query: string): number {
  const normalizedContent = content.toLocaleLowerCase("pt-BR");
  const normalizedQuery = query.toLocaleLowerCase("pt-BR");
  let count = 0;
  let index = normalizedContent.indexOf(normalizedQuery);

  while (index !== -1) {
    count += 1;
    index = normalizedContent.indexOf(
      normalizedQuery,
      index + normalizedQuery.length,
    );
  }

  return count;
}

function getDocumentTitle(documents: DocumentJoin | DocumentJoin[] | null): string {
  if (Array.isArray(documents) || !documents?.title) {
    return "Fonte sem titulo";
  }

  return documents.title;
}

export async function searchDocumentChunks(
  query: string,
  options: SearchDocumentChunksOptions = {},
): Promise<ChunkSearchResult[]> {
  const normalizedQuery = normalizeChunkSearchQuery(query);

  if (!normalizedQuery) {
    return [];
  }

  const maxResults = options.maxResults ?? DEFAULT_MAX_RESULTS;
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("document_chunks")
    .select("id,document_id,chunk_index,content,char_count,created_at,documents(title)")
    .ilike("content", `%${escapeIlikePattern(normalizedQuery)}%`)
    .order("created_at", { ascending: false })
    .limit(MAX_SCAN_RESULTS);

  if (error) {
    throw error;
  }

  return ((data ?? []) as DocumentChunkRow[])
    .map((row) => ({
      chunkId: row.id,
      documentId: row.document_id,
      documentTitle: getDocumentTitle(row.documents),
      chunkIndex: row.chunk_index,
      content: row.content,
      charCount: row.char_count,
      score: countOccurrences(row.content, normalizedQuery),
      createdAt: row.created_at,
    }))
    .sort((a, b) => b.score - a.score || a.chunkIndex - b.chunkIndex)
    .slice(0, maxResults);
}
