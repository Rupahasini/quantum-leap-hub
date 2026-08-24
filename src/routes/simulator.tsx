import { createFileRoute } from "@tanstack/react-router";
import { Eraser, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  amplitudes,
  blochVector,
  emptyCircuit,
  fmt,
  GATE_INFO,
  simulate,
  type Cell,
  type Circuit,
  type GateId,
} from "@/lib/quantum";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/simulator")({
  head: () => ({
    meta: [
      { title: "Quantum Circuit Lab — Drag-and-Drop Simulator" },
      {
        name: "description",
        content:
          "Build quantum circuits in your browser: drag H, X, Y, Z, S, T and CNOT gates onto a 3-qubit grid and read the live state vector, probabilities and Bloch vectors.",
      },
      { property: "og:title", content: "Quantum Circuit Lab — Drag-and-Drop Simulator" },
      {
        property: "og:description",
        content: "Real-time state-vector simulation with instant visual feedback on every gate change.",
      },
    ],
  }),
  component: Simulator,
});

const N_QUBITS = 3;
const N_COLUMNS = 6;
const PALETTE: GateId[] = ["H", "X", "Y", "Z", "S", "T", "CNOT"];

const PRESETS: { name: string; build: () => Circuit }[] = [
  {
    name: "Bell pair",
    build: () => {
      const c = emptyCircuit(N_QUBITS, N_COLUMNS);
      c[0]![0] = { kind: "single", gate: "H" };
      c[0]![1] = { kind: "control", target: 1 };
      c[1]![1] = { kind: "target" };
      return c;
    },
  },
  {
    name: "GHZ state",
    build: () => {
      const c = emptyCircuit(N_QUBITS, N_COLUMNS);
      c[0]![0] = { kind: "single", gate: "H" };
      c[0]![1] = { kind: "control", target: 1 };
      c[1]![1] = { kind: "target" };
      c[1]![2] = { kind: "control", target: 2 };
      c[2]![2] = { kind: "target" };
      return c;
    },
  },
  {
    name: "Phase kickback",
    build: () => {
      const c = emptyCircuit(N_QUBITS, N_COLUMNS);
      c[0]![0] = { kind: "single", gate: "H" };
      c[0]![1] = { kind: "single", gate: "T" };
      c[0]![2] = { kind: "single", gate: "H" };
      return c;
    },
  },
];

