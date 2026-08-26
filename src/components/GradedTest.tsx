import { Award, Check, RotateCcw, Star, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CodeBlock } from "@/components/CodeBlock";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TEST_MAX_STARS, starsForScore, type Test, type TestQuestionKind } from "@/lib/assessments";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

const KIND_LABEL: Record<TestQuestionKind, string> = {
  mcq: "MCQ",
  algorithm: "Algorithm",
  coding: "Coding",
};

export function GradedTest({ test }: { test: Test }) {
  const { testStars, actions } = useProgress();
  const best = testStars[test.id] ?? 0;
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const total = test.questions.length;
  const answeredCount = test.questions.filter((q) => answers[q.id] !== undefined).length;
  const correct = test.questions.filter((q) => answers[q.id] === q.answer).length;
  const earned = submitted ? starsForScore(correct, total) : 0;

  function submit() {
    setSubmitted(true);
    const stars = starsForScore(correct, total);
    const delta = actions.awardTest(test.id, stars);
    if (delta > 0) {
      toast.success(`${stars}/${TEST_MAX_STARS} stars earned`, {
        description: `+${delta} stars added — score ${correct}/${total}.`,
      });
    } else {
      toast.info(`Score ${correct}/${total} — ${stars}/${TEST_MAX_STARS} stars`, {
        description: best > 0 ? `Your best of ${best} stars is kept.` : "Retake to earn stars.",
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
              {test.scope} · graded test
            </p>
            <h1 className="mt-1.5 text-2xl font-semibold">{test.title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{test.blurb}</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-star/15 px-3 py-1 text-xs font-medium text-star">
            <Star className="size-3.5 fill-star" /> best {best}/{TEST_MAX_STARS}
          </span>
        </div>
        <Progress value={(answeredCount / total) * 100} className="mt-4" />
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          {answeredCount}/{total} answered
        </p>
      </div>

      <ol className="space-y-5">
        {test.questions.map((q, qi) => (
          <li key={q.id} className="panel p-5">
            <div className="mb-2 flex items-center gap-2">
              <span className="font-mono text-xs text-primary">
                Q{String(qi + 1).padStart(2, "0")}
              </span>
              <span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {KIND_LABEL[q.kind]}
              </span>
            </div>
            <p className="text-sm font-medium">{q.prompt}</p>
            {q.code && (
              <div className="mt-3">
                <CodeBlock label="Snippet" code={q.code} />
              </div>
            )}
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {q.options.map((opt, oi) => {
                const chosen = answers[q.id] === oi;
                const right = oi === q.answer;
                return (
                  <button
                    key={opt}
                    disabled={submitted}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 px-3.5 py-2.5 text-left text-sm transition-all duration-150 hover:border-primary/60 hover:bg-primary/5 active:scale-[0.99]",
                      !submitted && chosen && "border-primary bg-primary/10 text-primary",
                      submitted && chosen && right && "border-success/70 bg-success/12 text-success",
                      submitted &&
                        chosen &&
                        !right &&
                        "border-destructive/70 bg-destructive/12 text-destructive",
                      submitted && !chosen && right && "border-success/40",
                    )}
                  >
                    <span>{opt}</span>
                    {submitted && chosen && (right ? <Check className="size-4" /> : <X className="size-4" />)}
                  </button>
                );
              })}
            </div>
            {submitted && (
              <p className="mt-2 text-xs text-muted-foreground">{q.explanation}</p>
            )}
          </li>
        ))}
      </ol>

      <div className="panel flex flex-wrap items-center justify-between gap-3 p-5">
        {submitted ? (
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-star/15 text-star">
              <Award className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">
                {correct}/{total} correct · {earned}/{TEST_MAX_STARS} stars
              </p>
              <p className="text-xs text-muted-foreground">
                {earned === TEST_MAX_STARS
                  ? "Perfect run — the full reward is yours."
                  : "Retake the test to raise your best score."}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Answer every question, then submit — stars scale with your score (max {TEST_MAX_STARS}).
          </p>
        )}
        <div className="flex gap-2">
          {submitted ? (
            <Button
              variant="outline"
              onClick={() => {
                setAnswers({});
                setSubmitted(false);
              }}
            >
              <RotateCcw className="size-4" /> Retake
            </Button>
          ) : (
            <Button disabled={answeredCount < total} onClick={submit}>
              Submit test
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
