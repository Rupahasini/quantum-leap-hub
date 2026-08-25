import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Atom, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { countries, genderOptions, useSession, type Gender } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in or create your QLA learner account" },
      {
        name: "description",
        content:
          "Sign in with Google or email to track your quantum machine learning roadmap, level up your profile and earn stars.",
      },
      { property: "og:title", content: "Sign in — Quantum Learning Algorithms" },
      {
        property: "og:description",
        content: "Create your learner profile and continue your 12-chapter quantum machine learning journey.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session, loading } = useSession();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [country, setCountry] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate({ to: "/dashboard", replace: true });
  }, [loading, session, navigate]);

  async function handleGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in failed", { description: result.error.message });
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard", replace: true });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        if (!gender || !country) {
          toast.error("Please select your gender and country");
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { display_name: displayName || email.split("@")[0], gender, country },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setSent(true);
          toast.success("Check your email to confirm your account");
          return;
        }
        navigate({ to: "/dashboard", replace: true });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard", replace: true });
      }
    } catch (err) {
      toast.error(mode === "signup" ? "Sign up failed" : "Sign in failed", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative isolate overflow-hidden">
      <div className="absolute inset-0 bg-hero" aria-hidden />
      <div className="absolute inset-0 bg-grid opacity-20" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div className="lg:pt-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
            <Atom className="size-3.5" /> Learner account
          </span>
          <h1 className="mt-6 text-3xl font-semibold leading-tight sm:text-4xl">
            Track your <span className="text-gradient">quantum roadmap</span>
          </h1>
          <p className="mt-4 max-w-md text-sm text-muted-foreground sm:text-base">
            Sign in to unlock a personal dashboard: a phase-by-phase progress roadmap, an animated
            profile avatar that matches your identity, XP and levels for every task you complete.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            <li>· One-tap Google sign-in</li>
            <li>· Gender-matched animated avatar</li>
            <li>· Level up across 12 chapters and 3 tracks</li>
          </ul>
        </div>

        <div className="card-elevated p-6 sm:p-8">
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-lg border border-border bg-surface-2 p-1">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors " +
                  (mode === m
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground")
                }
              >
                {m === "signin" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>

          <Button type="button" variant="outline" className="w-full" onClick={handleGoogle} disabled={busy}>
            <svg viewBox="0 0 48 48" className="size-4" aria-hidden>
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.4 5.4 2.5 13.3l7.8 6.1C12.2 13.2 17.6 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-2.8-.4-4.1H24v8.4h12.5c-.3 2.1-1.6 5.2-4.6 7.3l7.6 5.9c4.4-4.1 6.6-10.1 6.6-17.5z" />
              <path fill="#FBBC05" d="M10.3 28.6A14.5 14.5 0 019.5 24c0-1.6.3-3.2.8-4.6l-7.8-6.1A24 24 0 000 24c0 3.9.9 7.5 2.5 10.7l7.8-6.1z" />
              <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.5-5.9l-7.6-5.9c-2 1.4-4.7 2.4-7.9 2.4-6.4 0-11.8-3.7-13.7-9l-7.8 6.1C6.4 42.6 14.6 48 24 48z" />
            </svg>
            Continue with Google
          </Button>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or email <span className="h-px flex-1 bg-border" />
          </div>

          {sent ? (
            <p className="rounded-lg border border-border bg-surface-2 p-4 text-sm text-muted-foreground">
              We sent a confirmation link to <span className="text-foreground">{email}</span>. Confirm
              it, then log in to open your dashboard.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <Field label="Display name">
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    maxLength={60}
                    placeholder="Ada Q."
                    className="input-field"
                  />
                </Field>
              )}
              <Field label="Email">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={255}
                  placeholder="you@example.com"
                  className="input-field"
                />
              </Field>
              <Field label="Password">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="input-field"
                />
              </Field>
              {mode === "signup" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Gender">
                    <select
                      required
                      value={gender}
                      onChange={(e) => setGender(e.target.value as Gender)}
                      className="input-field"
                    >
                      <option value="">Select…</option>
                      {genderOptions.map((g) => (
                        <option key={g.value} value={g.value}>
                          {g.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Country">
                    <select
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="input-field"
                    >
                      <option value="">Select…</option>
                      {countries.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={busy}>
                {busy && <Loader2 className="size-4 animate-spin" />}
                {mode === "signin" ? "Log in" : "Create account"}
              </Button>
            </form>
          )}

          <p className="mt-6 text-xs text-muted-foreground">
            Browsing without an account?{" "}
            <Link to="/syllabus" className="text-primary hover:underline">
              Explore the syllabus
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
