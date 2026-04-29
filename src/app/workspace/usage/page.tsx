export default function WorkspaceUsagePage() {
  return (
    <div>
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
        Usage
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
        Usage and cost logging planned
      </h2>
      <p className="mt-4 max-w-2xl text-zinc-700 dark:text-zinc-300">
        The local schema includes `usage_events`, but this UI is not connected
        to the database yet. Token and cost logging will be added in a later
        scoped task.
      </p>
    </div>
  );
}
