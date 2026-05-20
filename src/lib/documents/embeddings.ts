import { getEmbeddingProviderEnv } from "@/lib/env";
import {
  createMockEmbedding,
  MOCK_EMBEDDING_MODEL,
  MOCK_EMBEDDING_PROVIDER,
} from "@/lib/documents/mock-embeddings";

export type EmbeddingProviderId = "mock" | "openai";

export type EmbeddingGenerationResult = {
  provider: EmbeddingProviderId;
  model: string;
  embedding: number[];
};

export type EmbeddingProviderConfig = {
  provider: EmbeddingProviderId;
  model: string;
  available: boolean;
  dimensions: number;
};

const OPENAI_EMBEDDING_DIMENSIONS = 1536;

type OpenAiEmbeddingResponse = {
  data?: Array<{
    embedding?: number[];
  }>;
  error?: {
    message?: string;
  };
};

function normalizeEmbeddingProvider(provider: string): EmbeddingProviderId {
  return provider === "openai" ? "openai" : "mock";
}

function getOpenAiEmbeddingError(payload: OpenAiEmbeddingResponse): string {
  return payload.error?.message ?? "OpenAI embeddings indisponiveis.";
}

async function createOpenAiEmbedding(
  input: string,
): Promise<EmbeddingGenerationResult> {
  const env = getEmbeddingProviderEnv();

  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY nao configurada.");
  }

  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.OPENAI_EMBEDDING_MODEL,
      input,
      encoding_format: "float",
      dimensions: OPENAI_EMBEDDING_DIMENSIONS,
    }),
  });
  const payload = (await response.json()) as OpenAiEmbeddingResponse;
  const embedding = payload.data?.[0]?.embedding;

  if (!response.ok || !embedding) {
    throw new Error(getOpenAiEmbeddingError(payload));
  }

  return {
    provider: "openai",
    model: env.OPENAI_EMBEDDING_MODEL,
    embedding,
  };
}

export function getActiveEmbeddingProviderConfig(): EmbeddingProviderConfig {
  const env = getEmbeddingProviderEnv();
  const provider = normalizeEmbeddingProvider(env.EMBEDDINGS_PROVIDER);

  if (provider === "openai") {
    return {
      provider,
      model: env.OPENAI_EMBEDDING_MODEL,
      available: Boolean(env.OPENAI_API_KEY),
      dimensions: OPENAI_EMBEDDING_DIMENSIONS,
    };
  }

  return {
    provider: "mock",
    model: MOCK_EMBEDDING_MODEL,
    available: true,
    dimensions: OPENAI_EMBEDDING_DIMENSIONS,
  };
}

export async function createEmbedding(
  input: string,
): Promise<EmbeddingGenerationResult> {
  const config = getActiveEmbeddingProviderConfig();

  if (config.provider === "openai") {
    return createOpenAiEmbedding(input);
  }

  return {
    provider: MOCK_EMBEDDING_PROVIDER,
    model: MOCK_EMBEDDING_MODEL,
    embedding: createMockEmbedding(input),
  };
}
