import { Check, RotateCcw, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { QuizQuestion } from "@/lib/curriculum";
import { QUIZ_STARS } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export function Quiz({ quizId, questions }: { quizId: string; questions: QuizQuestion[] }) {
  const { quizzesPassed, actions } = useProgress();
  const passed = quizzesPassed.includes(quizId);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const correctCount = questions.filter((q) => answers[q.id] === q.answer).length;
  const allCorrect = correctCount === questions.length;

  function pick(q: QuizQuestion, index: number) {
    if (revealed[q.id] && answers[q.id] === q.answer) return;
    setAnswers((a) => ({ ...a, [q.id]: index }));
    setRevealed((r) => ({ ...r, [q.id]: true }));

    const isRight = index === q.answer;
    const nextCorrect = questions.filter((qq) =>
      qq.id === q.id ? isRight : answers[qq.id] === qq.answer,
    ).length;

    if (isRight && nextCorrect === questions.length && !passed) {
      if (actions.awardQuiz(quizId, QUIZ_STARS)) {
        toast.success(`Quiz cleared — +${QUIZ_STARS} stars`, {
          description: "Spend stars on premium extras in Rewards.",
        });
      }
    } else {
      toast[isRight ? "success" : "error"](isRight ? "Correct" : "Not quite", {
        description: q.explanation,
      });
    }
  }

  return (
    <div className="panel p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">Checkpoint quiz</h3>
          <p className="text-sm text-muted-foreground">
            Clear every question to earn {QUIZ_STARS} stars.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-secondary px-3 py-1 font-mono text-xs">
            {correctCount}/{questions.length}
          </span>
          {(passed || allCorrect) && (
            <span className="flex items-center gap-1 rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success">
              <Sparkles className="size-3.5" /> {passed ? "Stars awarded" : "Complete"}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setAnswers({});
              setRevealed({});
            }}
          >
            <RotateCcw className="size-3.5" /> Retry
          </Button>
        </div>
      </div>

      <ol className="space-y-5">
        {questions.map((q, qi) => (
          <li key={q.id}>
            <p className="mb-2.5 text-sm font-medium">
              <span className="mr-2 font-mono text-xs text-primary">
                {String(qi + 1).padStart(2, "0")}
              </span>
              {q.prompt}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {q.options.map((opt, oi) => {
                const chosen = answers[q.id] === oi;
                const show = revealed[q.id];
                const right = oi === q.answer;
                return (
                  <button
                    key={opt}
                    onClick={() => pick(q, oi)}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 px-3.5 py-2.5 text-left text-sm transition-all duration-150 hover:border-primary/60 hover:bg-primary/5 active:scale-[0.99]",
                      show && chosen && right && "border-success/70 bg-success/12 text-success",
                      show &&
                        chosen &&
                        !right &&
                        "border-destructive/70 bg-destructive/12 text-destructive",
                      show && !chosen && right && "border-success/40",
                    )}
                  >
                    <span>{opt}</span>
                    {show && chosen && (right ? <Check className="size-4" /> : <X className="size-4" />)}
                  </button>
                );
              })}
            </div>
            {revealed[q.id] && (
              <p className="mt-2 animate-in fade-in slide-in-from-top-1 text-xs text-muted-foreground">
                {q.explanation}
              </p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
