export type MockRetrievedChunk = {
  documentTitle: string;
  chunkIndex: number;
  content: string;
};

function createSnippet(content: string): string {
  const compactContent = content.replace(/\s+/g, " ").trim();

  if (compactContent.length <= 360) {
    return compactContent;
  }

  return `${compactContent.slice(0, 357)}...`;
}

function createRetrievalResponse(retrievedChunks: MockRetrievedChunk[]): string {
  const firstChunk = retrievedChunks[0];
  const extraCount = retrievedChunks.length - 1;
  const extraText =
    extraCount > 0
      ? ` Encontrei mais ${extraCount} trecho(s) relacionado(s) nas suas fontes.`
      : "";

  return [
    "Local mock com fontes: encontrei um trecho relevante nas suas fontes cadastradas.",
    "",
    `Fonte: ${firstChunk.documentTitle} (chunk ${firstChunk.chunkIndex}).`,
    `Trecho: "${createSnippet(firstChunk.content)}"`,
    "",
    `Use esse trecho como base de estudo: destaque o conceito principal, transforme em uma pergunta pratica e depois valide com um exercicio pequeno.${extraText}`,
  ].join("\n");
}

export function createMockAssistantResponse(
  userMessage: string,
  retrievedChunks: MockRetrievedChunk[] = [],
): string {
  if (retrievedChunks.length > 0) {
    return createRetrievalResponse(retrievedChunks);
  }

  const normalizedMessage = userMessage.toLowerCase();

  if (normalizedMessage.includes("sql")) {
    return "Local mock: SQL practice is a strong next step. Try framing the problem around tables, filters, joins, aggregations, and how you would validate the result.";
  }

  if (normalizedMessage.includes("python")) {
    return "Local mock: for Python in Data Engineering, focus on clean data transformations, file handling, typing, tests, and small scripts that can become reliable pipelines.";
  }

  if (normalizedMessage.includes("rag")) {
    return "Local mock: RAG is planned for SENSEI, but it is not enabled yet. For now, this chat only returns deterministic local responses with no retrieval or AI provider.";
  }

  return "Local mock: I can help you turn this into a focused study step. Restate the goal, identify the missing concept, and choose one small exercise to validate your understanding.";
}
