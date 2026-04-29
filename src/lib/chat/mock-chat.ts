export function createMockAssistantResponse(userMessage: string): string {
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
