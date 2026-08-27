import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, CircleDashed, Loader2, Star, Trophy } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { QuantumRoadmap } from "@/components/QuantumRoadmap";
import { chapters } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";
import {
  avatarFor,
  countries,
  genderOptions,
  levelFromXp,
  levelTitle,
  useProfile,
  useSession,
  type Gender,
} from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Your quantum learning roadmap & profile level" },
      {
        name: "description",
        content:
          "Your personal dashboard: phase-by-phase roadmap progress, XP, profile level and an animated avatar for your quantum machine learning journey.",
      },
      { property: "og:title", content: "Your QLA dashboard" },
      {
        property: "og:description",
        content: "Track completed phases, XP and level ups across the 12-chapter quantum curriculum.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useSession();
  const { data: profile, isLoading } = useProfile(user?.id);
  const queryClient = useQueryClient();
  const progress = useProgress();

  const xp = useMemo(
    () =>
      progress.completedChapters.length * 100 +
      progress.quizzesPassed.length * 40 +
      progress.katasDone.length * 30 +
      progress.projectsSubmitted.length * 120,
    [progress],
  );
  const { level, intoLevel, toNext, pct } = levelFromXp(xp);

  // Keep the stored profile level/XP in sync with earned progress.
  useEffect(() => {
    if (!user || !profile) return;
    if (profile.xp === xp && profile.level === level) return;
    supabase
      .from("profiles")
      .update({ xp, level, completed_phases: progress.completedChapters })
      .eq("id", user.id)
      .then(() => queryClient.invalidateQueries({ queryKey: ["profile", user.id] }));
  }, [user, profile, xp, level, progress.completedChapters, queryClient]);

  useEffect(() => {
    if (profile && profile.level < level) {
      toast.success(`Level ${level} unlocked — ${levelTitle(level)}!`);
    }
  }, [profile, level]);

  if (!user || isLoading) {
    return (
      <div className="grid min-h-[50vh] place-items-center text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  const needsDetails = !profile?.gender || !profile?.country;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {needsDetails && <CompleteProfile userId={user.id} profileName={profile?.display_name ?? ""} />}

      <section className="card-elevated relative overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-0 bg-hero opacity-70" aria-hidden />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative shrink-0">
            <span className="absolute inset-0 animate-pulse rounded-full bg-primary/25 blur-xl" aria-hidden />
            <img
              src={avatarFor(profile?.gender)}
              alt={`Animated avatar for ${profile?.display_name ?? "learner"}`}
              width={512}
              height={512}
              className="relative size-28 rounded-full border border-primary/40 bg-surface-2 object-cover transition-transform duration-500 hover:scale-105 sm:size-32"
            />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full border border-primary/50 bg-background px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-primary">
              Lv {level}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
              {levelTitle(level)}
            </p>
            <h1 className="mt-1 truncate text-2xl font-semibold sm:text-3xl">
              Welcome back, {profile?.display_name ?? "learner"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {profile?.country ?? "—"} ·{" "}
              {genderOptions.find((g) => g.value === profile?.gender)?.label ?? "Gender not set"}
            </p>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono">{xp} XP</span>
                <span>{toNext} XP to level {level + 1}</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${Math.max(pct, 3)}%` }}
                />
              </div>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                {intoLevel}/300 XP this level
              </p>
            </div>
          </div>
          <dl className="grid shrink-0 grid-cols-3 gap-4 sm:grid-cols-1">
            {[
              { icon: Check, label: "Phases", value: `${progress.completedChapters.length}/${chapters.length}` },
              { icon: Star, label: "Stars", value: progress.available },
              { icon: Trophy, label: "Projects", value: progress.projectsSubmitted.length },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <s.icon className="size-4 text-primary" />
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    {s.label}
                  </dt>
                  <dd className="font-display text-lg font-semibold tabular-nums">{s.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Your progress roadmap</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Every phase you complete lights up the entangled path and adds XP toward your next level.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-3 py-1">
              <Star className="size-4 text-star" />
              {progress.available} stars available
            </span>
            <Link
              to="/tests"
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-primary transition-colors hover:bg-primary/20"
            >
              <Trophy className="size-4" />
              Take graded tests
            </Link>
          </div>
        </div>

        <QuantumRoadmap />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Check, label: "Phases", value: `${progress.completedChapters.length}/${chapters.length}` },
            { icon: Star, label: "Stars", value: progress.available },
            { icon: Trophy, label: "Projects", value: progress.projectsSubmitted.length },
            { icon: CircleDashed, label: "Tests passed", value: Object.keys(progress.testStars).length },
          ].map((s) => (
            <div key={s.label} className="card-elevated flex items-center gap-3 p-4">
              <div className="grid size-10 place-items-center rounded-full border border-border bg-surface-2">
                <s.icon className="size-5 text-primary" />
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                  {s.label}
                </dt>
                <dd className="font-display text-xl font-semibold tabular-nums">{s.value}</dd>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function CompleteProfile({ userId, profileName }: { userId: string; profileName: string }) {
  const queryClient = useQueryClient();
  const [displayName, setDisplayName] = useState(profileName);
  const [gender, setGender] = useState<Gender | "">("");
  const [country, setCountry] = useState("");
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!gender || !country) {
      toast.error("Please choose your gender and country");
      return;
    }
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim().slice(0, 60) || null,
        gender,
        country,
        onboarded: true,
      })
      .eq("id", userId);
    setBusy(false);
    if (error) {
      toast.error("Could not save your details", { description: error.message });
      return;
    }
    toast.success("Profile updated — your avatar is ready");
    queryClient.invalidateQueries({ queryKey: ["profile", userId] });
  }

  return (
    <form onSubmit={save} className="card-elevated mb-8 p-6">
      <h2 className="text-lg font-semibold">Finish setting up your profile</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        We use your gender to pick a matching animated avatar, and your country for regional cohorts.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
            Display name
          </span>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={60}
            className="input-field"
            placeholder="Ada Q."
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
            Gender
          </span>
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
        </label>
        <label className="block">
          <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
            Country
          </span>
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
        </label>
      </div>
      <Button type="submit" className="mt-4" disabled={busy}>
        {busy && <Loader2 className="size-4 animate-spin" />}Save details
      </Button>
    </form>
  );
}
