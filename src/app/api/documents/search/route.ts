import { hasPrivateAccess, getPrivateAccessResponse } from "@/lib/private-access";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const MAX_QUERY_LENGTH = 120;
const MAX_RESULTS = 8;

type ChunkSearchResult = {
  chunkId: string;
  documentId: string;
  documentTitle: string;
  chunkIndex: number;
  content: string;
  charCount: number;
  score: number;
  createdAt: string;
};

function normalizeQuery(query: string | null): string | undefined {
  const trimmedQuery = query?.trim();

  if (!trimmedQuery) {
    return undefined;
  }

  return trimmedQuery.slice(0, MAX_QUERY_LENGTH);
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
    index = normalizedContent.indexOf(normalizedQuery, index + normalizedQuery.length);
  }

  return count;
}

export async function GET(request: Request) {
  if (!hasPrivateAccess(request)) {
    return getPrivateAccessResponse();
  }

  const { searchParams } = new URL(request.url);
  const query = normalizeQuery(searchParams.get("q"));

  if (!query) {
    return Response.json(
      { available: false, error: "q obrigatorio.", results: [] },
      { status: 400 },
    );
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("document_chunks")
      .select("id,document_id,chunk_index,content,char_count,created_at,documents(title)")
      .ilike("content", `%${escapeIlikePattern(query)}%`)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      throw error;
    }

    const results: ChunkSearchResult[] = data
      .map((row) => ({
        chunkId: row.id,
        documentId: row.document_id,
        documentTitle:
          Array.isArray(row.documents) || !row.documents
            ? "Fonte sem titulo"
            : row.documents.title,
        chunkIndex: row.chunk_index,
        content: row.content,
        charCount: row.char_count,
        score: countOccurrences(row.content, query),
        createdAt: row.created_at,
      }))
      .sort((a, b) => b.score - a.score || a.chunkIndex - b.chunkIndex)
      .slice(0, MAX_RESULTS);

    return Response.json({
      available: true,
      query,
      results,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Busca indisponivel.";

    return Response.json({
      available: false,
      error: message,
      results: [],
    });
  }
}
