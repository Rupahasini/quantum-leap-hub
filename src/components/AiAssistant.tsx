import { useLocation } from "@tanstack/react-router";
import { Atom, Eye, Loader2, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useProgress } from "@/lib/progress";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What's my current step?",
  "I'm stuck on this page",
  "What should I do next?",
];

function readScreen() {
  if (typeof document === "undefined") return "";
  const main = document.querySelector("main") ?? document.body;
  return (main.innerText || "").replace(/\n{3,}/g, "\n\n").slice(0, 6000);
}

export function AiAssistant() {
  const location = useLocation();
  const progress = useProgress();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open, busy]);

  async function ask(text: string) {
    const question = text.trim();
    if (!question || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next,
          page: {
            path: location.pathname,
            title: typeof document !== "undefined" ? document.title : "",
            screen: readScreen(),
          },
          progress: {
            completedChapters: progress.completedChapters,
            quizzesPassed: progress.quizzesPassed,
            projectsSubmitted: progress.projectsSubmitted,
            stars: progress.available,
          },
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { text?: string; error?: string };
      if (!res.ok) {
        const message =
          res.status === 402
            ? "The workspace is out of AI credits — add credits to keep Qubi running."
            : res.status === 429
              ? "Too many requests right now. Give me a few seconds and ask again."
              : data.error || "Qubi couldn't answer that. Please try again.";
        setMessages([...next, { role: "assistant", content: message }]);
        return;
      }
      setMessages([...next, { role: "assistant", content: data.text ?? "" }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Network error — please try again." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex h-[min(70vh,520px)] w-[min(94vw,380px)] flex-col overflow-hidden rounded-2xl border border-primary/40 bg-surface/95 shadow-[var(--shadow-elevated)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 sm:right-6">
          <header className="flex items-center gap-3 border-b border-border bg-surface-2/70 px-4 py-3">
            <span className="grid size-9 place-items-center rounded-full bg-primary/15 text-primary">
              <Atom className="size-5 animate-[spin_8s_linear_infinite]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Qubi · learning guide</p>
              <p className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                <Eye className="size-3" /> reading this page
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Hi! I can see what's on your screen. Ask me where you are in the journey and what to
                  do next.
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => ask(s)}
                      className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs text-primary transition-colors hover:bg-primary/20"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl bg-primary px-3 py-2 text-sm text-primary-foreground"
                      : "max-w-[92%] whitespace-pre-wrap text-sm leading-relaxed text-foreground"
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}
            {busy && (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" /> scanning your screen…
              </p>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="border-t border-border px-3 py-3"
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    ask(input);
                  }
                }}
                placeholder="Ask about this page…"
                className="input-field max-h-28 min-h-10 flex-1 resize-none"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send message"
                className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                <Send className="size-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI guide" : "Open AI guide"}
        className="fixed bottom-6 right-4 z-50 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground glow-ring transition-transform duration-300 hover:scale-110 active:scale-95 sm:right-6"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" aria-hidden />
        {open ? <X className="size-6" /> : <Atom className="relative size-7 animate-[spin_9s_linear_infinite]" />}
      </button>
    </>
  );
}
