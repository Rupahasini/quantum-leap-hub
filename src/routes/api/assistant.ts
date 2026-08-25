import { createFileRoute } from "@tanstack/react-router";

type Msg = { role: "user" | "assistant"; content: string };

type Body = {
  messages?: Msg[];
  page?: { path?: string; title?: string; screen?: string };
  progress?: {
    completedChapters?: string[];
    stars?: number;
    quizzesPassed?: string[];
    projectsSubmitted?: string[];
  };
};

const SITE_MAP = `Site pages:
- "/" home hub (overview of the platform)
- "/syllabus" the 12-chapter curriculum list; "/syllabus/<chapterId>" a chapter with objectives, worked code, a quiz and a kata
- "/simulator" browser quantum circuit lab (drag gates, see state vector & probabilities)
- "/projects" hands-on builds (QRNG, QSVM, quantum transfer learning) that award stars
- "/techniques" QML technique directory, "/applications" industry case studies
- "/rewards" spend earned stars on premium perks
- "/stack" recommended Python (Qiskit/FastAPI) + React architecture
- "/dashboard" personal roadmap, XP, level and avatar (requires sign in at "/auth")`;

export const Route = createFileRoute("/api/assistant")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const body = (await request.json()) as Body;
        const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
        if (messages.length === 0) return new Response("messages required", { status: 400 });

        const screen = (body.page?.screen ?? "").slice(0, 6000);
        const progress = body.progress ?? {};

        const system = `You are Qubi, the on-screen guide for "Quantum Learning Algorithms", an interactive quantum machine learning course.
Your job: tell the learner exactly what their CURRENT step is and what the NEXT step is, based on the page they are on and their progress. Be concrete and encouraging, 120 words max, use short markdown bullets and name the exact button, panel or link to click.
You can read a text snapshot of what is currently rendered on the learner's screen — use it to unstick them (point at the actual controls/headings you see).
${SITE_MAP}

Learner progress: ${progress.completedChapters?.length ?? 0}/12 chapters complete, ${progress.quizzesPassed?.length ?? 0} quizzes passed, ${progress.projectsSubmitted?.length ?? 0} projects submitted, ${progress.stars ?? 0} stars available.
Current page: ${body.page?.path ?? "unknown"} — "${body.page?.title ?? ""}".
Screen snapshot (visible text, truncated):
"""
${screen}
"""`;

        const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
          body: JSON.stringify({
            model: "openai/gpt-5.6-sol",
            input: [
              { role: "system", content: system },
              ...messages.map((m) => ({ role: m.role, content: String(m.content).slice(0, 4000) })),
            ],
          }),
        });

        if (!res.ok) {
          const detail = await res.text();
          return new Response(JSON.stringify({ error: detail.slice(0, 500) }), {
            status: res.status,
            headers: { "Content-Type": "application/json" },
          });
        }

        const data = (await res.json()) as {
          output_text?: string;
          output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
        };
        const text =
          data.output_text ??
          data.output
            ?.flatMap((o) => o.content ?? [])
            .filter((c) => c.type === "output_text")
            .map((c) => c.text ?? "")
            .join("\n")
            .trim() ??
          "";

        return new Response(JSON.stringify({ text: text || "I couldn't generate a reply — try again." }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
