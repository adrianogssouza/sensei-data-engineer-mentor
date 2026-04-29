import Link from "next/link";

import { SiteNav } from "@/components/site-nav";

import { signInWithEmail } from "../actions";

type LoginPageProps = {
  searchParams?: Promise<{
    message?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const message = (await searchParams)?.message;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16 text-foreground">
      <section className="w-full max-w-sm">
        <SiteNav />
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
          SENSEI
        </p>
        <h1 className="text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
          Log in
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Access the protected SENSEI dashboard with Supabase email/password
          auth.
        </p>

        {message ? (
          <p className="mt-6 border border-zinc-200 px-4 py-3 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
            {message}
          </p>
        ) : null}

        <form action={signInWithEmail} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Email
            <input
              className="border border-zinc-300 bg-transparent px-3 py-2 text-base outline-none focus:border-zinc-700 dark:border-zinc-700 dark:focus:border-zinc-300"
              name="email"
              required
              type="email"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Password
            <input
              className="border border-zinc-300 bg-transparent px-3 py-2 text-base outline-none focus:border-zinc-700 dark:border-zinc-700 dark:focus:border-zinc-300"
              minLength={6}
              name="password"
              required
              type="password"
            />
          </label>
          <button
            className="mt-2 bg-zinc-950 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-50 dark:text-zinc-950"
            type="submit"
          >
            Log in
          </button>
        </form>

        <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
          No account yet?{" "}
          <Link className="font-medium text-foreground" href="/signup">
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}
