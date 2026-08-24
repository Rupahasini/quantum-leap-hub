import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "@/components/CodeBlock";

export const Route = createFileRoute("/stack")({
  head: () => ({
    meta: [
      { title: "Recommended Tech Stack — Python Quantum Backend + React Frontend" },
      {
        name: "description",
        content:
          "A production stack for a quantum learning platform: React frontend, FastAPI service running Qiskit and PennyLane, job queue for hardware runs, and an in-browser simulator for instant feedback.",
      },
      { property: "og:title", content: "Recommended Tech Stack for a QML Platform" },
      {
        property: "og:description",
        content: "React + TanStack Start frontend, FastAPI + Qiskit/PennyLane backend, queued IBM Quantum jobs.",
      },
    ],
  }),
  component: Stack,
});

const layers = [
  {
    layer: "Frontend",
    picks: "React 19 + TanStack Start, Tailwind CSS, TypeScript",
    why: "Server-rendered routes for SEO, responsive from mobile to desktop, and a typed router for deep-linkable chapters.",
  },
  {
    layer: "Instant feedback",
    picks: "TypeScript state-vector simulator (this Circuit Lab)",
    why: "Sub-millisecond updates for up to ~10 qubits with zero network latency, so micro-interactions stay instant.",
  },
  {
    layer: "Python quantum service",
    picks: "FastAPI + Qiskit + PennyLane, Pydantic schemas",
    why: "The authoritative engine for real transpilation, noise models, gradients and anything the browser cannot do.",
  },
  {
    layer: "Heavy jobs",
    picks: "Celery or RQ + Redis, Qiskit Runtime primitives",
    why: "Hardware and long training runs are queued and polled, never blocking a request.",
  },
  {
    layer: "Notebooks",
    picks: "JupyterLite (browser) or JupyterHub per learner",
    why: "Project work runs where the learner already is; JupyterLite needs no server for pure-Python steps.",
  },
  {
    layer: "Hardware access",
    picks: "IBM Quantum via qiskit-ibm-runtime; Braket as fallback",
    why: "Credentials stay server-side; star-gated queue priority is enforced in the backend.",
  },
  {
    layer: "Data & auth",
    picks: "Postgres + row-level security, object storage for submissions",
    why: "Stars, unlocks and submitted code need durable, per-user storage once you move past local progress.",
  },
];

function Stack() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold sm:text-4xl">Recommended tech stack</h1>
      <p className="mt-3 text-muted-foreground">
        A split architecture: a fast TypeScript simulator for interaction, and a Python service for
        real quantum work with Qiskit and PennyLane.
      </p>

      <div className="mt-10 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface-2/60 text-left font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Layer</th>
              <th className="px-4 py-3">Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {layers.map((l) => (
              <tr key={l.layer} className="border-t border-border align-top">
                <td className="px-4 py-4 font-medium">{l.layer}</td>
                <td className="px-4 py-4">
                  <p className="font-mono text-[12.5px] text-primary">{l.picks}</p>
                  <p className="mt-1 text-muted-foreground">{l.why}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-xl font-semibold">Quantum service sketch</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        One endpoint per capability, all keys server-side, results cached by circuit hash.
      </p>
      <div className="mt-4">
        <CodeBlock
          label="FastAPI + PennyLane"
          code={`from fastapi import FastAPI
from pydantic import BaseModel
import pennylane as qml, numpy as np

app = FastAPI()

class KernelRequest(BaseModel):
    x: list[float]
    y: list[float]

dev = qml.device("default.qubit", wires=4)

@qml.qnode(dev)
def overlap(x, y):
    qml.AngleEmbedding(x, wires=range(4))
    qml.adjoint(qml.AngleEmbedding)(y, wires=range(4))
    return qml.probs(wires=range(4))

@app.post("/kernel")
def kernel(req: KernelRequest):
    value = float(overlap(np.array(req.x), np.array(req.y))[0])
    return {"kernel": value}`}
        />
      </div>
    </div>
  );
}
