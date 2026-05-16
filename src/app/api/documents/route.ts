import { createHash } from "node:crypto";

import { hasPrivateAccess, getPrivateAccessResponse } from "@/lib/private-access";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/types";

const MAX_TITLE_LENGTH = 120;
const MAX_SOURCE_PATH_LENGTH = 500;
const MAX_NOTES_LENGTH = 2000;
const MAX_RAW_CONTENT_LENGTH = 20000;
const CHUNK_SIZE = 1200;
const CHUNK_OVERLAP = 160;
const SOURCE_TYPES = ["manual", "url", "file_reference"] as const;

type SourceType = (typeof SOURCE_TYPES)[number];

type DocumentSource = {
  id: string;
  title: string;
  sourceType: string;
  sourcePath: string | null;
  rawContent: string | null;
  contentCharCount: number;
  chunkCount: number;
  contentHash: string | null;
  ingestionStatus: string;
  ingestionError: string | null;
  ingestedAt: string | null;
  metadata: Json;
  createdAt: string;
  updatedAt: string;
};

type CreateDocumentRequestBody = {
  title?: unknown;
  sourceType?: unknown;
  sourcePath?: unknown;
  notes?: unknown;
  rawContent?: unknown;
};

function isSourceType(sourceType: unknown): sourceType is SourceType {
  return (
    typeof sourceType === "string" &&
    SOURCE_TYPES.includes(sourceType as SourceType)
  );
}

function normalizeTitle(title: unknown): string | undefined {
  if (typeof title !== "string") {
    return undefined;
  }

  const trimmed = title.trim();

  if (!trimmed) {
    return undefined;
  }

  return trimmed.slice(0, MAX_TITLE_LENGTH);
}

function normalizeOptionalText(
  value: unknown,
  maxLength: number,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  return trimmed.slice(0, maxLength);
}

