import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock, Star } from "lucide-react";
import { toast } from "sonner";
import { CodeBlock } from "@/components/CodeBlock";
import { Button } from "@/components/ui/button";
import { projects } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Hands-on QML Projects — QSVM, QRNG, Hybrid Transfer Learning" },
      {
        name: "description",
        content:
          "Step-by-step guides for building a Quantum Support Vector Machine, a Quantum Random Number Generator and hybrid classical-quantum transfer learning models.",
      },
      { property: "og:title", content: "Hands-on QML Projects" },
      {
        property: "og:description",
        content: "Build a QSVM, a quantum RNG and a hybrid transfer-learning model with Qiskit and PennyLane.",
      },
    ],
  }),
  component: Projects,
});

function Projects() {
  const { projectsSubmitted, actions } = useProgress();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold sm:text-4xl">Hands-on projects</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Each project ships with a build order, starter code and a submission that awards stars for
        premium extras.
      </p>

      <div className="mt-10 space-y-8">
        {projects.map((p) => {
          const submitted = projectsSubmitted.includes(p.id);
          return (
            <article key={p.id} className="card-elevated p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-primary/12 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-primary">
                  {p.level}
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                  <Clock className="size-3" /> {p.duration}
                </span>
                <span className="ml-auto flex items-center gap-1.5 rounded-full bg-star/15 px-3 py-1 text-xs font-medium text-star">
                  <Star className="size-3.5 fill-star" /> {p.stars} stars
                </span>
              </div>

              <h2 className="mt-4 text-xl font-semibold">{p.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.summary}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-md border border-border bg-secondary px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <ol className="mt-6 space-y-3">
                {p.steps.map((s, i) => (
                  <li key={s.title} className="flex gap-3 rounded-lg bg-background/40 p-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-md bg-primary/15 font-mono text-[11px] text-primary">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{s.title}</p>
                      <p className="text-sm text-muted-foreground">{s.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-5">
                <CodeBlock label={`${p.id} · starter`} code={p.starter} />
              </div>

              <Button
                className="mt-5"
                variant={submitted ? "secondary" : "default"}
                disabled={submitted}
                onClick={() => {
                  if (actions.submitProject(p.id, p.stars)) {
                    toast.success(`Project submitted — +${p.stars} stars`, {
                      description: "Redeem stars for hardware runs and deep dives.",
                    });
                  }
                }}
              >
                {submitted ? <CheckCircle2 className="size-4" /> : <Star className="size-4" />}
                {submitted ? "Code submitted" : "Submit project code"}
              </Button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
