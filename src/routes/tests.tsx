import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, ClipboardList, Lock, Star } from "lucide-react";
import { TEST_MAX_STARS, tests } from "@/lib/assessments";
import { chapters } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/tests")({
  head: () => ({
    meta: [
      { title: "Graded phase tests & final exam — Quantum Learning Algorithms" },
      {
        name: "description",
        content:
          "Take graded MCQ, algorithm and coding tests after each phase of the quantum machine learning curriculum and earn up to 5 stars per test.",
      },
      { property: "og:title", content: "Graded QML phase tests" },
      {
        property: "og:description",
        content: "Phase tests and a final exam across all 12 chapters — stars scale with your score.",
      },
    ],
  }),
  component: TestsPage,
});

function TestsPage() {
  const { completedChapters, testStars } = useProgress();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold sm:text-4xl">Graded tests</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Each phase closes with a graded test mixing MCQ, algorithm-design and coding questions. Stars
        scale with your score — a maximum of {TEST_MAX_STARS} per test — and your best attempt is kept.
      </p>

      <ul className="mt-10 space-y-4">
        {tests.map((test) => {
          const required = test.chapterIds;
          const done = required.filter((id) => completedChapters.includes(id)).length;
          const unlocked = done === required.length;
          const best = testStars[test.id] ?? 0;
          return (
            <li key={test.id}>
              {unlocked ? (
                <Link
                  to="/tests/$testId"
                  params={{ testId: test.id }}
                  className="card-elevated flex flex-wrap items-start gap-4 p-5 transition-colors hover:border-primary/60"
                >
                  <TestBody test={test} best={best} done={done} total={required.length} unlocked />
                </Link>
              ) : (
                <div className="card-elevated flex flex-wrap items-start gap-4 p-5 opacity-70">
                  <TestBody test={test} best={best} done={done} total={required.length} unlocked={false} />
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <p className="mt-8 text-sm text-muted-foreground">
        Tests unlock once you mark the matching chapters complete in the{" "}
        <Link to="/syllabus" className="text-primary hover:underline">
          syllabus
        </Link>{" "}
        ({completedChapters.length}/{chapters.length} chapters done).
      </p>
    </div>
  );
}

function TestBody({
  test,
  best,
  done,
  total,
  unlocked,
}: {
  test: (typeof tests)[number];
  best: number;
  done: number;
  total: number;
  unlocked: boolean;
}) {
  return (
    <>
      <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full bg-primary/12 text-primary">
        {unlocked ? <ClipboardList className="size-5" /> : <Lock className="size-4" />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{test.scope}</span>
          <h2 className="text-base font-semibold">{test.title}</h2>
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground">{test.blurb}</p>
        <p className="mt-2 font-mono text-[11px] text-muted-foreground">
          {test.questions.length} questions · chapters completed {done}/{total}
        </p>
      </div>
      <span className="flex items-center gap-1.5 rounded-full bg-star/15 px-3 py-1 text-xs font-medium text-star">
        {best > 0 ? <Award className="size-3.5" /> : <Star className="size-3.5 fill-star" />}
        {best}/{TEST_MAX_STARS}
      </span>
    </>
  );
}