function toDocumentSource(row: {
  id: string;
  title: string;
  source_type: string;
  source_path: string | null;
  raw_content: string | null;
  content_char_count: number;
  chunk_count: number;
  content_hash: string | null;
  ingestion_status: string;
  ingestion_error: string | null;
  ingested_at: string | null;
  metadata: Json;
  created_at: string;
  updated_at: string;
}): DocumentSource {
  return {
    id: row.id,
    title: row.title,
    sourceType: row.source_type,
    sourcePath: row.source_path,
    rawContent: row.raw_content,
    contentCharCount: row.content_char_count,
    chunkCount: row.chunk_count,
    contentHash: row.content_hash,
    ingestionStatus: row.ingestion_status,
    ingestionError: row.ingestion_error,
    ingestedAt: row.ingested_at,
    metadata: row.metadata,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function getContentHash(rawContent: string): string {
  return createHash("sha256").update(rawContent).digest("hex");
}

function createTextChunks(rawContent: string): string[] {
  const normalizedContent = rawContent.replace(/\s+\n/g, "\n").trim();
  const chunks: string[] = [];
  let start = 0;

  while (start < normalizedContent.length) {
    const hardEnd = Math.min(start + CHUNK_SIZE, normalizedContent.length);
    const slice = normalizedContent.slice(start, hardEnd);
    const paragraphBreak = slice.lastIndexOf("\n\n");
    const sentenceBreak = slice.lastIndexOf(". ");
    const softBreak =
      hardEnd < normalizedContent.length
        ? Math.max(paragraphBreak, sentenceBreak)
        : -1;
    const end = softBreak > CHUNK_SIZE * 0.5 ? start + softBreak + 1 : hardEnd;
    const chunk = normalizedContent.slice(start, end).trim();

    if (chunk) {
      chunks.push(chunk);
    }

    if (end >= normalizedContent.length) {
      break;
    }

    start = Math.max(end - CHUNK_OVERLAP, start + 1);
  }

  return chunks;
}

function getUnavailableResponse(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Supabase indisponivel.";

  return Response.json({
    available: false,
    error: message,
    documents: [],
  });
}

export async function GET(request: Request) {
  if (!hasPrivateAccess(request)) {
    return getPrivateAccessResponse();
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("documents")
      .select(
        "id,title,source_type,source_path,raw_content,content_char_count,chunk_count,content_hash,ingestion_status,ingestion_error,ingested_at,metadata,created_at,updated_at",
      )
      .order("updated_at", { ascending: false })
      .limit(50);

    if (error) {
      throw error;
    }

    return Response.json({
      available: true,
      documents: data.map(toDocumentSource),
    });
  } catch (error) {
    return getUnavailableResponse(error);
  }
}

export async function POST(request: Request) {
  if (!hasPrivateAccess(request)) {
    return getPrivateAccessResponse();
  }

  let body: CreateDocumentRequestBody;

  try {
    body = (await request.json()) as CreateDocumentRequestBody;
  } catch {
    return Response.json(
      { available: false, error: "JSON invalido.", documents: [] },
      { status: 400 },
    );
  }

  const title = normalizeTitle(body.title);

  if (!title) {
    return Response.json(
      { available: false, error: "Titulo obrigatorio.", documents: [] },
      { status: 400 },
    );
  }

  const sourceType = isSourceType(body.sourceType) ? body.sourceType : "manual";
  const sourcePath = normalizeOptionalText(
    body.sourcePath,
    MAX_SOURCE_PATH_LENGTH,
  );
  const notes = normalizeOptionalText(body.notes, MAX_NOTES_LENGTH);
  const rawContent = normalizeOptionalText(
    body.rawContent,
    MAX_RAW_CONTENT_LENGTH,
  );
  const chunks = rawContent ? createTextChunks(rawContent) : [];
  const ingestedAt = rawContent ? new Date().toISOString() : null;

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("documents")
      .insert({
        title,
        source_type: sourceType,
        source_path: sourcePath,
        raw_content: rawContent,
        content_char_count: rawContent?.length ?? 0,
        chunk_count: 0,
        content_hash: rawContent ? getContentHash(rawContent) : null,
        ingestion_status: rawContent && chunks.length > 0 ? "ready" : "pending",
        ingested_at: ingestedAt,
        metadata: notes ? { notes } : {},
      })
      .select(
        "id,title,source_type,source_path,raw_content,content_char_count,chunk_count,content_hash,ingestion_status,ingestion_error,ingested_at,metadata,created_at,updated_at",
      )
      .single();

    if (error) {
      throw error;
    }

    if (chunks.length === 0) {
      return Response.json({
        available: true,
        document: toDocumentSource(data),
      });
    }

    const { error: chunksError } = await supabase.from("document_chunks").insert(
      chunks.map((chunk, chunkIndex) => ({
        document_id: data.id,
        chunk_index: chunkIndex,
        content: chunk,
        char_count: chunk.length,
        metadata: {
          chunkSize: CHUNK_SIZE,
          overlap: CHUNK_OVERLAP,
        },
      })),
    );

    if (chunksError) {
      throw chunksError;
    }

    const { data: updatedData, error: updateError } = await supabase
      .from("documents")
      .update({ chunk_count: chunks.length })
      .eq("id", data.id)
      .select(
        "id,title,source_type,source_path,raw_content,content_char_count,chunk_count,content_hash,ingestion_status,ingestion_error,ingested_at,metadata,created_at,updated_at",
      )
      .single();

    if (updateError) {
      throw updateError;
    }

    return Response.json({
      available: true,
      document: toDocumentSource(updatedData),
    });
  } catch (error) {
    return getUnavailableResponse(error);
  }
}

export async function DELETE(request: Request) {
  if (!hasPrivateAccess(request)) {
    return getPrivateAccessResponse();
  }

  const { searchParams } = new URL(request.url);
  const documentId = searchParams.get("id")?.trim();

  if (!documentId) {
    return Response.json(
      { available: false, error: "id obrigatorio.", documents: [] },
      { status: 400 },
    );
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", documentId);

    if (error) {
      throw error;
    }

    return Response.json({
      available: true,
      documentId,
    });
  } catch (error) {
    return getUnavailableResponse(error);
  }
}
