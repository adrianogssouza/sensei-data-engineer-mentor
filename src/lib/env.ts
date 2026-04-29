const REQUIRED_PUBLIC_ENV_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

type RequiredPublicEnvKey = (typeof REQUIRED_PUBLIC_ENV_KEYS)[number];

export type PublicEnv = Record<RequiredPublicEnvKey, string>;

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
