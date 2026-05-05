import { createServerSupabaseClient } from "@/lib/supabase/server";

const DEFAULT_THREAD_TITLE = "Conversa principal";
const MAX_THREAD_TITLE_LENGTH = 80;

type CreateThreadRequestBody = {
  title?: unknown;
};

function getThreadTitle(title: unknown): string {
  if (typeof title !== "string") {
    return DEFAULT_THREAD_TITLE;
  }

  const trimmedTitle = title.trim();

  if (!trimmedTitle) {
    return DEFAULT_THREAD_TITLE;
  }

  return trimmedTitle.slice(0, MAX_THREAD_TITLE_LENGTH);
}

function getUnavailableResponse(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Supabase indisponivel.";

  return Response.json({
    available: false,
    error: message,
    threads: [],
  });
}

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("chat_threads")
      .select("id,title,created_at,updated_at,archived_at")
      .is("archived_at", null)
      .order("updated_at", { ascending: false })
      .limit(20);

    if (error) {
      throw error;
    }

    return Response.json({
      available: true,
      threads: data,
    });
  } catch (error) {
    return getUnavailableResponse(error);
  }
}

export async function POST(request: Request) {
  let body: CreateThreadRequestBody = {};

  try {
    body = (await request.json()) as CreateThreadRequestBody;
  } catch {
    body = {};
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("chat_threads")
      .insert({
        title: getThreadTitle(body.title),
      })
      .select("id,title,created_at,updated_at,archived_at")
      .single();

    if (error) {
      throw error;
    }

    return Response.json({
      available: true,
      thread: data,
    });
  } catch (error) {
    return getUnavailableResponse(error);
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const threadId = searchParams.get("threadId")?.trim();

  if (!threadId) {
    return Response.json(
      { available: false, error: "threadId obrigatorio." },
      { status: 400 },
    );
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("chat_threads")
      .update({ archived_at: new Date().toISOString() })
      .eq("id", threadId);

    if (error) {
      throw error;
    }

    return Response.json({
      available: true,
      threadId,
    });
  } catch (error) {
    return getUnavailableResponse(error);
  }
}
