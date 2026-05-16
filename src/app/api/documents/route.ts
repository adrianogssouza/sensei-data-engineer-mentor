import { getPrivateAccessEnv } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/types";

const MAX_TITLE_LENGTH = 120;
const MAX_SOURCE_PATH_LENGTH = 500;
const MAX_NOTES_LENGTH = 2000;
const PRIVATE_ACCESS_USERNAME = "sensei";
const SOURCE_TYPES = ["manual", "url", "file_reference"] as const;

type SourceType = (typeof SOURCE_TYPES)[number];

type DocumentSource = {
  id: string;
  title: string;
  sourceType: string;
  sourcePath: string | null;
  ingestionStatus: string;
  ingestionError: string | null;
  metadata: Json;
  createdAt: string;
  updatedAt: string;
};

type CreateDocumentRequestBody = {
  title?: unknown;
  sourceType?: unknown;
  sourcePath?: unknown;
  notes?: unknown;
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
  ingestion_status: string;
  ingestion_error: string | null;
  metadata: Json;
  created_at: string;
  updated_at: string;
}): DocumentSource {
  return {
    id: row.id,
    title: row.title,
    sourceType: row.source_type,
    sourcePath: row.source_path,
    ingestionStatus: row.ingestion_status,
    ingestionError: row.ingestion_error,
    metadata: row.metadata,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
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

function hasPrivateAccess(request: Request): boolean {
  const { SENSEI_PRIVATE_ACCESS_PASSWORD } = getPrivateAccessEnv();

  if (!SENSEI_PRIVATE_ACCESS_PASSWORD) {
    return true;
  }

  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Basic ")) {
    return false;
  }

  try {
    const decoded = atob(authorization.slice("Basic ".length));
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) {
      return false;
    }

    const username = decoded.slice(0, separatorIndex);
    const password = decoded.slice(separatorIndex + 1);

    return (
      username === PRIVATE_ACCESS_USERNAME &&
      password === SENSEI_PRIVATE_ACCESS_PASSWORD
    );
  } catch {
    return false;
  }
}

function getPrivateAccessResponse() {
  return Response.json(
    { available: false, error: "Private access required.", documents: [] },
    {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="SENSEI"',
      },
    },
  );
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
        "id,title,source_type,source_path,ingestion_status,ingestion_error,metadata,created_at,updated_at",
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

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("documents")
      .insert({
        title,
        source_type: sourceType,
        source_path: sourcePath,
        ingestion_status: "pending",
        metadata: notes ? { notes } : {},
      })
      .select(
        "id,title,source_type,source_path,ingestion_status,ingestion_error,metadata,created_at,updated_at",
      )
      .single();

    if (error) {
      throw error;
    }

    return Response.json({
      available: true,
      document: toDocumentSource(data),
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
