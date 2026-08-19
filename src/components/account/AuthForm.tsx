"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { brand } from "@/config/brand";
import { authFeedback } from "@/lib/authFeedback";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isLogin = mode === "login";

  return (
    <div className="container-fb pt-14 pb-28">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center">
          <h1 className="font-display text-[28px] leading-tight sm:text-[32px]">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-[13.5px] text-[var(--muted)]">
            {isLogin
              ? "Sign in to track orders and your wishlist."
              : "Join Flower's Rewards and earn on every order."}
          </p>
        </div>

        {done ? (
          <div className="mt-8 rounded-[var(--radius-lg)] border bg-[var(--surface)] p-6 text-center text-[14px]">
            <p className="font-semibold">Thanks!</p>
            <p className="mt-1 text-[13px] text-[var(--muted)]">
              Your account action was completed. Redirecting you now…
            </p>
          </div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (submitting) return;
              setSubmitting(true);
              setError(null);
              const form = new FormData(e.currentTarget);
              const res = await fetch(`/api/auth/${isLogin ? "login" : "register"}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "same-origin",
                body: JSON.stringify({
                  name: form.get("name"),
                  email: form.get("email"),
                  password: form.get("password"),
                }),
              }).catch(() => null);
              if (!res?.ok) {
                const payload = await res?.json().catch(() => null) as { error?: unknown } | null;
                const code = typeof payload?.error === "string" ? payload.error : "authentication_failed";
                setError(authFeedback(code, isLogin));
                setSubmitting(false);
                return;
              }
              setDone(true);
              router.replace(params.get("next") || "/");
            }}
            className="mt-8 grid gap-4 rounded-[var(--radius-lg)] border bg-[var(--surface)] p-6 sm:p-7"
          >
            {!isLogin ? (
              <Field label="Full name" name="name" autoComplete="name" required />
            ) : null}
            <Field label="Email" name="email" type="email" autoComplete="email" required />
            <Field
              label="Password"
              name="password"
              type="password"
              minLength={isLogin ? undefined : 8}
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
            />
            {isLogin ? (
              <div className="flex justify-end">
                <a
                  href={`${brand.emailHref}?subject=${encodeURIComponent("Password reset assistance")}`}
                  className="text-[12.5px] font-semibold text-[var(--muted)] hover:text-[var(--ink)]"
                >
                  Forgot password?
                </a>
              </div>
            ) : null}
            <Button type="submit" variant="primary" fullWidth size="lg" className="mt-1">
              {submitting ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
            </Button>
            {error ? <p role="alert" className="text-[13px] font-semibold text-[var(--action-deep)]">{error}</p> : null}
          </form>
        )}

        <p className="mt-5 text-center text-[13px] text-[var(--muted)]">
          {isLogin ? (
            <>
              New here?{" "}
              <Link href="/account/register" className="font-semibold text-[var(--action-deep)] hover:underline">
                Create an account
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/account/login" className="font-semibold text-[var(--action-deep)] hover:underline">
                Sign in
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  minLength,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={name} className="text-[12.5px] font-semibold text-[var(--ink)]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        className="h-11 rounded-[var(--radius)] border border-[var(--line-strong)] bg-white px-3 text-[14px] outline-none transition focus:border-[var(--ink)]"
      />
    </div>
  );
}
