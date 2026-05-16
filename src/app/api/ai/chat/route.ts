import {
  getAiProviderSelectionNote,
  getDefaultAiProvider,
  mockAiProvider,
} from "@/lib/ai";
import {
  evaluateAiUsageGuardrails,
  recordExternalAiUsage,
} from "@/lib/ai/usage-guardrails";
import {
  searchDocumentChunks,
  type ChunkSearchResult,
} from "@/lib/documents/chunk-search";
import type { AiGenerateRequest, AiMessage } from "@/types/ai";

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_CHAT_RETRIEVAL_RESULTS = 3;
const CHAT_SEARCH_STOPWORDS = new Set([
  "ainda",
  "como",
  "com",
  "das",
  "dos",
  "esse",
  "essa",
  "este",
  "esta",
  "isso",
  "para",
  "pela",
  "pelo",
  "qual",
  "quais",
  "que",
  "sobre",
  "uma",
  "voce",
]);

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

function getSafeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Selected AI provider failed.";
}

function getFallbackReason(providerId: string, error: unknown): string {
  const safeMessage = getSafeErrorMessage(error);

  if (providerId === "gemini") {
    return safeMessage.startsWith("Gemini failed:")
      ? safeMessage
      : `Gemini failed: ${safeMessage}`;
  }

  return `Selected AI provider failed: ${safeMessage}`;
}

function getLastUserMessage(messages: AiMessage[]): string {
  return messages.findLast((message) => message.role === "user")?.content ?? "";
}

function getChatSearchTerms(message: string): string[] {
  const normalizedMessage = message
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const words = normalizedMessage.match(/[a-z0-9_+#.-]{4,}/g) ?? [];

  return Array.from(
    new Set(words.filter((word) => !CHAT_SEARCH_STOPWORDS.has(word))),
  ).slice(0, 4);
}

function toRetrievedChunkMetadata(result: ChunkSearchResult) {
  return {
    chunkId: result.chunkId,
    documentId: result.documentId,
    documentTitle: result.documentTitle,
    chunkIndex: result.chunkIndex,
    content: result.content,
    score: result.score,
  };
}

async function getChatRetrievalMetadata(messages: AiMessage[]) {
  const searchTerms = getChatSearchTerms(getLastUserMessage(messages));

  if (searchTerms.length === 0) {
    return {
      retrieval: {
        mode: "lexical-local",
        queryTerms: searchTerms,
        resultCount: 0,
      },
      retrievedChunks: [],
    };
  }

  const resultsByChunkId = new Map<string, ChunkSearchResult>();

  for (const term of searchTerms) {
    const results = await searchDocumentChunks(term, {
      maxResults: MAX_CHAT_RETRIEVAL_RESULTS,
    });

    for (const result of results) {
      const existingResult = resultsByChunkId.get(result.chunkId);

      if (!existingResult || result.score > existingResult.score) {
        resultsByChunkId.set(result.chunkId, result);
      }
    }

    if (resultsByChunkId.size >= MAX_CHAT_RETRIEVAL_RESULTS) {
      break;
    }
  }

  const retrievedChunks = Array.from(resultsByChunkId.values())
    .sort((a, b) => b.score - a.score || a.chunkIndex - b.chunkIndex)
    .slice(0, MAX_CHAT_RETRIEVAL_RESULTS)
    .map(toRetrievedChunkMetadata);

  return {
    retrieval: {
      mode: "lexical-local",
      queryTerms: searchTerms,
      resultCount: retrievedChunks.length,
    },
    retrievedChunks,
  };
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

  const provider = getDefaultAiProvider();
  const selectionNote = getAiProviderSelectionNote();
  const guardrailDecision = evaluateAiUsageGuardrails(messages, provider.id);
  const retrievalMetadata = await getChatRetrievalMetadata(messages).catch(
    (error) => ({
      retrieval: {
        mode: "lexical-local",
        resultCount: 0,
        error:
          error instanceof Error ? error.message : "Busca lexical indisponivel.",
      },
      retrievedChunks: [],
    }),
  );
  const generateRequest: AiGenerateRequest = {
    messages,
    maxTokens: guardrailDecision.maxOutputTokens,
    metadata: {
      ...retrievalMetadata,
      promptTokensEstimate: guardrailDecision.promptTokensEstimate,
    },
  };

  if (!guardrailDecision.allowed) {
    if (provider.id === "mock") {
      return Response.json(
        {
          error:
            guardrailDecision.reason ?? "AI usage guardrail blocked request.",
        },
        { status: 400 },
      );
    }

    const fallbackResponse = await mockAiProvider.generate(generateRequest);

    return Response.json({
      ...fallbackResponse,
      metadata: {
        ...fallbackResponse.metadata,
        selectedProvider: fallbackResponse.provider,
        attemptedProvider: provider.id,
        fallbackUsed: true,
        fallbackReason: guardrailDecision.reason,
        usageGuardrails: {
          promptTokensEstimate: guardrailDecision.promptTokensEstimate,
          projectedTokens: guardrailDecision.projectedTokens,
          projectedCostUsd: guardrailDecision.projectedCostUsd,
        },
        retrieval: retrievalMetadata.retrieval,
      },
    });
  }

  try {
    const response = await provider.generate(generateRequest);
    const usageSnapshot =
      provider.id === "mock"
        ? undefined
        : recordExternalAiUsage(response, guardrailDecision);

    return Response.json({
      ...response,
      metadata: {
        ...response.metadata,
        selectionNote,
        usageGuardrails: {
          promptTokensEstimate: guardrailDecision.promptTokensEstimate,
          projectedTokens: guardrailDecision.projectedTokens,
          projectedCostUsd: guardrailDecision.projectedCostUsd,
          dailyUsage: usageSnapshot,
        },
        retrieval: retrievalMetadata.retrieval,
      },
    });
  } catch (error) {
    const fallbackReason = getFallbackReason(provider.id, error);
    const fallbackResponse = await mockAiProvider.generate(generateRequest);
    const debugMetadata =
      process.env.NODE_ENV === "development"
        ? {
            attemptedProvider: provider.id,
            attemptedModel: provider.defaultModel,
          }
        : {};

    return Response.json({
      ...fallbackResponse,
      metadata: {
        ...fallbackResponse.metadata,
        ...debugMetadata,
        selectedProvider: fallbackResponse.provider,
        fallbackUsed: true,
        fallbackReason,
        usageGuardrails: {
          promptTokensEstimate: guardrailDecision.promptTokensEstimate,
          projectedTokens: guardrailDecision.projectedTokens,
          projectedCostUsd: guardrailDecision.projectedCostUsd,
        },
        retrieval: retrievalMetadata.retrieval,
      },
    });
  }
}
