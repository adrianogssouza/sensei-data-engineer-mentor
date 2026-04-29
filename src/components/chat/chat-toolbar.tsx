"use client";

type ChatToolbarProps = {
  disabled?: boolean;
  hasMessages: boolean;
  onClear: () => void;
};

export function ChatToolbar({
  disabled = false,
  hasMessages,
  onClear,
}: ChatToolbarProps) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border border-zinc-200 px-4 py-3 dark:border-zinc-800">
      <p className="text-xs leading-5 text-zinc-500">
        Saved locally in this browser only. No cloud sync, Supabase writes, or
        usage persistence.
      </p>
      <button
        className="border border-zinc-300 px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700"
        disabled={disabled || !hasMessages}
        onClick={onClear}
        type="button"
      >
        Clear chat
      </button>
    </div>
  );
}
