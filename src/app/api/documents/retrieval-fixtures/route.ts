import { createHash } from "node:crypto";

import retrievalEvalFixtures from "@/lib/documents/retrieval-eval-fixtures.json";
import { getPrivateAccessResponse, hasPrivateAccess } from "@/lib/private-access";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";

function getContentHash(rawContent: string): string {
  return createHash("sha256").update(rawContent).digest("hex");
}

function toFixtureMetadata() {
  return {
    fixture: "retrieval-evals",
    fixtureVersion: retrievalEvalFixtures.version,
  };
}

export async function GET(request: Request) {
  if (!hasPrivateAccess(request)) {
    return getPrivateAccessResponse();
  }

  return Response.json({
    available: true,
    fixture: {
      version: retrievalEvalFixtures.version,
      description: retrievalEvalFixtures.description,
      documentCount: retrievalEvalFixtures.documents.length,
      documents: retrievalEvalFixtures.documents.map((document) => ({
        title: document.title,
        sourcePath: document.sourcePath,
        contentCharCount: document.content.length,
      })),
    },
  });
}

export async function POST(request: Request) {
  if (!hasPrivateAccess(request)) {
    return getPrivateAccessResponse();
  }

  try {
    const supabase = createServiceRoleSupabaseClient();
    const fixtureSourcePaths = retrievalEvalFixtures.documents.map(
      (document) => document.sourcePath,
    );
    const { error: deleteError } = await supabase
      .from("documents")
      .delete()
      .in("source_path", fixtureSourcePaths);

    if (deleteError) {
      throw deleteError;
    }

    const createdDocuments = [];

    for (const document of retrievalEvalFixtures.documents) {
      const metadata = toFixtureMetadata();
      const { data, error } = await supabase
        .from("documents")
        .insert({
          title: document.title,
          source_type: "manual",
          source_path: document.sourcePath,
          raw_content: document.content,
          content_char_count: document.content.length,
          chunk_count: 1,
          content_hash: getContentHash(document.content),
          ingestion_status: "ready",
          ingested_at: new Date().toISOString(),
          metadata,
        })
        .select("id,title,source_path")
        .single();

      if (error) {
        throw error;
      }

      const { error: chunkError } = await supabase
        .from("document_chunks")
        .insert({
          document_id: data.id,
          chunk_index: 0,
          content: document.content,
          char_count: document.content.length,
          metadata,
        });

      if (chunkError) {
        throw chunkError;
      }

      createdDocuments.push({
        id: data.id,
        title: data.title,
        sourcePath: data.source_path,
      });
    }

    return Response.json({
      available: true,
      fixtureVersion: retrievalEvalFixtures.version,
      documentCount: createdDocuments.length,
      documents: createdDocuments,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Fixtures indisponiveis.";

    return Response.json({
      available: false,
      error: message,
      documentCount: 0,
      documents: [],
    });
  }
}
