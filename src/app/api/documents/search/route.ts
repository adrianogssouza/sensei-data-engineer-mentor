import {
  normalizeChunkSearchQuery,
  searchDocumentChunks,
} from "@/lib/documents/chunk-search";
import { hasPrivateAccess, getPrivateAccessResponse } from "@/lib/private-access";

export async function GET(request: Request) {
  if (!hasPrivateAccess(request)) {
    return getPrivateAccessResponse();
  }

  const { searchParams } = new URL(request.url);
  const query = normalizeChunkSearchQuery(searchParams.get("q"));

  if (!query) {
    return Response.json(
      { available: false, error: "q obrigatorio.", results: [] },
      { status: 400 },
    );
  }

  try {
    const results = await searchDocumentChunks(query);

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
