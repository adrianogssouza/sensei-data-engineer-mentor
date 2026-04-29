import { GoogleGenAI, type Content } from "@google/genai";

import { getAiProviderEnv } from "@/lib/env";
import type {
  AiGenerateRequest,
  AiGenerateResponse,
  AiMessage,
  AiProvider,
} from "@/types/ai";

const GEMINI_PROVIDER_ID = "gemini";
const REDACTED_SECRET = "[redacted]";

function getDefaultModel(): string {
  return getAiProviderEnv().GEMINI_MODEL;
}

function getApiKey(): string {
  const apiKey = getAiProviderEnv().GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini provider is not configured.");
  }

  return apiKey;
}

function toGeminiRole(message: AiMessage): "user" | "model" {
  if (message.role === "assistant") {
    return "model";
  }

  return "user";
}

function toGeminiContents(messages: AiMessage[]): Content[] {
  return messages
    .filter((message) => message.role !== "system")
    .map((message) => ({
      role: toGeminiRole(message),
      parts: [{ text: message.content }],
    }));
}

function getSystemInstruction(messages: AiMessage[]): string | undefined {
  const systemMessages = messages
    .filter((message) => message.role === "system")
    .map((message) => message.content.trim())
    .filter(Boolean);

  if (systemMessages.length === 0) {
    return undefined;
  }

  return systemMessages.join("\n\n");
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Gemini provider request failed.";
}

function sanitizeErrorMessage(message: string): string {
  const apiKey = getAiProviderEnv().GEMINI_API_KEY;
  let sanitizedMessage = message;

  if (apiKey) {
    sanitizedMessage = sanitizedMessage.split(apiKey).join(REDACTED_SECRET);
  }

  return sanitizedMessage.replace(/AIza[0-9A-Za-z_-]+/g, REDACTED_SECRET);
}

export const geminiAiProvider: AiProvider = {
  id: GEMINI_PROVIDER_ID,
  name: "Gemini provider",
  get defaultModel() {
    return getDefaultModel();
  },
  async generate(request: AiGenerateRequest): Promise<AiGenerateResponse> {
    const model = request.model ?? getDefaultModel();
    const ai = new GoogleGenAI({ apiKey: getApiKey() });

    try {
      const response = await ai.models.generateContent({
        model,
        contents: toGeminiContents(request.messages),
        config: {
          maxOutputTokens: request.maxTokens ?? 600,
          systemInstruction: getSystemInstruction(request.messages),
          temperature: request.temperature,
        },
      });
      const usage = response.usageMetadata;

      return {
        content: response.text ?? "",
        provider: GEMINI_PROVIDER_ID,
        model: response.modelVersion ?? model,
        usage: usage
          ? {
              promptTokens: usage.promptTokenCount,
              completionTokens: usage.candidatesTokenCount,
              totalTokens: usage.totalTokenCount,
              metadata: {
                thoughtsTokenCount: usage.thoughtsTokenCount,
              },
            }
          : undefined,
        metadata: {
          externalApiCall: true,
          responseId: response.responseId,
        },
      };
    } catch (error) {
      const sanitizedMessage = sanitizeErrorMessage(getErrorMessage(error));

      console.error("[ai-provider-error]", {
        provider: GEMINI_PROVIDER_ID,
        model,
        message: sanitizedMessage,
      });

      throw new Error(`Gemini failed: ${sanitizedMessage}`);
    }
  },
};
