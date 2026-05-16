import {
  extractChunkSearchTerms,
  searchDocumentChunks,
  type ChunkSearchResult,
} from "@/lib/documents/chunk-search";
import {
  searchVectorDocumentChunks,
  type VectorChunkSearchResult,
} from "@/lib/documents/vector-search";

const DEFAULT_MAX_RESULTS = 3;
const VECTOR_SCORE_WEIGHT = 20;

export type HybridChunkSearchResult = {
  chunkId: string;
  documentId: string;
  documentTitle: string;
  chunkIndex: number;
  content: string;
  score: number;
  matchedTerms: string[];
  phraseMatches: number;
  termMatches: number;
  vectorSimilarity: number | null;
  hybridScore: number;
};

export type HybridChunkSearchMetadata = {
  mode: "hybrid-local" | "lexical-local";
  queryTerms: string[];
  ranking?: "hybrid-lexical-vector-v1";
  lexicalResultCount?: number;
  vectorResultCount?: number;
  resultCount: number;
};

export type HybridChunkSearchResponse = {
  retrieval: HybridChunkSearchMetadata;
  retrievedChunks: HybridChunkSearchResult[];
};

type SearchHybridDocumentChunksOptions = {
  maxResults?: number;
};

function toHybridChunkFromLexical(
  result: ChunkSearchResult,
): HybridChunkSearchResult {
  return {
    chunkId: result.chunkId,
    documentId: result.documentId,
    documentTitle: result.documentTitle,
    chunkIndex: result.chunkIndex,
    content: result.content,
    score: result.score,
    matchedTerms: result.matchedTerms,
    phraseMatches: result.phraseMatches,
    termMatches: result.termMatches,
    vectorSimilarity: null,
    hybridScore: result.score,
  };
}

function mergeVectorChunk(
  current: HybridChunkSearchResult | undefined,
  result: VectorChunkSearchResult,
): HybridChunkSearchResult {
  const vectorScore = result.similarity * VECTOR_SCORE_WEIGHT;

  if (!current) {
    return {
      chunkId: result.chunkId,
      documentId: result.documentId,
      documentTitle: result.documentTitle,
      chunkIndex: result.chunkIndex,
      content: result.content,
      score: 0,
      matchedTerms: [],
      phraseMatches: 0,
      termMatches: 0,
      vectorSimilarity: result.similarity,
      hybridScore: vectorScore,
    };
  }

  return {
    ...current,
    vectorSimilarity: result.similarity,
    hybridScore: current.score + vectorScore,
  };
}

export async function searchHybridDocumentChunks(
  query: string,
  options: SearchHybridDocumentChunksOptions = {},
): Promise<HybridChunkSearchResponse> {
  const searchTerms = extractChunkSearchTerms(query);
  const maxResults = options.maxResults ?? DEFAULT_MAX_RESULTS;

  if (searchTerms.length === 0) {
    return {
      retrieval: {
        mode: "lexical-local",
        queryTerms: searchTerms,
        resultCount: 0,
      },
      retrievedChunks: [],
    };
  }

  const [lexicalResults, vectorResults] = await Promise.all([
    searchDocumentChunks(query, { maxResults }),
    searchVectorDocumentChunks(query, { maxResults }).catch(() => []),
  ]);
  const resultsByChunkId = new Map<string, HybridChunkSearchResult>();

  for (const result of lexicalResults) {
    resultsByChunkId.set(result.chunkId, toHybridChunkFromLexical(result));
  }

  for (const result of vectorResults) {
    resultsByChunkId.set(
      result.chunkId,
      mergeVectorChunk(resultsByChunkId.get(result.chunkId), result),
    );
  }

  const retrievedChunks = Array.from(resultsByChunkId.values())
    .sort((a, b) => b.hybridScore - a.hybridScore || a.chunkIndex - b.chunkIndex)
    .slice(0, maxResults);

  return {
    retrieval: {
      mode: "hybrid-local",
      queryTerms: searchTerms,
      ranking: "hybrid-lexical-vector-v1",
      lexicalResultCount: lexicalResults.length,
      vectorResultCount: vectorResults.length,
      resultCount: retrievedChunks.length,
    },
    retrievedChunks,
  };
}
