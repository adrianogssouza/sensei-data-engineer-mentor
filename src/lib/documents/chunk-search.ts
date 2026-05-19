import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";

export const MAX_CHUNK_SEARCH_QUERY_LENGTH = 120;
const DEFAULT_MAX_RESULTS = 8;
const MAX_SCAN_RESULTS = 50;
const MAX_QUERY_TERMS = 6;
const MIN_TERM_LENGTH = 3;
const SEARCH_STOPWORDS = new Set([
  "ainda",
  "also",
  "como",
  "com",
  "das",
  "dos",
  "essa",
  "esse",
  "esta",
  "este",
  "explique",
  "explain",
  "for",
  "from",
  "isso",
  "para",
  "pela",
  "pelo",
  "por",
  "qual",
  "quais",
  "que",
  "sobre",
  "the",
  "uma",
  "voce",
  "what",
  "when",
  "where",
  "which",
  "with",
]);

export type ChunkSearchResult = {
  chunkId: string;
  documentId: string;
  documentTitle: string;
  chunkIndex: number;
  content: string;
  charCount: number;
  score: number;
  matchedTerms: string[];
  phraseMatches: number;
  termMatches: number;
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

function normalizeSearchText(value: string): string {
  return value
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function extractChunkSearchTerms(query: string): string[] {
  const normalizedQuery = normalizeChunkSearchQuery(query);

  if (!normalizedQuery) {
    return [];
  }

  const terms = normalizedQuery.match(/[\p{L}0-9_+#.-]+/gu) ?? [];
  const dedupedTerms = new Map<string, string>();

  for (const term of terms) {
    const normalizedTerm = normalizeSearchText(term);

    if (
      normalizedTerm.length >= MIN_TERM_LENGTH &&
      !SEARCH_STOPWORDS.has(normalizedTerm) &&
      !dedupedTerms.has(normalizedTerm)
    ) {
      dedupedTerms.set(normalizedTerm, term);
    }
  }

  return Array.from(dedupedTerms.values()).slice(0, MAX_QUERY_TERMS);
}

function escapeIlikePattern(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");
}

function countOccurrences(content: string, query: string): number {
  const normalizedContent = normalizeSearchText(content);
  const normalizedQuery = normalizeSearchText(query);
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

function getMatchedTerms(content: string, terms: string[]): string[] {
  return terms.filter((term) => countOccurrences(content, term) > 0);
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
  const supabase = createServiceRoleSupabaseClient();
  const queryTerms = extractChunkSearchTerms(normalizedQuery);
  const candidateQueries = Array.from(
    new Set([normalizedQuery, ...queryTerms].filter(Boolean)),
  );
  const rowsByChunkId = new Map<string, DocumentChunkRow>();

  for (const candidateQuery of candidateQueries) {
    const { data, error } = await supabase
      .from("document_chunks")
      .select("id,document_id,chunk_index,content,char_count,created_at,documents(title)")
      .ilike("content", `%${escapeIlikePattern(candidateQuery)}%`)
      .order("created_at", { ascending: false })
      .limit(MAX_SCAN_RESULTS);

    if (error) {
      throw error;
    }

    for (const row of (data ?? []) as DocumentChunkRow[]) {
      rowsByChunkId.set(row.id, row);
    }
  }

  return Array.from(rowsByChunkId.values())
    .map((row) => {
      const phraseMatches = countOccurrences(row.content, normalizedQuery);
      const matchedTerms = getMatchedTerms(row.content, queryTerms);
      const termMatches = matchedTerms.reduce(
        (total, term) => total + countOccurrences(row.content, term),
        0,
      );
      const score =
        phraseMatches * 12 + matchedTerms.length * 5 + termMatches * 2;

      return {
        chunkId: row.id,
        documentId: row.document_id,
        documentTitle: getDocumentTitle(row.documents),
        chunkIndex: row.chunk_index,
        content: row.content,
        charCount: row.char_count,
        score,
        matchedTerms,
        phraseMatches,
        termMatches,
        createdAt: row.created_at,
      };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.matchedTerms.length - a.matchedTerms.length ||
        a.chunkIndex - b.chunkIndex,
    )
    .slice(0, maxResults);
}
