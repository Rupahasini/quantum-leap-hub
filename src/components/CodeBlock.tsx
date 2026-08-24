import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CodeBlock({ label, code }: { label?: string; code: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background/70">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-2/60 px-4 py-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
          {label ?? "python"}
        </span>
        <button
          onClick={() => {
            void navigator.clipboard?.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
          }}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