function Simulator() {
  const [circuit, setCircuit] = useState<Circuit>(() => emptyCircuit(N_QUBITS, N_COLUMNS));
  const [dragging, setDragging] = useState<GateId | null>(null);
  const [selected, setSelected] = useState<GateId>("H");

  const state = useMemo(() => simulate(circuit), [circuit]);
  const amps = useMemo(() => amplitudes(state, N_QUBITS), [state]);
  const blochs = useMemo(
    () => Array.from({ length: N_QUBITS }, (_, q) => blochVector(state, q, N_QUBITS)),
    [state],
  );

  function place(qubit: number, column: number, gate: GateId) {
    setCircuit((prev) => {
      const next = prev.map((row) => row.slice());
      if (gate === "CNOT") {
        const target = (qubit + 1) % N_QUBITS;
        for (let q = 0; q < N_QUBITS; q++) next[q]![column] = { kind: "empty" };
        next[qubit]![column] = { kind: "control", target };
        next[target]![column] = { kind: "target" };
      } else {
        const existing = prev[qubit]![column]!;
        if (existing.kind === "control" || existing.kind === "target") {
          for (let q = 0; q < N_QUBITS; q++) {
            const cell = prev[q]![column]!;
            if (cell.kind === "control" || cell.kind === "target") {
              next[q]![column] = { kind: "empty" };
            }
          }
        }
        next[qubit]![column] = { kind: "single", gate };
      }
      return next;
    });
  }

  function clearCell(qubit: number, column: number) {
    setCircuit((prev) => {
      const next = prev.map((row) => row.slice());
      const cell = prev[qubit]![column]!;
      if (cell.kind === "control" || cell.kind === "target") {
        for (let q = 0; q < N_QUBITS; q++) {
          const c = prev[q]![column]!;
          if (c.kind === "control" || c.kind === "target") next[q]![column] = { kind: "empty" };
        }
      } else {
        next[qubit]![column] = { kind: "empty" };
      }
      return next;
    });
  }

  const maxProb = Math.max(...amps.map((a) => a.probability), 0.0001);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold sm:text-4xl">Circuit Lab</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Drag a gate onto the grid — or tap a gate then a cell on mobile. The state vector,
        measurement probabilities and Bloch vectors recompute on every change.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="space-y-4">
          <div className="panel p-4">
            <div className="flex flex-wrap items-center gap-2">
              {PALETTE.map((g) => (
                <button
                  key={g}
                  draggable
                  onDragStart={() => setDragging(g)}
                  onDragEnd={() => setDragging(null)}
                  onClick={() => setSelected(g)}
                  title={GATE_INFO[g].description}
                  className={cn(
                    "cursor-grab rounded-lg border border-border bg-surface-2 px-3.5 py-2 font-mono text-sm transition-all hover:border-primary/70 hover:text-primary active:scale-95",
                    selected === g && "border-primary bg-primary/15 text-primary",
                  )}
                >
                  {GATE_INFO[g].label}
                </button>
              ))}
              <span className="ml-auto text-xs text-muted-foreground">
                Selected: <span className="font-mono text-primary">{GATE_INFO[selected].label}</span>
              </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{GATE_INFO[selected].description}</p>
          </div>

          <div className="card-elevated overflow-x-auto p-5">
            <div className="min-w-[520px] space-y-3">
              {Array.from({ length: N_QUBITS }, (_, q) => (
                <div key={q} className="flex items-center gap-3">
                  <span className="w-14 shrink-0 font-mono text-xs text-muted-foreground">
                    q{q} |0⟩
                  </span>
                  <div className="relative flex flex-1 items-center gap-2">
                    <span className="absolute inset-x-0 top-1/2 h-px bg-border" aria-hidden />
                    {Array.from({ length: N_COLUMNS }, (_, col) => {
                      const cell: Cell = circuit[q]![col]!;
                      return (
                        <button
                          key={col}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (dragging) place(q, col, dragging);
                            setDragging(null);
                          }}
                          onClick={() =>
                            cell.kind === "empty" ? place(q, col, selected) : clearCell(q, col)
                          }
                          className={cn(
                            "relative z-10 grid size-11 shrink-0 place-items-center rounded-lg border font-mono text-sm transition-all duration-150",
                            cell.kind === "empty"
                              ? "border-dashed border-border bg-background/60 text-muted-foreground/50 hover:border-primary/70 hover:text-primary"
                              : "border-primary/70 bg-primary/15 text-primary glow-ring animate-in zoom-in-75",
                          )}
                          title={cell.kind === "empty" ? "Place gate" : "Click to remove"}
                        >
                          {cell.kind === "single" && cell.gate}
                          {cell.kind === "control" && "●"}
                          {cell.kind === "target" && "⊕"}
                          {cell.kind === "empty" && "+"}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
              {PRESETS.map((p) => (
                <Button
                  key={p.name}
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setCircuit(p.build());
                    toast.success(`Loaded ${p.name}`);
                  }}
                >
                  {p.name}
                </Button>
              ))}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setCircuit(emptyCircuit(N_QUBITS, N_COLUMNS))}
              >
                <Eraser className="size-3.5" /> Clear
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setCircuit(emptyCircuit(N_QUBITS, N_COLUMNS));
                  setSelected("H");
                }}
              >
                <RotateCcw className="size-3.5" /> Reset
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="panel p-5">
            <h2 className="text-sm font-semibold">State vector</h2>
            <ul className="mt-3 space-y-1.5 font-mono text-xs">
              {amps.map((a) => (
                <li key={a.basis} className="flex items-center gap-3">
                  <span className="w-14 text-muted-foreground">|{a.basis}⟩</span>
                  <span className="w-32 tabular-nums">
                    {fmt(a.re)}
                    {a.im >= 0 ? " + " : " − "}
                    {fmt(Math.abs(a.im))}i
                  </span>
                  <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                    <span
                      className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width] duration-300"
                      style={{ width: `${(a.probability / maxProb) * 100}%` }}
                    />
                  </span>
                  <span className="w-14 text-right tabular-nums text-muted-foreground">
                    {(a.probability * 100).toFixed(1)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel p-5">
            <h2 className="text-sm font-semibold">Bloch vectors</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Length below 1 means the qubit is mixed — a signature of entanglement.
            </p>
            <ul className="mt-3 space-y-2 font-mono text-xs">
              {blochs.map((b, q) => {
                const r = Math.sqrt(b.x * b.x + b.y * b.y + b.z * b.z);
                return (
                  <li key={q} className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="text-muted-foreground">q{q}</span>
                    <span className="tabular-nums">x {fmt(b.x, 2)}</span>
                    <span className="tabular-nums">y {fmt(b.y, 2)}</span>
                    <span className="tabular-nums">z {fmt(b.z, 2)}</span>
                    <span className={cn("tabular-nums", r < 0.99 ? "text-star" : "text-success")}>
                      |r| {fmt(r, 2)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
