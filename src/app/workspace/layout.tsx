import type { ReactNode } from "react";

import { SiteNav } from "@/components/site-nav";
import { WorkspaceNav } from "@/components/workspace/workspace-nav";

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="border-b border-zinc-200 pb-6 dark:border-zinc-800">
          <SiteNav />
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            SENSEI Workspace
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
            Single-user private workspace
          </h1>
        </header>

        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="lg:border-r lg:border-zinc-200 lg:pr-6 lg:dark:border-zinc-800">
            <WorkspaceNav />
          </aside>
          <section>{children}</section>
        </div>
      </div>
    </main>
  );
}
