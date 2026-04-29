export {
  getAiProvider,
  getAiProviderSelectionNote,
  getDefaultAiProvider,
  listAvailableAiProviders,
} from "@/lib/ai/provider-registry";
export { geminiAiProvider } from "@/lib/ai/providers/gemini-provider";
export { mockAiProvider } from "@/lib/ai/providers/mock-provider";
export type {
  AiGenerateRequest,
  AiGenerateResponse,
  AiMessage,
  AiMessageRole,
  AiModelId,
  AiProvider,
  AiProviderId,
  AiUsage,
} from "@/types/ai";
