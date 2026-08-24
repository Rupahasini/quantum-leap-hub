import { createFileRoute, Link } from "@tanstack/react-router";
import { Atom, CircuitBoard, FlaskConical, Sparkles, Star, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { applications, chapters, projects, techniques } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Quantum Learning Algorithms — Interactive QML Curriculum" },
      {
        name: "description",
        content:
          "A 12-chapter interactive platform for quantum machine learning: circuit simulator, hands-on Qiskit and PennyLane projects, and a star reward system.",
      },
      { property: "og:title", content: "Quantum Learning Algorithms — Interactive QML Curriculum" },
      {
        property: "og:description",
        content:
          "Learn quantum machine learning from Hermitian matrices to QGANs with a browser circuit lab and hands-on projects.",
      },
    ],
  }),
  component: Home,
});

const features = [
  {
    icon: CircuitBoard,
    title: "Interactive Circuit Lab",
    body: "Drag gates onto a multi-qubit grid and watch the state vector, probabilities and Bloch vectors update instantly.",
    to: "/simulator" as const,
    cta: "Open the lab",
  },
  {
    icon: FlaskConical,
    title: "Hands-on Projects",
    body: "Step-by-step builds: quantum RNG, a QSVM with a measured kernel, and hybrid classical–quantum transfer learning.",
    to: "/projects" as const,
    cta: "Browse projects",
  },
  {
    icon: Target,
    title: "Technique Directory",
    body: "Amplitude encoding, parameter-shift gradients, fidelity kernels, ZNE — with guidance on when each one pays off.",
    to: "/techniques" as const,
    cta: "See techniques",
  },
  {
    icon: Star,
    title: "Star Rewards",
    body: "Earn stars from quizzes, katas and project submissions, then spend them on premium extras — never on progression.",
    to: "/rewards" as const,
    cta: "View rewards",
  },
];

function Home() {
  const { available, completedChapters } = useProgress();

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border/70">
        <div className="absolute inset-0 bg-hero" aria-hidden />
        <div className="absolute inset-0 bg-grid opacity-25" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
            <Atom className="size-3.5" /> 12 chapters · 3 tracks
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] sm:text-6xl">
            Learn <span className="text-gradient">quantum learning algorithms</span> by building
            them.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            From Hermitian matrices and the Bloch sphere to variational algorithms, quantum neural
            networks and QGANs — with a browser circuit simulator, Qiskit and PennyLane projects,
            and instant feedback on every answer.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/syllabus">Start Chapter 1</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/simulator">Try the circuit lab</Link>
            </Button>
          </div>
          <dl className="mt-14 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { label: "Chapters", value: chapters.length },
              { label: "Projects", value: projects.length },
              { label: "Techniques", value: techniques.length },
              { label: "Your stars", value: available },
            ].map((s) => (
              <div key={s.label}>
                <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {s.label}
                </dt>
                <dd className="mt-1 font-display text-3xl font-semibold tabular-nums">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.title} className="card-elevated p-6 transition-colors hover:border-primary/50">
              <span className="grid size-10 place-items-center rounded-lg bg-primary/12 text-primary">
                <f.icon className="size-5" />
              </span>
              <h2 className="mt-4 text-lg font-semibold">{f.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              <Link
                to={f.to}
                className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
              >
                {f.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">The syllabus</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Progression depends only on completing a chapter's core content — {completedChapters.length}{" "}
              of {chapters.length} done.
            </p>
          </div>
          <Link to="/syllabus" className="text-sm font-medium text-primary hover:underline">
            Full syllabus →
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {chapters.map((ch) => (
            <Link
              key={ch.id}
              to="/syllabus/$chapterId"
              params={{ chapterId: ch.id }}
              className="panel group p-4 transition-all hover:border-primary/60 hover:bg-primary/5"
            >
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                <span className="text-primary">
                  {String(ch.index).padStart(2, "0")}
                </span>
                {ch.track}
                {completedChapters.includes(ch.id) && (
                  <Sparkles className="ml-auto size-3.5 text-success" />
                )}
              </div>
              <h3 className="mt-2 text-sm font-semibold group-hover:text-primary">{ch.title}</h3>
              <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{ch.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <h2 className="text-2xl font-semibold">Where this gets used</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {applications.map((a) => (
            <Link
              key={a.id}
              to="/applications"
              className="panel p-4 transition-colors hover:border-primary/50"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-primary">
                {a.industry}
              </p>
              <p className="mt-2 text-sm font-medium">{a.headline}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
