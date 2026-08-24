import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { chapters } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/syllabus")({
  head: () => ({
    meta: [
      { title: "12-Chapter QML Syllabus — Quantum Learning Algorithms" },
      {
        name: "description",
        content:
          "Foundations, quantum computing and quantum machine learning across 12 chapters: Hermitian matrices, Bloch sphere, variational algorithms, QNNs and QGANs.",
      },
      { property: "og:title", content: "12-Chapter QML Syllabus" },
      {
        property: "og:description",
        content: "The full path from linear algebra to QGANs, with quizzes and katas in every chapter.",
      },
    ],
  }),
  component: Syllabus,
});

const tracks = ["Foundations", "Quantum Computing", "Quantum Machine Learning"] as const;

function Syllabus() {
  const { completedChapters } = useProgress();
  const pct = Math.round((completedChapters.length / chapters.length) * 100);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold sm:text-4xl">The 12-chapter syllabus</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Chapters unlock by completing the previous chapter's core content. Stars are earned along the
        way but only ever spent on premium extras.
      </p>

      <div className="panel mt-8 p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Course progress</span>
          <span className="font-mono text-muted-foreground">
            {completedChapters.length}/{chapters.length} chapters · {pct}%
          </span>
        </div>
        <Progress value={pct} className="mt-3" />
      </div>

      <div className="mt-12 space-y-12">
        {tracks.map((track) => (
          <section key={track}>
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{track}</h2>
            <ul className="mt-4 space-y-3">
              {chapters
                .filter((c) => c.track === track)
                .map((ch) => {
                  const done = completedChapters.includes(ch.id);
                  return (
                    <li key={ch.id}>
                      <Link
                        to="/syllabus/$chapterId"
                        params={{ chapterId: ch.id }}
                        className="card-elevated flex gap-4 p-5 transition-colors hover:border-primary/60"
                      >
                        <span className="mt-0.5">
                          {done ? (
                            <CheckCircle2 className="size-5 text-success" />
                          ) : (
                            <Circle className="size-5 text-muted-foreground" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="font-mono text-xs text-primary">
                              CH {String(ch.index).padStart(2, "0")}
                            </span>
                            <h3 className="text-base font-semibold">{ch.title}</h3>
                            <span className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                              <Clock className="size-3" /> {ch.duration}
                            </span>
                          </div>
                          <p className="mt-1.5 text-sm text-muted-foreground">{ch.summary}</p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
