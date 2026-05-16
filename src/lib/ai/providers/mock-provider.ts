import {
  createMockAssistantResponse,
  type MockRetrievedChunk,
} from "@/lib/chat/mock-chat";
import type {
  AiGenerateRequest,
  AiGenerateResponse,
  AiMessage,
  AiProvider,
} from "@/types/ai";

const MOCK_MODEL = "mock-local-v1";

function getLastUserMessage(messages: AiMessage[]): string {
  const lastUserMessage = messages.findLast((message) => message.role === "user");

  return lastUserMessage?.content ?? "";
}

function estimateTokenCount(content: string): number {
  const trimmedContent = content.trim();

  if (!trimmedContent) {
    return 0;
  }

  return trimmedContent.split(/\s+/).length;
}

function getRetrievedChunks(metadata: Record<string, unknown> | undefined) {
  const retrievedChunks = metadata?.retrievedChunks;

  if (!Array.isArray(retrievedChunks)) {
    return [];
  }

  return retrievedChunks.filter(
    (chunk): chunk is MockRetrievedChunk =>
      typeof chunk === "object" &&
      chunk !== null &&
      typeof (chunk as MockRetrievedChunk).documentTitle === "string" &&
      typeof (chunk as MockRetrievedChunk).chunkIndex === "number" &&
      typeof (chunk as MockRetrievedChunk).content === "string" &&
      ((chunk as MockRetrievedChunk).matchedTerms === undefined ||
        Array.isArray((chunk as MockRetrievedChunk).matchedTerms)) &&
      ((chunk as MockRetrievedChunk).score === undefined ||
        typeof (chunk as MockRetrievedChunk).score === "number"),
  );
}

export const mockAiProvider: AiProvider = {
  id: "mock",
  name: "Local mock provider",
  defaultModel: MOCK_MODEL,
  async generate(request: AiGenerateRequest): Promise<AiGenerateResponse> {
    const lastUserMessage = getLastUserMessage(request.messages);
    const retrievedChunks = getRetrievedChunks(request.metadata);
    const content = createMockAssistantResponse(lastUserMessage, retrievedChunks);
    const promptTokens = request.messages.reduce(
      (total, message) => total + estimateTokenCount(message.content),
      0,
    );
    const completionTokens = estimateTokenCount(content);

    return {
      content,
      provider: "mock",
      model: request.model ?? MOCK_MODEL,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
        estimatedCostUsd: 0,
        metadata: {
          source: "deterministic-local-estimate",
        },
      },
      metadata: {
        externalApiCall: false,
      },
    };
  },
};
