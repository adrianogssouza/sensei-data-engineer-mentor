export type AiProviderId = "mock" | "gemini" | "anthropic" | "openai";

export type AiModelId = string;

export type AiMessageRole = "system" | "user" | "assistant" | "tool";

export type AiMessage = {
  role: AiMessageRole;
  content: string;
  name?: string;
  metadata?: Record<string, unknown>;
};

export type AiUsage = {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  estimatedCostUsd?: number;
  metadata?: Record<string, unknown>;
};

export type AiGenerateRequest = {
  messages: AiMessage[];
  model?: AiModelId;
  temperature?: number;
  maxTokens?: number;
  metadata?: Record<string, unknown>;
};

export type AiGenerateResponse = {
  content: string;
  provider: AiProviderId;
  model: AiModelId;
  usage?: AiUsage;
  metadata?: Record<string, unknown>;
};

export type AiProvider = {
  id: AiProviderId;
  name: string;
  defaultModel: AiModelId;
  generate: (request: AiGenerateRequest) => Promise<AiGenerateResponse>;
};
