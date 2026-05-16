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
  extractChunkSearchTerms,
  searchDocumentChunks,
  type ChunkSearchResult,
} from "@/lib/documents/chunk-search";
import {
  searchVectorDocumentChunks,
  type VectorChunkSearchResult,
} from "@/lib/documents/vector-search";
import type { AiGenerateRequest, AiMessage } from "@/types/ai";

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_CHAT_RETRIEVAL_RESULTS = 3;
const VECTOR_SCORE_WEIGHT = 20;

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

type HybridChunkSearchResult = {
  chunkId: string;
  documentId: string;
  documentTitle: string;
  chunkIndex: number;
  content: string;
  score: number;
  matchedTerms: string[];
  phraseMatches: number;
  termMatches: number;
  vectorSimilarity: number | null;
  hybridScore: number;
};

function toRetrievedChunkMetadata(result: HybridChunkSearchResult) {
  return {
    chunkId: result.chunkId,
    documentId: result.documentId,
    documentTitle: result.documentTitle,
    chunkIndex: result.chunkIndex,
    content: result.content,
    score: result.score,
    matchedTerms: result.matchedTerms,
    phraseMatches: result.phraseMatches,
    termMatches: result.termMatches,
    vectorSimilarity: result.vectorSimilarity,
    hybridScore: result.hybridScore,
  };
}

function toHybridChunkFromLexical(result: ChunkSearchResult): HybridChunkSearchResult {
  return {
    chunkId: result.chunkId,
    documentId: result.documentId,
    documentTitle: result.documentTitle,
    chunkIndex: result.chunkIndex,
    content: result.content,
    score: result.score,
    matchedTerms: result.matchedTerms,
    phraseMatches: result.phraseMatches,
    termMatches: result.termMatches,
    vectorSimilarity: null,
    hybridScore: result.score,
  };
}

function mergeVectorChunk(
  current: HybridChunkSearchResult | undefined,
  result: VectorChunkSearchResult,
): HybridChunkSearchResult {
  const vectorScore = result.similarity * VECTOR_SCORE_WEIGHT;

  if (!current) {
    return {
      chunkId: result.chunkId,
      documentId: result.documentId,
      documentTitle: result.documentTitle,
      chunkIndex: result.chunkIndex,
      content: result.content,
      score: 0,
      matchedTerms: [],
      phraseMatches: 0,
      termMatches: 0,
      vectorSimilarity: result.similarity,
      hybridScore: vectorScore,
    };
  }

  return {
    ...current,
    vectorSimilarity: result.similarity,
    hybridScore: current.score + vectorScore,
  };
}

async function getChatRetrievalMetadata(messages: AiMessage[]) {
  const lastUserMessage = getLastUserMessage(messages);
  const searchTerms = extractChunkSearchTerms(lastUserMessage);

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

  const [lexicalResults, vectorResults] = await Promise.all([
    searchDocumentChunks(lastUserMessage, {
      maxResults: MAX_CHAT_RETRIEVAL_RESULTS,
    }),
    searchVectorDocumentChunks(lastUserMessage, {
      maxResults: MAX_CHAT_RETRIEVAL_RESULTS,
    }).catch(() => []),
  ]);
  const resultsByChunkId = new Map<string, HybridChunkSearchResult>();

  for (const result of lexicalResults) {
    resultsByChunkId.set(result.chunkId, toHybridChunkFromLexical(result));
  }

  for (const result of vectorResults) {
    resultsByChunkId.set(
      result.chunkId,
      mergeVectorChunk(resultsByChunkId.get(result.chunkId), result),
    );
  }

  const retrievedChunks = Array.from(resultsByChunkId.values())
    .sort((a, b) => b.hybridScore - a.hybridScore || a.chunkIndex - b.chunkIndex)
    .slice(0, MAX_CHAT_RETRIEVAL_RESULTS)
    .map(toRetrievedChunkMetadata);

  return {
    retrieval: {
      mode: "hybrid-local",
      queryTerms: searchTerms,
      ranking: "hybrid-lexical-vector-v1",
      lexicalResultCount: lexicalResults.length,
      vectorResultCount: vectorResults.length,
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
