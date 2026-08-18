"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";

export function AdminLogin({ demoCredentials }: { demoCredentials: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Incorrect password.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Could not sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fb grid min-h-[70vh] place-items-center py-16">
      <div className="w-full max-w-sm">
        <div className="mb-7 text-center">
          <div className="inline-block">
            <Logo />
          </div>
          <h1 className="font-display mt-5 text-[26px] leading-tight">Admin panel</h1>
          <p className="mt-1.5 text-[13px] text-[var(--muted)]">
            Sign in to manage orders and the catalog.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="grid gap-4 rounded-[var(--radius-lg)] border bg-[var(--surface)] p-6"
        >
          <div className="grid gap-1.5">
            <label htmlFor="password" className="text-[12.5px] font-semibold">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 rounded-[var(--radius)] border border-[var(--line-strong)] bg-white px-3 text-[14px] outline-none transition focus:border-[var(--ink)]"
            />
          </div>

          {error ? (
            <p role="alert" className="text-[13px] font-semibold text-[var(--action-deep)]">
              {error}
            </p>
          ) : null}

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        {demoCredentials ? (
          <p className="mt-4 rounded-lg bg-[var(--surface-warm)] px-4 py-3 text-[12px] leading-relaxed text-[var(--muted)]">
            <strong className="text-[var(--ink)]">Demo credentials in use.</strong> The password is{" "}
            <code className="mono rounded bg-white px-1.5 py-0.5">flowers-admin</code>. Set{" "}
            <code className="mono">ADMIN_PASSWORD</code> and{" "}
            <code className="mono">ADMIN_SESSION_SECRET</code> before deploying this anywhere public.
          </p>
        ) : null}
      </div>
    </div>
  );
}
