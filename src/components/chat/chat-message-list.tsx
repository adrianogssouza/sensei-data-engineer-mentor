import type { ChatMessage } from "@/types/chat";

type ChatMessageListProps = {
  messages: ChatMessage[];
  isResponding: boolean;
};

export function ChatMessageList({
  isResponding,
  messages,
}: ChatMessageListProps) {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <article
          className="border border-zinc-200 p-4 dark:border-zinc-800"
          key={message.id}
        >
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
        </article>
      ))}

      {isResponding ? (
        <div className="border border-zinc-200 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          Responding...
        </div>
      ) : null}
    </div>
  );
}
