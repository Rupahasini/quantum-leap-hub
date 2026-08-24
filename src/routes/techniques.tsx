import { createFileRoute } from "@tanstack/react-router";
import { techniques } from "@/lib/curriculum";

export const Route = createFileRoute("/techniques")({
  head: () => ({
    meta: [
      { title: "Quantum Technique Directory — Encoding, Kernels, Mitigation" },
      {
        name: "description",
        content:
          "Reference directory of quantum machine learning techniques: amplitude and angle encoding, parameter-shift gradients, fidelity kernels, data re-uploading, QAOA and ZNE.",
      },
      { property: "og:title", content: "Quantum Technique Directory" },
      {
        property: "og:description",
        content: "What each QML technique does and when it is the right choice.",
      },
    ],
  }),
  component: Techniques,
});

function Techniques() {
  const categories = [...new Set(techniques.map((t) => t.category))];

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold sm:text-4xl">Technique directory</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        The building blocks you will reuse across every quantum learning algorithm — with the
        conditions under which each one actually helps.
      </p>

      <div className="mt-10 space-y-10">
        {categories.map((cat) => (
          <section key={cat}>
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{cat}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {techniques
                .filter((t) => t.category === cat)
                .map((t) => (
                  <article
                    key={t.id}
                    className="panel p-5 transition-colors hover:border-primary/50"
                  >
                    <h3 className="text-base font-semibold">{t.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{t.detail}</p>
                    <p className="mt-3 border-t border-border pt-3 text-xs">
                      <span className="font-mono uppercase tracking-[0.15em] text-primary">
                        Use when
                      </span>
                      <span className="mt-1 block text-muted-foreground">{t.useWhen}</span>
                    </p>
                  </article>
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
