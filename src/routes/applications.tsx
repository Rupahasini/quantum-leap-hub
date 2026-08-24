import { createFileRoute } from "@tanstack/react-router";
import { applications } from "@/lib/curriculum";

export const Route = createFileRoute("/applications")({
  head: () => ({
    meta: [
      { title: "Industry Applications — QML in Drug Discovery, Finance, Climate" },
      {
        name: "description",
        content:
          "How quantum learning algorithms are applied in drug discovery, finance, climate science and logistics, with the algorithms and maturity level for each.",
      },
      { property: "og:title", content: "Industry Applications of Quantum Machine Learning" },
      {
        property: "og:description",
        content: "Drug discovery, finance, climate science and logistics — algorithms and honest maturity levels.",
      },
    ],
  }),
  component: Applications,
});

function Applications() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold sm:text-4xl">Industry applications</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Where quantum learning algorithms are being trialled today — and how mature each line of work
        really is.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {applications.map((a) => (
          <article key={a.id} className="card-elevated p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
              {a.industry}
            </p>
            <h2 className="mt-3 text-lg font-semibold">{a.headline}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{a.detail}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {a.algorithms.map((alg) => (
                <span
                  key={alg}
                  className="rounded-md border border-border bg-secondary px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                >
                  {alg}
                </span>
              ))}
            </div>
            <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
              Maturity: <span className="text-foreground">{a.maturity}</span>
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
