import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/types";
import type { ChatRole } from "@/types/chat";

const DEFAULT_THREAD_TITLE = "Conversa principal";
const MAX_MESSAGE_LENGTH = 4000;
const MAX_MESSAGES_PER_WRITE = 50;

type PersistedChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  metadata: Json;
};

type PersistMessageInput = {
  role?: unknown;
  content?: unknown;
  createdAt?: unknown;
  metadata?: unknown;
};

type ValidPersistMessageInput = {
  role: ChatRole;
  content: string;
  createdAt?: string;
  metadata?: unknown;
};

type ChatMessageInsert = {
  thread_id: string;
  role: ChatRole;
  content: string;
  metadata: Json;
  created_at?: string;
};

type PersistMessagesRequestBody = {
  threadId?: unknown;
  title?: unknown;
  messages?: unknown;
};

function isChatRole(role: unknown): role is ChatRole {
  return role === "user" || role === "assistant" || role === "system";
}

function isValidMessageInput(message: unknown): message is PersistMessageInput {
  if (!message || typeof message !== "object") {
    return false;
  }

  const candidate = message as PersistMessageInput;

  return (
    isChatRole(candidate.role) &&
    typeof candidate.content === "string" &&
    candidate.content.trim().length > 0 &&
    candidate.content.length <= MAX_MESSAGE_LENGTH
  );
}

function toValidMessageInput(
  message: unknown,
): ValidPersistMessageInput | undefined {
  if (!isValidMessageInput(message)) {
    return undefined;
  }

  const role = message.role;
  const content = message.content;

  if (!isChatRole(role) || typeof content !== "string") {
    return undefined;
  }

  return {
    role,
    content: content.trim(),
    createdAt:
      typeof message.createdAt === "string" ? message.createdAt : undefined,
    metadata: message.metadata,
  };
}

function toPersistedChatMessage(row: {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  created_at: string;
  metadata: Json;
}): PersistedChatMessage | undefined {
  if (!isChatRole(row.role)) {
    return undefined;
  }

  return {
    id: row.id,
    role: row.role,
    content: row.content,
    createdAt: row.created_at,
    metadata: row.metadata,
  };
}

function getThreadIdFromUrl(request: Request): string | undefined {
  const { searchParams } = new URL(request.url);
  const threadId = searchParams.get("threadId")?.trim();

  return threadId || undefined;
}

function getSafeMetadata(metadata: unknown): Json {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return {};
  }

  return metadata as Json;
}

function getUnavailableResponse(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Supabase indisponivel.";

  return Response.json({
    available: false,
    error: message,
    messages: [],
  });
}

async function createThread(title?: unknown): Promise<string> {
  const supabase = await createServerSupabaseClient();
  const normalizedTitle =
    typeof title === "string" && title.trim()
      ? title.trim().slice(0, 80)
      : DEFAULT_THREAD_TITLE;
  const { data, error } = await supabase
    .from("chat_threads")
    .insert({ title: normalizedTitle })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return data.id;
}

export async function GET(request: Request) {
  const threadId = getThreadIdFromUrl(request);

  if (!threadId) {
    return Response.json(
      { available: false, error: "threadId obrigatorio.", messages: [] },
      { status: 400 },
    );
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("chat_messages")
      .select("id,role,content,metadata,created_at")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return Response.json({
      available: true,
      threadId,
      messages: data.map(toPersistedChatMessage).filter(Boolean),
    });
  } catch (error) {
    return getUnavailableResponse(error);
  }
}

export async function POST(request: Request) {
  let body: PersistMessagesRequestBody;

  try {
    body = (await request.json()) as PersistMessagesRequestBody;
  } catch {
    return Response.json(
      { available: false, error: "JSON invalido.", messages: [] },
      { status: 400 },
    );
  }

  if (!Array.isArray(body.messages)) {
    return Response.json(
      { available: false, error: "messages obrigatorio.", messages: [] },
      { status: 400 },
    );
  }

  const messages = body.messages
    .slice(0, MAX_MESSAGES_PER_WRITE)
    .map(toValidMessageInput)
    .filter((message): message is ValidPersistMessageInput =>
      Boolean(message),
    );

  if (messages.length === 0) {
    return Response.json(
      { available: false, error: "Nenhuma mensagem valida.", messages: [] },
      { status: 400 },
    );
  }

  try {
    const supabase = await createServerSupabaseClient();
    const threadId =
      typeof body.threadId === "string" && body.threadId.trim()
        ? body.threadId.trim()
        : await createThread(body.title);
    const rows: ChatMessageInsert[] = messages.map((message) => ({
      thread_id: threadId,
      role: message.role,
      content: message.content,
      metadata: getSafeMetadata(message.metadata),
      ...(message.createdAt ? { created_at: message.createdAt } : {}),
    }));

    const { data, error } = await supabase
      .from("chat_messages")
      .insert(rows)
      .select("id,role,content,metadata,created_at")
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    await supabase
      .from("chat_threads")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", threadId);

    return Response.json({
      available: true,
      threadId,
      messages: data.map(toPersistedChatMessage).filter(Boolean),
    });
  } catch (error) {
    return getUnavailableResponse(error);
  }
}
