export function ChatEmptyState() {
  return (
    <div className="border border-dashed border-zinc-300 p-6 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
      <h3 className="text-base font-medium text-zinc-950 dark:text-zinc-50">
        Start a local mock conversation
      </h3>
      <p className="mt-2 leading-6">
        Ask about SQL, Python, RAG, or a study topic. Responses are generated
        locally with deterministic mock logic. Messages are saved only in this
        browser with localStorage.
      </p>
    </div>
  );
}
