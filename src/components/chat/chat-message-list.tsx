import type { ChatMessage } from "@/types/chat";

type ChatMessageListProps = {
  messages: ChatMessage[];
  isResponding: boolean;
};

type RetrievalMetadata = {
  mode?: unknown;
  ranking?: unknown;
  resultCount?: unknown;
  lexicalResultCount?: unknown;
  vectorResultCount?: unknown;
  queryTerms?: unknown;
};

function getRetrievalMetadata(message: ChatMessage): RetrievalMetadata | null {
  const retrieval = message.metadata?.retrieval;

  if (!retrieval || typeof retrieval !== "object" || Array.isArray(retrieval)) {
    return null;
  }

  return retrieval as RetrievalMetadata;
}

function formatCount(value: unknown): string {
  return typeof value === "number" ? String(value) : "0";
}

function getRetrievalLabel(retrieval: RetrievalMetadata): string {
  const mode =
    typeof retrieval.mode === "string" ? retrieval.mode : "retrieval";
  const ranking =
    typeof retrieval.ranking === "string" ? retrieval.ranking : "sem ranking";

  return `${mode} · ${ranking}`;
}

function getQueryTerms(retrieval: RetrievalMetadata): string | null {
  if (!Array.isArray(retrieval.queryTerms)) {
    return null;
  }

  const terms = retrieval.queryTerms.filter(
    (term): term is string => typeof term === "string",
  );

  return terms.length > 0 ? terms.join(", ") : null;
}

export function ChatMessageList({
  isResponding,
  messages,
}: ChatMessageListProps) {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <ChatMessageArticle key={message.id} message={message} />
      ))}

      {isResponding ? (
        <div className="border border-zinc-200 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          Responding...
        </div>
      ) : null}
    </div>
  );
}

function ChatMessageArticle({ message }: { message: ChatMessage }) {
  const retrieval = getRetrievalMetadata(message);
  const queryTerms = retrieval ? getQueryTerms(retrieval) : null;

  return (
    <article className="border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium capitalize text-zinc-950 dark:text-zinc-50">
          {message.role}
        </p>
        <time className="text-xs text-zinc-500" dateTime={message.createdAt}>
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      </div>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-700 dark:text-zinc-300">
        {message.content}
      </p>

      {retrieval ? (
        <div className="mt-4 border border-zinc-200 bg-zinc-50 p-3 text-xs leading-5 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-400">
          <p className="font-medium text-zinc-800 dark:text-zinc-200">
            {getRetrievalLabel(retrieval)}
          </p>
          <p className="mt-1">
            resultados {formatCount(retrieval.resultCount)} · lexical{" "}
            {formatCount(retrieval.lexicalResultCount)} · vetorial{" "}
            {formatCount(retrieval.vectorResultCount)}
          </p>
          {queryTerms ? <p className="mt-1">termos: {queryTerms}</p> : null}
        </div>
      ) : null}
    </article>
  );
}
