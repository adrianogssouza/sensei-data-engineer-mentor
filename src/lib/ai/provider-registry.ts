import { getAiProviderEnv } from "@/lib/env";
import { geminiAiProvider } from "@/lib/ai/providers/gemini-provider";
import { mockAiProvider } from "@/lib/ai/providers/mock-provider";
import type { AiProvider, AiProviderId } from "@/types/ai";

function isGeminiConfigured(): boolean {
  return Boolean(getAiProviderEnv().GEMINI_API_KEY);
}

export function getDefaultAiProvider(): AiProvider {
  const env = getAiProviderEnv();

  if (env.AI_PROVIDER === "gemini" && isGeminiConfigured()) {
    return geminiAiProvider;
  }

  return mockAiProvider;
}

export function getAiProvider(providerId?: AiProviderId): AiProvider {
  if (!providerId) {
    return getDefaultAiProvider();
  }

  if (providerId === "gemini" && isGeminiConfigured()) {
    return geminiAiProvider;
  }

  if (providerId === "mock") {
    return mockAiProvider;
  }

  return getDefaultAiProvider();
}

export function listAvailableAiProviders(): AiProvider[] {
  if (isGeminiConfigured()) {
    return [mockAiProvider, geminiAiProvider];
  }

  return [mockAiProvider];
}

export function getAiProviderSelectionNote(): string | undefined {
  const env = getAiProviderEnv();

  if (env.AI_PROVIDER === "gemini" && !env.GEMINI_API_KEY) {
    return "AI_PROVIDER=gemini but GEMINI_API_KEY is missing; using mock provider.";
  }

  return undefined;
}
