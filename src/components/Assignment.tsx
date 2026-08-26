import { CheckCircle2, ClipboardList, Eye, EyeOff, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CodeBlock } from "@/components/CodeBlock";
import { Button } from "@/components/ui/button";
import type { Assignment as AssignmentType } from "@/lib/assessments";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export function Assignment({ assignment }: { assignment: AssignmentType }) {
  const { assignmentsDone, actions } = useProgress();
  const submitted = assignmentsDone.includes(assignment.id);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [showSolution, setShowSolution] = useState(false);

  const doneCount = assignment.tasks.filter((_, i) => checked[i]).length;
  const allDone = doneCount === assignment.tasks.length;

  return (
    <section className="panel p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
            <ClipboardList className="size-3.5" /> Chapter assignment
          </p>
          <h2 className="mt-1.5 text-base font-semibold">{assignment.title}</h2>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-star/15 px-3 py-1 text-xs font-medium text-star">
          <Star className="size-3.5 fill-star" /> {assignment.stars} stars
        </span>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">{assignment.brief}</p>

      <ul className="mt-4 space-y-2">
        {assignment.tasks.map((task, i) => (
          <li key={task}>
            <button
              onClick={() => setChecked((c) => ({ ...c, [i]: !c[i] }))}
              className={cn(
                "flex w-full items-start gap-3 rounded-lg border border-border bg-background/40 px-3.5 py-2.5 text-left text-sm transition-all duration-150 hover:border-primary/60 hover:bg-primary/5 active:scale-[0.995]",
                checked[i] && "border-success/60 bg-success/10",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border",
                  checked[i] ? "border-success bg-success/25 text-success" : "border-border",
                )}
              >
                {checked[i] && <CheckCircle2 className="size-3" />}
              </span>
              <span className={checked[i] ? "text-success" : undefined}>{task}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-5 space-y-4">
        <CodeBlock label="Starter code" code={assignment.starter} />
        {showSolution && (
          <div className="animate-in fade-in slide-in-from-top-1">
            <CodeBlock label="Reference solution" code={assignment.solution} />
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant={submitted ? "secondary" : "default"}
          disabled={submitted || !allDone}
          onClick={() => {
            if (actions.completeAssignment(assignment.id, assignment.stars)) {
              toast.success(`Assignment submitted — +${assignment.stars} stars`, {
                description: "Take the phase test once the whole track is done.",
              });
            }
          }}
        >
          {submitted
            ? "Assignment submitted"
            : allDone
              ? "Submit assignment"
              : `Complete all tasks (${doneCount}/${assignment.tasks.length})`}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setShowSolution((v) => !v)}>
          {showSolution ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
          {showSolution ? "Hide solution" : "Show solution"}
        </Button>
      </div>
    </section>
  );
}
