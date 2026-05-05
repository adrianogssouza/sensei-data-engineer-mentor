import {
  getAiProviderSelectionNote,
  getDefaultAiProvider,
  mockAiProvider,
} from "@/lib/ai";
import {
  evaluateAiUsageGuardrails,
  recordExternalAiUsage,
} from "@/lib/ai/usage-guardrails";
import type { AiGenerateRequest, AiMessage } from "@/types/ai";

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;

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
  const generateRequest: AiGenerateRequest = {
    messages,
    maxTokens: guardrailDecision.maxOutputTokens,
    metadata: {
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
      },
    });
  }
}
