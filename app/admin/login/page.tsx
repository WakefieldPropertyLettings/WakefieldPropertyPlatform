"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const ADMIN_EMAIL = "admin@wakefieldpropertylettings.co.uk";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const normalisedEmail = email.trim().toLowerCase();

      if (normalisedEmail !== ADMIN_EMAIL) {
        setErrorMessage(
          "This email address is not authorised to access the admin portal."
        );
        return;
      }

      if (!password.trim()) {
        setErrorMessage("Please enter your password.");
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalisedEmail,
        password,
      });

      if (error || !data.user) {
        setErrorMessage("Incorrect email address or password.");
        return;
      }

      if (data.user.email?.toLowerCase() !== ADMIN_EMAIL) {
        await supabase.auth.signOut();

        setErrorMessage(
          "This account is not authorised to access the admin portal."
        );

        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch (error) {
      console.error("Admin login error:", error);

      setErrorMessage(
        "Unable to sign in at the moment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#071b3a] px-5 py-16">
      <section className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="bg-[#0b2346] px-8 py-9 text-center text-white">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#efad3f]">
            Secure administration
          </p>

          <h1 className="mt-3 font-serif text-3xl font-bold">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-white/75">
            Wakefield Property Lettings Limited
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 p-8">
          <div>
            <label
              htmlFor="admin-email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email address
            </label>

            <input
              id="admin-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading}
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none transition focus:border-[#efad3f] focus:ring-4 focus:ring-[#efad3f]/15 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Password
            </label>

            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none transition focus:border-[#efad3f] focus:ring-4 focus:ring-[#efad3f]/15 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-[#efad3f] px-5 font-bold text-[#071b3a] transition hover:bg-[#f6bb54] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in securely"}
          </button>

          <p className="text-center text-xs leading-5 text-slate-500">
            Access is restricted to authorised administrators.
          </p>
        </form>
      </section>
    </main>
  );
}