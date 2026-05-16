import {
  normalizeChunkSearchQuery,
} from "@/lib/documents/chunk-search";
import {
  searchHybridDocumentChunks,
  type HybridChunkSearchResult,
} from "@/lib/documents/hybrid-search";
import { getPrivateAccessResponse, hasPrivateAccess } from "@/lib/private-access";

const MAX_EVAL_CASES = 10;
const MAX_EXPECTED_TEXT_LENGTH = 240;
const DEFAULT_MAX_RESULTS = 3;

type RetrievalEvalCaseInput = {
  name?: unknown;
  query?: unknown;
  expectedDocumentTitle?: unknown;
  expectedContentIncludes?: unknown;
  expectedChunkIndex?: unknown;
};

type RetrievalEvalCase = {
  name: string;
  query: string;
  expectedDocumentTitle?: string;
  expectedContentIncludes?: string;
  expectedChunkIndex?: number;
};

type RetrievalEvalRequestBody = {
  cases?: unknown;
  maxResults?: unknown;
};

function normalizeComparisonText(value: string): string {
  return value
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function normalizeExpectedText(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim().slice(0, MAX_EXPECTED_TEXT_LENGTH);

  return normalized || undefined;
}

function normalizeExpectedChunkIndex(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    return undefined;
  }

  return value;
}

function toEvalCase(
  value: unknown,
  fallbackIndex: number,
): RetrievalEvalCase | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const candidate = value as RetrievalEvalCaseInput;
  const query =
    typeof candidate.query === "string"
      ? normalizeChunkSearchQuery(candidate.query)
      : undefined;

  if (!query) {
    return undefined;
  }

  const name =
    typeof candidate.name === "string" && candidate.name.trim()
      ? candidate.name.trim().slice(0, 80)
      : `Caso ${fallbackIndex + 1}`;

  return {
    name,
    query,
    expectedDocumentTitle: normalizeExpectedText(
      candidate.expectedDocumentTitle,
    ),
    expectedContentIncludes: normalizeExpectedText(
      candidate.expectedContentIncludes,
    ),
    expectedChunkIndex: normalizeExpectedChunkIndex(
      candidate.expectedChunkIndex,
    ),
  };
}

function getMaxResults(value: unknown): number {
  if (typeof value !== "number" || !Number.isInteger(value)) {
    return DEFAULT_MAX_RESULTS;
  }

  return Math.min(Math.max(value, 1), 8);
}

function matchesExpectedTitle(
  result: HybridChunkSearchResult | undefined,
  expectedDocumentTitle: string | undefined,
): boolean {
  if (!expectedDocumentTitle) {
    return true;
  }

  return Boolean(
    result &&
      normalizeComparisonText(result.documentTitle).includes(
        normalizeComparisonText(expectedDocumentTitle),
      ),
  );
}

function matchesExpectedContent(
  result: HybridChunkSearchResult | undefined,
  expectedContentIncludes: string | undefined,
): boolean {
  if (!expectedContentIncludes) {
    return true;
  }

  return Boolean(
    result &&
      normalizeComparisonText(result.content).includes(
        normalizeComparisonText(expectedContentIncludes),
      ),
  );
}

function matchesExpectedChunkIndex(
  result: HybridChunkSearchResult | undefined,
  expectedChunkIndex: number | undefined,
): boolean {
  if (expectedChunkIndex === undefined) {
    return true;
  }

  return result?.chunkIndex === expectedChunkIndex;
}

async function runEvalCase(testCase: RetrievalEvalCase, maxResults: number) {
  const searchResponse = await searchHybridDocumentChunks(testCase.query, {
    maxResults,
  });
  const topResult = searchResponse.retrievedChunks[0];
  const passed =
    searchResponse.retrievedChunks.length > 0 &&
    matchesExpectedTitle(topResult, testCase.expectedDocumentTitle) &&
    matchesExpectedContent(topResult, testCase.expectedContentIncludes) &&
    matchesExpectedChunkIndex(topResult, testCase.expectedChunkIndex);

  return {
    name: testCase.name,
    query: testCase.query,
    passed,
    expected: {
      documentTitle: testCase.expectedDocumentTitle ?? null,
      contentIncludes: testCase.expectedContentIncludes ?? null,
      chunkIndex: testCase.expectedChunkIndex ?? null,
    },
    actualTopResult: topResult
      ? {
          chunkId: topResult.chunkId,
          documentId: topResult.documentId,
          documentTitle: topResult.documentTitle,
          chunkIndex: topResult.chunkIndex,
          hybridScore: topResult.hybridScore,
          lexicalScore: topResult.score,
          vectorSimilarity: topResult.vectorSimilarity,
          matchedTerms: topResult.matchedTerms,
          contentPreview: topResult.content.slice(0, 240),
        }
      : null,
    retrieval: searchResponse.retrieval,
  };
}

export async function GET(request: Request) {
  if (!hasPrivateAccess(request)) {
    return getPrivateAccessResponse();
  }

  return Response.json({
    available: true,
    description:
      "POST cases para validar se a recuperacao hibrida retorna o chunk esperado no topo.",
    example: {
      cases: [
        {
          name: "Window functions",
          query: "Explique window functions",
          expectedDocumentTitle: "SQL",
          expectedContentIncludes: "window",
          expectedChunkIndex: 0,
        },
      ],
      maxResults: 3,
    },
  });
}

export async function POST(request: Request) {
  if (!hasPrivateAccess(request)) {
    return getPrivateAccessResponse();
  }

  let body: RetrievalEvalRequestBody;

  try {
    body = (await request.json()) as RetrievalEvalRequestBody;
  } catch {
    return Response.json(
      { available: false, error: "JSON invalido.", results: [] },
      { status: 400 },
    );
  }

  if (!Array.isArray(body.cases)) {
    return Response.json(
      { available: false, error: "cases obrigatorio.", results: [] },
      { status: 400 },
    );
  }

  const cases = body.cases
    .slice(0, MAX_EVAL_CASES)
    .map(toEvalCase)
    .filter((testCase): testCase is RetrievalEvalCase => Boolean(testCase));

  if (cases.length === 0) {
    return Response.json(
      { available: false, error: "Nenhum caso valido.", results: [] },
      { status: 400 },
    );
  }

  try {
    const maxResults = getMaxResults(body.maxResults);
    const results = await Promise.all(
      cases.map((testCase) => runEvalCase(testCase, maxResults)),
    );
    const passedCount = results.filter((result) => result.passed).length;

    return Response.json({
      available: true,
      maxResults,
      summary: {
        total: results.length,
        passed: passedCount,
        failed: results.length - passedCount,
      },
      results,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Evals indisponiveis.";

    return Response.json({
      available: false,
      error: message,
      results: [],
    });
  }
}
