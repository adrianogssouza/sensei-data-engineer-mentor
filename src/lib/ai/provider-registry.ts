import { mockAiProvider } from "@/lib/ai/providers/mock-provider";
import type { AiProvider, AiProviderId } from "@/types/ai";

const availableProviders: Partial<Record<AiProviderId, AiProvider>> = {
  mock: mockAiProvider,
};

export function getDefaultAiProvider(): AiProvider {
  return mockAiProvider;
}

export function getAiProvider(providerId?: AiProviderId): AiProvider {
  if (!providerId) {
    return getDefaultAiProvider();
  }

  return availableProviders[providerId] ?? getDefaultAiProvider();
}

export function listAvailableAiProviders(): AiProvider[] {
  return Object.values(availableProviders);
}
