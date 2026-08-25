import { Link, useNavigate } from "@tanstack/react-router";
import { Atom, LogOut, Menu, Star } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { avatarFor, useProfile, useSession } from "@/lib/auth";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

function AccountMenu() {
  const { session, user, loading } = useSession();
  const { data: profile } = useProfile(user?.id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (loading) return <span className="size-9" />;

  if (!session) {
    return (
      <Link
        to="/auth"
        className="rounded-md border border-primary/50 bg-primary/12 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
      >
        Log in
      </Link>
    );
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        to="/dashboard"
        className="flex items-center gap-2 rounded-full border border-border bg-surface-2 py-1 pl-1 pr-3 text-sm transition-colors hover:border-primary/60"
      >
        <img
          src={avatarFor(profile?.gender)}
          alt="Your avatar"
          loading="lazy"
          width={512}
          height={512}
          className="size-7 rounded-full border border-primary/40 object-cover"
        />
        <span className="hidden max-w-24 truncate sm:block">
          {profile?.display_name ?? "Dashboard"}
        </span>
      </Link>
      <button
        onClick={signOut}
        aria-label="Sign out"
        className="grid size-9 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
      >
        <LogOut className="size-4" />
      </button>
    </div>
  );
}

const links = [
  { to: "/", label: "Home" },
  { to: "/syllabus", label: "Syllabus" },
  { to: "/simulator", label: "Circuit Lab" },
  { to: "/projects", label: "Projects" },
  { to: "/techniques", label: "Techniques" },
  { to: "/applications", label: "Applications" },
  { to: "/rewards", label: "Rewards" },
  { to: "/stack", label: "Tech Stack" },
] as const;

export function StarCounter() {
  const { available, stars } = useProgress();
  return (
    <Link
      to="/rewards"
      className="group flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1.5 text-sm transition-colors hover:border-primary/60"
      title={`${available} stars available of ${stars} earned`}
    >
      <Star className="size-4 fill-star text-star transition-transform group-hover:scale-110" />
      <span className="font-mono font-medium tabular-nums">{available}</span>
      <span className="text-muted-foreground">stars</span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-lg bg-primary/15 text-primary glow-ring">
            <Atom className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-sm font-semibold tracking-tight">
              Quantum Learning Algorithms
            </span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              12-chapter QML platform
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-primary/12 data-[status=active]:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <StarCounter />
          <AccountMenu />
          <button
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground lg:hidden"
          >
            <Menu className="size-4" />
          </button>
        </div>
      </div>

      <div className={cn("border-t border-border lg:hidden", open ? "block" : "hidden")}>
        <nav className="mx-auto grid max-w-7xl grid-cols-2 gap-1 px-4 py-3">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary data-[status=active]:bg-primary/12 data-[status=active]:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/70 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          Quantum Learning Algorithms — an interactive curriculum for Qiskit and PennyLane
          practitioners.
        </p>
        <p className="font-mono text-xs">
          Progress and stars are stored locally in your browser.
        </p>
      </div>
    </footer>
  );
}
