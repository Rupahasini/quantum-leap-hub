import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Lightbulb, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Assignment } from "@/components/Assignment";
import { CodeBlock } from "@/components/CodeBlock";
import { Quiz } from "@/components/Quiz";
import { Button } from "@/components/ui/button";
import { assignmentByChapter, tests } from "@/lib/assessments";
import { chapters } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/syllabus/$chapterId")({
  loader: ({ params }) => {
    const chapter = chapters.find((c) => c.id === params.chapterId);
    if (!chapter) throw notFound();
    return { chapter };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Chapter not found" }, { name: "robots", content: "noindex" }],
      };
    }
    const { chapter } = loaderData;
    const title = `Ch ${chapter.index}: ${chapter.title} — Quantum Learning Algorithms`;
    return {
      meta: [
        { title },
        { name: "description", content: chapter.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: chapter.summary },
      ],
    };
  },
  component: ChapterPage,
});

function ChapterPage() {
  const { chapter } = Route.useLoaderData();
  const { completedChapters, katasDone, actions } = useProgress();
  const [showHint, setShowHint] = useState(false);
  const assignment = assignmentByChapter(chapter.id);
  const phaseTest = tests.find((t) => t.scope === chapter.track);

  const done = completedChapters.includes(chapter.id);
  const kataDone = katasDone.includes(chapter.kata.id);
  const prev = chapters.find((c) => c.index === chapter.index - 1);
  const next = chapters.find((c) => c.index === chapter.index + 1);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        to="/syllabus"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" /> Syllabus
      </Link>

      <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-primary">
        Chapter {String(chapter.index).padStart(2, "0")} · {chapter.track} · {chapter.duration}
      </p>
      <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{chapter.title}</h1>
      <p className="mt-4 text-muted-foreground">{chapter.summary}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button
          variant={done ? "secondary" : "default"}
          onClick={() => {
            const nowDone = actions.toggleChapter(chapter.id);
            toast[nowDone ? "success" : "info"](
              nowDone ? "Chapter marked complete" : "Chapter reopened",
              { description: nowDone ? "The next chapter is unlocked." : undefined },
            );
          }}
        >
          {done ? <CheckCircle2 className="size-4" /> : <Circle className="size-4" />}
          {done ? "Core content complete" : "Mark core content complete"}
        </Button>
        <Button asChild variant="outline">
          <Link to="/simulator">Open circuit lab</Link>
        </Button>
      </div>

      <section className="mt-12 grid gap-4 sm:grid-cols-2">
        <div className="panel p-5">
          <h2 className="text-sm font-semibold">Learning objectives</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {chapter.objectives.map((o) => (
              <li key={o} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                {o}
              </li>
            ))}
          </ul>
        </div>
        <div className="panel p-5">
          <h2 className="text-sm font-semibold">Key concepts</h2>
          <dl className="mt-3 space-y-3 text-sm">
            {chapter.concepts.map((c) => (
              <div key={c.term}>
                <dt className="font-mono text-xs text-primary">{c.term}</dt>
                <dd className="text-muted-foreground">{c.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Worked code</h2>
        <CodeBlock label={chapter.code.label} code={chapter.code.snippet} />
      </section>

      <section className="mt-8">
        <Quiz quizId={chapter.id} questions={chapter.quiz} />
      </section>

      <section className="panel mt-8 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold">{chapter.kata.title}</h2>
          <span className="flex items-center gap-1.5 rounded-full bg-star/15 px-3 py-1 text-xs font-medium text-star">
            <Star className="size-3.5 fill-star" /> {chapter.kata.stars} stars
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{chapter.kata.task}</p>
        {showHint && (
          <p className="mt-3 animate-in fade-in slide-in-from-top-1 rounded-lg bg-secondary p-3 text-sm">
            <Lightbulb className="mr-2 inline size-4 text-star" />
            {chapter.kata.hint}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={kataDone ? "secondary" : "default"}
            disabled={kataDone}
            onClick={() => {
              if (actions.awardKata(chapter.kata.id, chapter.kata.stars)) {
                toast.success(`Kata mastered — +${chapter.kata.stars} stars`);
              }
            }}
          >
            {kataDone ? "Kata mastered" : "Mark kata mastered"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setShowHint((v) => !v)}>
            {showHint ? "Hide hint" : "Show hint"}
          </Button>
        </div>
      </section>

      <nav className="mt-12 flex items-center justify-between gap-3 border-t border-border pt-6">
        {prev ? (
          <Link
            to="/syllabus/$chapterId"
            params={{ chapterId: prev.id }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="size-4" /> {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            to="/syllabus/$chapterId"
            params={{ chapterId: next.id }}
            className="inline-flex items-center gap-2 text-right text-sm text-muted-foreground hover:text-primary"
          >
            {next.title} <ArrowRight className="size-4" />
          </Link>
        )}
      </nav>
    </div>
  );
}
