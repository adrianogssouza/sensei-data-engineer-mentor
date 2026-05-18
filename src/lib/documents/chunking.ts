export const CHUNK_SIZE = 1200;
export const CHUNK_OVERLAP = 160;

export function createTextChunks(rawContent: string): string[] {
  const normalizedContent = rawContent.replace(/\s+\n/g, "\n").trim();
  const chunks: string[] = [];
  let start = 0;

  while (start < normalizedContent.length) {
    const hardEnd = Math.min(start + CHUNK_SIZE, normalizedContent.length);
    const slice = normalizedContent.slice(start, hardEnd);
    const paragraphBreak = slice.lastIndexOf("\n\n");
    const sentenceBreak = slice.lastIndexOf(". ");
    const softBreak =
      hardEnd < normalizedContent.length
        ? Math.max(paragraphBreak, sentenceBreak)
        : -1;
    const end = softBreak > CHUNK_SIZE * 0.5 ? start + softBreak + 1 : hardEnd;
    const chunk = normalizedContent.slice(start, end).trim();

    if (chunk) {
      chunks.push(chunk);
    }

    if (end >= normalizedContent.length) {
      break;
    }

    start = Math.max(end - CHUNK_OVERLAP, start + 1);
  }

  return chunks;
}
