import { redirect } from "next/navigation";

import { signOut } from "@/app/(auth)/actions";
import { SiteNav } from "@/components/site-nav";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <section className="mx-auto w-full max-w-3xl">
        <SiteNav />
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
          Protected
        </p>
        <h1 className="text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
          SENSEI Dashboard
        </h1>
        <p className="mt-4 text-zinc-700 dark:text-zinc-300">
          You are signed in as {user.email ?? "a Supabase user"}.
        </p>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          This is a minimal protected page. Chat, RAG, database tables, and
          study features are intentionally not implemented yet.
        </p>

        <form action={signOut} className="mt-8">
          <button
            className="border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700"
            type="submit"
          >
            Log out
          </button>
        </form>
      </section>
    </main>
  );
}
