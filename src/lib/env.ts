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
