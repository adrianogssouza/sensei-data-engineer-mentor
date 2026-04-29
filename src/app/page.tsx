import Link from "next/link";

import { SiteNav } from "@/components/site-nav";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center bg-background px-6 py-16 text-foreground">
      <section className="mx-auto w-full max-w-3xl">
        <SiteNav />
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
          Single-User Mode / v0.1-alpha preparation
        </p>
        <h1 className="text-4xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-50 sm:text-5xl">
          SENSEI Data Engineer Mentor
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
          Personal AI study mentor for Data Engineering, currently optimized as
          a private single-user app for faster product validation.
        </p>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Auth remains available for future use, but it is no longer required
          for the main local workflow. Start from the workspace and keep moving.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            className="bg-zinc-950 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-50 dark:text-zinc-950"
            href="/workspace"
          >
            Open workspace
          </Link>
          <Link
            className="border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700"
            href="/login"
          >
            Login
          </Link>
          <Link
            className="border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700"
            href="/signup"
          >
            Signup
          </Link>
        </div>
        <div className="mt-10 border-t border-zinc-200 pt-6 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          Current foundation: Next.js App Router, TypeScript, Tailwind CSS,
          Supabase Auth foundation, and a public private-mode workspace. AI,
          RAG, chat, upload, pgvector, and deployment are intentionally not
          implemented yet.
        </div>
      </section>
    </main>
  );
}
