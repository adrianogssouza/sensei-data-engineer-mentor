import {
  getAiProviderSelectionNote,
  getDefaultAiProvider,
  mockAiProvider,
} from "@/lib/ai";
import type { AiGenerateRequest, AiMessage } from "@/types/ai";

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_OUTPUT_TOKENS = 600;

export const runtime = "nodejs";

type ChatRequestBody = {
  messages?: unknown;
};

function isValidMessage(message: unknown): message is AiMessage {
  if (!message || typeof message !== "object") {
    return false;
  }

  const candidate = message as Partial<AiMessage>;

  return (
    typeof candidate.content === "string" &&
    candidate.content.trim().length > 0 &&
    candidate.content.length <= MAX_MESSAGE_LENGTH &&
    (candidate.role === "system" ||
      candidate.role === "user" ||
      candidate.role === "assistant" ||
      candidate.role === "tool")
  );
}

function parseMessages(body: ChatRequestBody): AiMessage[] | undefined {
  if (!Array.isArray(body.messages)) {
    return undefined;
  }

  const messages = body.messages.slice(-MAX_MESSAGES);

  if (messages.length === 0 || !messages.every(isValidMessage)) {
    return undefined;
  }

  return messages;
}

export async function POST(request: Request) {
  let body: ChatRequestBody;

  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return Response.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const messages = parseMessages(body);

  if (!messages) {
    return Response.json(
      { error: "Expected a non-empty messages array." },
      { status: 400 },
    );
  }

  const generateRequest: AiGenerateRequest = {
    messages,
    maxTokens: MAX_OUTPUT_TOKENS,
  };
  const provider = getDefaultAiProvider();
  const selectionNote = getAiProviderSelectionNote();

  try {
    const response = await provider.generate(generateRequest);

    return Response.json({
      ...response,
      metadata: {
        ...response.metadata,
        selectionNote,
      },
    });
  } catch {
    const fallbackResponse = await mockAiProvider.generate(generateRequest);

    return Response.json({
      ...fallbackResponse,
      metadata: {
        ...fallbackResponse.metadata,
        fallbackReason: "Selected AI provider failed; mock fallback used.",
      },
    });
  }
}
