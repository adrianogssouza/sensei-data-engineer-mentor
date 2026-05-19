import { getPrivateAccessResponse, hasPrivateAccess } from "@/lib/private-access";
import {
  CHUNK_OVERLAP,
  CHUNK_SIZE,
  createTextChunks,
} from "@/lib/documents/chunking";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";

type ReprocessDocumentRequestBody = {
  documentId?: unknown;
};

function getUnavailableResponse(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Supabase indisponivel.";

  return Response.json({
    available: false,
    error: message,
  });
}

export async function POST(request: Request) {
  if (!hasPrivateAccess(request)) {
    return getPrivateAccessResponse();
  }

  let body: ReprocessDocumentRequestBody;

  try {
    body = (await request.json()) as ReprocessDocumentRequestBody;
  } catch {
    return Response.json(
      { available: false, error: "JSON invalido." },
      { status: 400 },
    );
  }

  const documentId =
    typeof body.documentId === "string" ? body.documentId.trim() : "";

  if (!documentId) {
    return Response.json(
      { available: false, error: "documentId obrigatorio." },
      { status: 400 },
    );
  }

  try {
    const supabase = createServiceRoleSupabaseClient();
    const { data: document, error: documentError } = await supabase
      .from("documents")
      .select("id,raw_content")
      .eq("id", documentId)
      .single();

    if (documentError) {
      throw documentError;
    }

    const rawContent = document.raw_content?.trim() ?? "";
    const chunks = rawContent ? createTextChunks(rawContent) : [];

    if (chunks.length === 0) {
      return Response.json(
        {
          available: false,
          error: "Documento sem conteudo bruto para reprocessar.",
        },
        { status: 400 },
      );
    }

    const { error: deleteError } = await supabase
      .from("document_chunks")
      .delete()
      .eq("document_id", document.id);

    if (deleteError) {
      throw deleteError;
    }

    const reprocessedAt = new Date().toISOString();
    const { error: chunksError } = await supabase.from("document_chunks").insert(
      chunks.map((chunk, chunkIndex) => ({
        document_id: document.id,
        chunk_index: chunkIndex,
        content: chunk,
        char_count: chunk.length,
        metadata: {
          chunkSize: CHUNK_SIZE,
          overlap: CHUNK_OVERLAP,
          reprocessedAt,
        },
      })),
    );

    if (chunksError) {
      throw chunksError;
    }

    const { error: updateError } = await supabase
      .from("documents")
      .update({
        chunk_count: chunks.length,
        ingestion_status: "ready",
        ingestion_error: null,
        ingested_at: reprocessedAt,
        updated_at: reprocessedAt,
      })
      .eq("id", document.id);

    if (updateError) {
      throw updateError;
    }

    return Response.json({
      available: true,
      documentId: document.id,
      chunkCount: chunks.length,
      embeddingStatus: "pending",
      reprocessedAt,
    });
  } catch (error) {
    return getUnavailableResponse(error);
  }
}
