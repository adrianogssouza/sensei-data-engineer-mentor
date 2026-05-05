const REQUIRED_PUBLIC_ENV_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

type RequiredPublicEnvKey = (typeof REQUIRED_PUBLIC_ENV_KEYS)[number];

export type PublicEnv = Record<RequiredPublicEnvKey, string>;

export type AiProviderEnv = {
  AI_PROVIDER: string;
  GEMINI_API_KEY?: string;
  GEMINI_MODEL: string;
};

const DEFAULT_AI_PROVIDER = "mock";
const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash-lite";

export type AiUsageGuardrailEnv = {
  DAILY_TOKEN_LIMIT: number;
  DAILY_COST_LIMIT_USD: number;
  DAILY_AI_REQUEST_LIMIT: number;
  MAX_CONTEXT_TOKENS: number;
  MAX_OUTPUT_TOKENS: number;
  AI_ESTIMATED_COST_USD_PER_1K_TOKENS: number;
};

const DEFAULT_DAILY_TOKEN_LIMIT = 100000;
const DEFAULT_DAILY_COST_LIMIT_USD = 1;
const DEFAULT_DAILY_AI_REQUEST_LIMIT = 20;
const DEFAULT_MAX_CONTEXT_TOKENS = 6000;
const DEFAULT_MAX_OUTPUT_TOKENS = 600;
const DEFAULT_AI_ESTIMATED_COST_USD_PER_1K_TOKENS = 0;

function readRequiredEnv(key: RequiredPublicEnvKey): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export function getPublicEnv(): PublicEnv {
  return {
    NEXT_PUBLIC_SUPABASE_URL: readRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: readRequiredEnv(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ),
  };
}

export function assertPublicEnv(): void {
  for (const key of REQUIRED_PUBLIC_ENV_KEYS) {
    readRequiredEnv(key);
  }
}

export function getAiProviderEnv(): AiProviderEnv {
  return {
    AI_PROVIDER: process.env.AI_PROVIDER ?? DEFAULT_AI_PROVIDER,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL,
  };
}

function readNumberEnv(key: string, fallback: number): number {
  const rawValue = process.env[key];

  if (!rawValue) {
    return fallback;
  }

  const value = Number(rawValue);

  if (!Number.isFinite(value) || value < 0) {
    return fallback;
  }

  return value;
}

export function getAiUsageGuardrailEnv(): AiUsageGuardrailEnv {
  return {
    DAILY_TOKEN_LIMIT: readNumberEnv(
      "DAILY_TOKEN_LIMIT",
      DEFAULT_DAILY_TOKEN_LIMIT,
    ),
    DAILY_COST_LIMIT_USD: readNumberEnv(
      "DAILY_COST_LIMIT_USD",
      DEFAULT_DAILY_COST_LIMIT_USD,
    ),
    DAILY_AI_REQUEST_LIMIT: readNumberEnv(
      "DAILY_AI_REQUEST_LIMIT",
      DEFAULT_DAILY_AI_REQUEST_LIMIT,
    ),
    MAX_CONTEXT_TOKENS: readNumberEnv(
      "MAX_CONTEXT_TOKENS",
      DEFAULT_MAX_CONTEXT_TOKENS,
    ),
    MAX_OUTPUT_TOKENS: readNumberEnv(
      "MAX_OUTPUT_TOKENS",
      DEFAULT_MAX_OUTPUT_TOKENS,
    ),
    AI_ESTIMATED_COST_USD_PER_1K_TOKENS: readNumberEnv(
      "AI_ESTIMATED_COST_USD_PER_1K_TOKENS",
      DEFAULT_AI_ESTIMATED_COST_USD_PER_1K_TOKENS,
    ),
  };
}
