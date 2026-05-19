import { WorkspaceCard } from "@/components/workspace/workspace-card";
import { DocumentHealthOverview } from "@/components/workspace/document-health-overview";

const cards = [
  {
    title: "Chat",
    description: "Tutor mock com historico, fallback seguro e recuperacao hibrida sobre fontes.",
    href: "/workspace/chat",
  },
  {
    title: "Documents",
    description: "Fontes, chunks, busca, evals, reprocessamento e health documental.",
    href: "/workspace/documents",
  },
  {
    title: "Usage",
    description: "Guardrails locais de chamadas, tokens e custo estimado.",
    href: "/workspace/usage",
  },
  {
    title: "Settings",
    description: "Area reservada para configuracoes privadas futuras.",
    href: "/workspace/settings",
  },
];

export default function WorkspacePage() {
  return (
    <div>
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
        Overview
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
        Workspace overview
      </h2>
      <p className="mt-4 max-w-2xl text-zinc-700 dark:text-zinc-300">
        Current mode: Single-User / Private. This is the main daily-use shell
        for SENSEI while product modules are built incrementally.
      </p>

      <section className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <h3 className="text-base font-medium text-zinc-950 dark:text-zinc-50">
          Project status
        </h3>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          The private workspace is connected to Supabase with RLS enabled,
          protected internal APIs, document ingestion, hybrid retrieval,
          evals, and operational health checks.
        </p>
      </section>

      <DocumentHealthOverview />

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <WorkspaceCard
            description={card.description}
            href={card.href}
            key={card.href}
            title={card.title}
          />
        ))}
      </section>

      <section className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <h3 className="text-base font-medium text-zinc-950 dark:text-zinc-50">
          Next milestones
        </h3>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          <li>Keep feature work scoped to one module at a time.</li>
          <li>Connect data only when the relevant task asks for it.</li>
          <li>Add AI, RAG, upload, and pgvector in later dedicated tasks.</li>
        </ul>
      </section>
    </div>
  );
}
