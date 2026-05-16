import { createHash } from "node:crypto";

export const MOCK_EMBEDDING_PROVIDER = "mock";
export const MOCK_EMBEDDING_MODEL = "mock-hash-embedding-v1";
export const MOCK_EMBEDDING_DIMENSIONS = 1536;

function normalizeToken(token: string): string {
  return token
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getTokenHash(token: string): Buffer {
  return createHash("sha256").update(token).digest();
}

function getTokenIndex(token: string): number {
  return getTokenHash(token).readUInt32BE(0) % MOCK_EMBEDDING_DIMENSIONS;
}

function getTokenSign(token: string): 1 | -1 {
  return getTokenHash(`${token}:sign`)[0] % 2 === 0 ? 1 : -1;
}

function normalizeVector(vector: number[]): number[] {
  const magnitude = Math.sqrt(
    vector.reduce((sum, value) => sum + value * value, 0),
  );

  if (magnitude === 0) {
    return vector;
  }

  return vector.map((value) => value / magnitude);
}

export function createMockEmbedding(content: string): number[] {
  const vector = Array.from({ length: MOCK_EMBEDDING_DIMENSIONS }, () => 0);
  const tokens = content.match(/[\p{L}0-9_+#.-]+/gu) ?? [];

  for (const token of tokens) {
    const normalizedToken = normalizeToken(token);

    if (normalizedToken.length < 2) {
      continue;
    }

    vector[getTokenIndex(normalizedToken)] += getTokenSign(normalizedToken);
  }

  return normalizeVector(vector);
}

export function formatPgvectorEmbedding(vector: number[]): string {
  return `[${vector.map((value) => value.toFixed(6)).join(",")}]`;
}
