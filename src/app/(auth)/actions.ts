"use server";

import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

type CredentialsResult =
  | {
      email: string;
      password: string;
    }
  | {
      error: string;
    };

function getCredentials(formData: FormData): CredentialsResult {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      error: "Email and password are required.",
    };
  }

  return { email, password };
}

function authRedirect(path: "/login" | "/signup", message: string): never {
  redirect(`${path}?message=${encodeURIComponent(message)}`);
}

export async function signInWithEmail(formData: FormData) {
  const credentials = getCredentials(formData);

  if ("error" in credentials) {
    authRedirect("/login", credentials.error);
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    authRedirect("/login", error.message);
  }

  redirect("/dashboard");
}

export async function signUpWithEmail(formData: FormData) {
  const credentials = getCredentials(formData);

  if ("error" in credentials) {
    authRedirect("/signup", credentials.error);
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp(credentials);

  if (error) {
    authRedirect("/signup", error.message);
  }

  if (!data.session) {
    authRedirect(
      "/login",
      "Check your email to confirm your account before signing in.",
    );
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();

  await supabase.auth.signOut();

  redirect("/login");
}
