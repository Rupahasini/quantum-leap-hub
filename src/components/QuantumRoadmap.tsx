import { Link } from "@tanstack/react-router";
import { Atom, Check, Lock, Star } from "lucide-react";
import { chapters } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";

const STEP = 132; // vertical spacing per node
const AMP = 30; // horizontal swing in % of container width

/**
 * Quantum-styled winding progress path: chapters orbit along an entangled
 * worldline. Completed nodes glow, the active node pulses, later nodes are dim.
 */
export function QuantumRoadmap() {
  const { completedChapters } = useProgress();
  const currentIndex = chapters.findIndex((c) => !completedChapters.includes(c.id));
  const height = chapters.length * STEP + 60;

  const points = chapters.map((_, i) => ({
    x: 50 + Math.sin((i / (chapters.length - 1)) * Math.PI * 3.2) * AMP,
    y: 40 + i * STEP,
  }));

  const path = points
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = points[i - 1]!;
      const midY = (prev.y + p.y) / 2;
      return `C ${prev.x} ${midY}, ${p.x} ${midY}, ${p.x} ${p.y}`;
    })
    .join(" ");

  const doneCount = currentIndex === -1 ? chapters.length : currentIndex;
  const progressRatio = doneCount / chapters.length;

  return (
    <div className="card-elevated relative overflow-hidden px-2 py-6 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.35]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-hero opacity-60" aria-hidden />

      <div className="relative" style={{ height }}>
        <svg
          className="absolute inset-0 size-full"
          viewBox={`0 0 100 ${height}`}
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="qr-line" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary-glow)" />
              <stop offset="100%" stopColor="var(--primary)" />
            </linearGradient>
          </defs>
          <path
            d={path}
            fill="none"
            stroke="var(--border)"
            strokeWidth="0.9"
            strokeDasharray="3 2.5"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={path}
            fill="none"
            stroke="url(#qr-line)"
            strokeWidth="1.6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={1 - progressRatio}
            style={{ transition: "stroke-dashoffset 900ms ease" }}
          />
        </svg>

        {chapters.map((ch, i) => {
          const p = points[i]!;
          const complete = completedChapters.includes(ch.id);
          const isCurrent = i === currentIndex;
          const locked = !complete && !isCurrent && i > currentIndex && currentIndex !== -1;
          const alignRight = p.x > 50;

          return (
            <div
              key={ch.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p.x}%`, top: p.y }}
            >
              <div
                className={
                  "flex items-center gap-3 " + (alignRight ? "flex-row-reverse text-right" : "")
                }
              >
                <Link
                  to="/syllabus/$chapterId"
                  params={{ chapterId: ch.id }}
                  aria-label={`Chapter ${ch.index}: ${ch.title}`}
                  className={
                    "group relative grid size-16 shrink-0 place-items-center rounded-full border-2 font-display transition-transform duration-300 hover:scale-110 active:scale-95 " +
                    (complete
                      ? "border-success bg-success/20 text-success"
                      : isCurrent
                        ? "border-primary bg-primary/15 text-primary glow-ring"
                        : "border-border bg-surface-2 text-muted-foreground")
                  }
                >
                  {isCurrent && (
                    <span className="absolute inset-0 animate-ping rounded-full border border-primary/60" aria-hidden />
                  )}
                  {complete ? (
                    <Check className="size-6" />
                  ) : isCurrent ? (
                    <Atom className="size-6 animate-[spin_6s_linear_infinite]" />
                  ) : locked ? (
                    <Lock className="size-5" />
                  ) : (
                    <span className="font-mono text-sm">{String(ch.index).padStart(2, "0")}</span>
                  )}
                  <span className="absolute -bottom-1 rounded-full border border-border bg-background px-1.5 font-mono text-[9px] text-muted-foreground">
                    {String(ch.index).padStart(2, "0")}
                  </span>
                </Link>

                <div className="hidden w-44 sm:block">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                    {ch.track}
                  </p>
                  <p className="truncate text-sm font-semibold">{ch.title}</p>
                  <p className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                    <Star className="size-3 text-star" /> {ch.kata.stars} · {ch.duration}
                    {isCurrent && <span className="ml-1 text-primary">you are here</span>}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
