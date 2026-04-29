"use client";

import { useState } from "react";

type ChatInputProps = {
  disabled?: boolean;
  onSend: (content: string) => void;
};

export function ChatInput({ disabled = false, onSend }: ChatInputProps) {
  const [content, setContent] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent || disabled) {
      return;
    }

    onSend(trimmedContent);
    setContent("");
  }

  return (
    <form className="mt-6 flex flex-col gap-3" onSubmit={handleSubmit}>
      <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
        Message
      </label>
      <textarea
        className="min-h-28 resize-y border border-zinc-300 bg-transparent px-3 py-2 text-sm leading-6 outline-none focus:border-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:focus:border-zinc-300"
        disabled={disabled}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Ask a study question..."
        value={content}
      />
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-zinc-500">
          Local mock only. Browser storage only. No API, no database, no RAG.
        </p>
        <button
          className="bg-zinc-950 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950"
          disabled={disabled || !content.trim()}
          type="submit"
        >
          Send
        </button>
      </div>
    </form>
  );
}
