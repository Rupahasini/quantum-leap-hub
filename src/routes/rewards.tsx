import { createFileRoute } from "@tanstack/react-router";
import { Lock, Sparkles, Star, Unlock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { chapters, perks, projects } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { title: "Star Rewards — Unlock Premium QML Extras" },
      {
        name: "description",
        content:
          "Earn stars from quizzes, katas and project submissions, then redeem them for industry case studies, cloud hardware runs, badges and guest deep-dive lectures.",
      },
      { property: "og:title", content: "Star Rewards — Unlock Premium QML Extras" },
      {
        property: "og:description",
        content: "Stars never gate progression — they buy case studies, hardware runs, badges and deep dives.",
      },
    ],
  }),
  component: Rewards,
});

function Rewards() {
  const {
    available,
    stars,
    spent,
    quizzesPassed,
    katasDone,
    projectsSubmitted,
    unlockedPerks,
    actions,
  } = useProgress();

  const categories = ["Case Study", "Hardware", "Badge", "Deep Dive"] as const;

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold sm:text-4xl">Star rewards</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Stars never unlock the next chapter — progression depends purely on completing core content.
        Stars buy premium extras instead.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-4">
        {[
          { label: "Available", value: available, accent: true },
          { label: "Earned", value: stars },
          { label: "Spent", value: spent },
          { label: "Unlocked", value: unlockedPerks.length },
        ].map((s) => (
          <div key={s.label} className={cn("panel p-4", s.accent && "border-primary/50 bg-primary/8")}>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-1 font-display text-3xl font-semibold tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="panel mt-4 grid gap-3 p-5 sm:grid-cols-3">
        {[
          { label: "Quizzes cleared", value: `${quizzesPassed.length}/${chapters.length}` },
          { label: "Katas mastered", value: `${katasDone.length}/${chapters.length}` },
          { label: "Projects submitted", value: `${projectsSubmitted.length}/${projects.length}` },
        ].map((row) => (
          <p key={row.label} className="text-sm">
            <span className="text-muted-foreground">{row.label}: </span>
            <span className="font-mono">{row.value}</span>
          </p>
        ))}
      </div>

      <div className="mt-12 space-y-10">
        {categories.map((cat) => (
          <section key={cat}>
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{cat}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {perks
                .filter((p) => p.category === cat)
                .map((p) => {
                  const owned = unlockedPerks.includes(p.id);
                  const affordable = available >= p.cost;
                  return (
                    <article
                      key={p.id}
                      className={cn(
                        "card-elevated p-5 transition-all",
                        owned && "border-success/50 bg-success/6",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base font-semibold">{p.title}</h3>
                        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-star/15 px-2.5 py-1 text-xs font-medium text-star">
                          <Star className="size-3.5 fill-star" /> {p.cost}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                      <Button
                        size="sm"
                        className="mt-4"
                        variant={owned ? "secondary" : affordable ? "default" : "outline"}
                        disabled={owned}
                        onClick={() => {
                          const result = actions.unlockPerk(p.id, p.cost);
                          if (result === "unlocked") {
                            toast.success("Unlocked", { description: p.title });
                          } else if (result === "insufficient") {
                            toast.error(`Need ${p.cost - available} more stars`, {
                              description: "Clear a quiz or kata to top up.",
                            });
                          }
                        }}
                      >
                        {owned ? (
                          <>
                            <Sparkles className="size-3.5" /> Unlocked
                          </>
                        ) : affordable ? (
                          <>
                            <Unlock className="size-3.5" /> Unlock for {p.cost}
                          </>
                        ) : (
                          <>
                            <Lock className="size-3.5" /> {p.cost - available} more stars
                          </>
                        )}
                      </Button>
                    </article>
                  );
                })}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-14 border-t border-border pt-6">
        <Button variant="ghost" size="sm" onClick={() => actions.reset()}>
          Reset all local progress
        </Button>
      </div>
    </div>
  );
}
