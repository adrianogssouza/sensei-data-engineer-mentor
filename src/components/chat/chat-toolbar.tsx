"use client";

type ChatToolbarProps = {
  disabled?: boolean;
  hasMessages: boolean;
  onClear: () => void;
  onNew: () => void;
};

export function ChatToolbar({
  disabled = false,
  hasMessages,
  onClear,
  onNew,
}: ChatToolbarProps) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border border-zinc-200 px-4 py-3 dark:border-zinc-800">
      <p className="text-xs leading-5 text-zinc-500">
        Salvo no Supabase quando configurado; caso contrário, apenas neste
        navegador. Sem RAG ou persistência de uso.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          className="border border-zinc-300 px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700"
          disabled={disabled}
          onClick={onNew}
          type="button"
        >
          Nova conversa
        </button>
        <button
          className="border border-zinc-300 px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700"
          disabled={disabled || !hasMessages}
          onClick={onClear}
          type="button"
        >
          Limpar chat
        </button>
      </div>
    </div>
  );
}
