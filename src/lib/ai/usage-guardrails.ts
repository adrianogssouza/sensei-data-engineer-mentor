import { getAiUsageGuardrailEnv } from "@/lib/env";
import type {
  AiGenerateResponse,
  AiMessage,
  AiProviderId,
  AiUsage,
} from "@/types/ai";

type AiUsageState = {
  dateKey: string;
  externalRequests: number;
  tokens: number;
  estimatedCostUsd: number;
};

type GlobalAiUsageState = typeof globalThis & {
  __senseiAiUsageState?: AiUsageState;
};

export type AiUsageGuardrailDecision = {
  allowed: boolean;
  reason?: string;
  maxOutputTokens: number;
  promptTokensEstimate: number;
  projectedTokens: number;
  projectedCostUsd: number;
  snapshot: AiUsageState;
};

function getDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getState(): AiUsageState {
  const globalState = globalThis as GlobalAiUsageState;
  const dateKey = getDateKey();

  if (!globalState.__senseiAiUsageState?.dateKey.startsWith(dateKey)) {
    globalState.__senseiAiUsageState = {
      dateKey,
      externalRequests: 0,
      tokens: 0,
      estimatedCostUsd: 0,
    };
  }

  return globalState.__senseiAiUsageState;
}

function estimateTokens(content: string): number {
  const trimmedContent = content.trim();

  if (!trimmedContent) {
    return 0;
  }

  return Math.ceil(trimmedContent.length / 4);
}

export function estimateMessageTokens(messages: AiMessage[]): number {
  return messages.reduce(
    (total, message) => total + estimateTokens(message.content),
    0,
  );
}

function estimateCostUsd(tokenCount: number): number {
  const env = getAiUsageGuardrailEnv();

  return (tokenCount / 1000) * env.AI_ESTIMATED_COST_USD_PER_1K_TOKENS;
}

function getUsageTokenCount(usage?: AiUsage): number | undefined {
  return usage?.totalTokens ?? usage?.promptTokens ?? undefined;
}

export function evaluateAiUsageGuardrails(
  messages: AiMessage[],
  providerId: AiProviderId,
): AiUsageGuardrailDecision {
  const env = getAiUsageGuardrailEnv();
  const snapshot = { ...getState() };
  const maxOutputTokens = Math.max(1, Math.floor(env.MAX_OUTPUT_TOKENS));
  const promptTokensEstimate = estimateMessageTokens(messages);
  const projectedTokens = promptTokensEstimate + maxOutputTokens;
  const projectedCostUsd = estimateCostUsd(projectedTokens);

  if (promptTokensEstimate > env.MAX_CONTEXT_TOKENS) {
    return {
      allowed: false,
      reason: `Contexto estimado (${promptTokensEstimate} tokens) excede o limite local (${env.MAX_CONTEXT_TOKENS}).`,
      maxOutputTokens,
      promptTokensEstimate,
      projectedTokens,
      projectedCostUsd,
      snapshot,
    };
  }

  if (providerId === "mock") {
    return {
      allowed: true,
      maxOutputTokens,
      promptTokensEstimate,
      projectedTokens,
      projectedCostUsd,
      snapshot,
    };
  }

  if (snapshot.externalRequests + 1 > env.DAILY_AI_REQUEST_LIMIT) {
    return {
      allowed: false,
      reason: `Limite diário de chamadas reais atingido (${env.DAILY_AI_REQUEST_LIMIT}). Usando mock fallback.`,
      maxOutputTokens,
      promptTokensEstimate,
      projectedTokens,
      projectedCostUsd,
      snapshot,
    };
  }

  if (snapshot.tokens + projectedTokens > env.DAILY_TOKEN_LIMIT) {
    return {
      allowed: false,
      reason: `Limite diário de tokens estimados atingido (${env.DAILY_TOKEN_LIMIT}). Usando mock fallback.`,
      maxOutputTokens,
      promptTokensEstimate,
      projectedTokens,
      projectedCostUsd,
      snapshot,
    };
  }

  if (
    env.AI_ESTIMATED_COST_USD_PER_1K_TOKENS > 0 &&
    snapshot.estimatedCostUsd + projectedCostUsd > env.DAILY_COST_LIMIT_USD
  ) {
    return {
      allowed: false,
      reason: `Limite diário de custo estimado atingido (US$ ${env.DAILY_COST_LIMIT_USD}). Usando mock fallback.`,
      maxOutputTokens,
      promptTokensEstimate,
      projectedTokens,
      projectedCostUsd,
      snapshot,
    };
  }

  return {
    allowed: true,
    maxOutputTokens,
    promptTokensEstimate,
    projectedTokens,
    projectedCostUsd,
    snapshot,
  };
}

export function recordExternalAiUsage(
  response: AiGenerateResponse,
  decision: AiUsageGuardrailDecision,
): AiUsageState {
  const state = getState();
  const tokenCount =
    getUsageTokenCount(response.usage) ?? decision.projectedTokens;
  const costUsd =
    response.usage?.estimatedCostUsd ?? estimateCostUsd(tokenCount);

  state.externalRequests += 1;
  state.tokens += tokenCount;
  state.estimatedCostUsd += costUsd;

  return { ...state };
}

export function getAiUsageGuardrailStatus() {
  return {
    config: getAiUsageGuardrailEnv(),
    state: { ...getState() },
  };
}
