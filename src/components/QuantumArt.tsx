/**
 * Hand-built SVG figures used inside chapter lessons. Every figure is drawn with
 * design-system tokens so it themes correctly and stays crisp at any size.
 */

export type ArtId =
  | "bloch"
  | "tensor"
  | "circuit"
  | "measure"
  | "interference"
  | "encoding"
  | "vqc-loop"
  | "qnn"
  | "kernel"
  | "gan"
  | "noise"
  | "spectrum";

const P = "var(--primary)";
const G = "var(--primary-glow)";
const M = "var(--muted-foreground)";
const B = "var(--border)";
const S = "var(--star)";

function Frame({ children, viewBox }: { children: React.ReactNode; viewBox: string }) {
  return (
    <svg viewBox={viewBox} className="h-auto w-full" role="img" aria-hidden>
      {children}
    </svg>
  );
}

const label = (x: number, y: number, text: string, size = 9, fill = M, anchor = "middle") => (
  <text x={x} y={y} fontSize={size} fill={fill} textAnchor={anchor} fontFamily="var(--font-mono, monospace)">
    {text}
  </text>
);

function Bloch() {
  return (
    <Frame viewBox="0 0 260 200">
      <ellipse cx="130" cy="100" rx="70" ry="70" fill={P} opacity="0.07" />
      <circle cx="130" cy="100" r="70" fill="none" stroke={B} />
      <ellipse cx="130" cy="100" rx="70" ry="22" fill="none" stroke={B} strokeDasharray="3 3" />
      <line x1="130" y1="175" x2="130" y2="25" stroke={B} />
      <line x1="55" y1="100" x2="205" y2="100" stroke={B} />
      <line x1="85" y1="135" x2="175" y2="65" stroke={B} strokeDasharray="2 3" />
      <line x1="130" y1="100" x2="178" y2="58" stroke={P} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="178" cy="58" r="4.5" fill={G} />
      <path d="M 130 60 A 40 40 0 0 1 156 74" fill="none" stroke={S} strokeWidth="1.4" />
      {label(130, 18, "|0⟩", 11, P)}
      {label(130, 192, "|1⟩", 11, P)}
      {label(216, 103, "x")}
      {label(180, 130, "y")}
      {label(160, 60, "θ", 10, S, "end")}
      {label(150, 118, "φ", 10, S)}
      {label(196, 45, "|ψ⟩", 10, G)}
    </Frame>
  );
}

function Tensor() {
  const cell = (x: number, y: number, t: string, on = false) => (
    <g key={t + x + y}>
      <rect x={x} y={y} width="34" height="24" rx="5" fill={on ? P : "var(--surface-2)"} opacity={on ? 0.25 : 1} stroke={on ? P : B} />
      {label(x + 17, y + 16, t, 10, on ? P : M)}
    </g>
  );
  return (
    <Frame viewBox="0 0 300 130">
      {cell(6, 20, "|0⟩")}
      {cell(6, 60, "|1⟩")}
      {label(23, 112, "qubit A", 8)}
      {label(58, 52, "⊗", 16, P)}
      {cell(78, 20, "|0⟩")}
      {cell(78, 60, "|1⟩")}
      {label(95, 112, "qubit B", 8)}
      {label(132, 52, "=", 14, M)}
      {cell(152, 8, "|00⟩", true)}
      {cell(152, 38, "|01⟩", true)}
      {cell(152, 68, "|10⟩", true)}
      {cell(152, 98, "|11⟩", true)}
      {label(250, 46, "4 = 2²", 11, G)}
      {label(250, 64, "amplitudes", 8)}
    </Frame>
  );
}

function Circuit() {
  const wire = (y: number, name: string) => (
    <g key={name}>
      <line x1="40" y1={y} x2="285" y2={y} stroke={B} />
      {label(24, y + 4, name, 9, M, "end")}
    </g>
  );
  const gate = (x: number, y: number, t: string) => (
    <g key={t + x + y}>
      <rect x={x - 13} y={y - 13} width="26" height="26" rx="6" fill="var(--surface-2)" stroke={P} />
      {label(x, y + 4, t, 11, P)}
    </g>
  );
  return (
    <Frame viewBox="0 0 300 130">
      {wire(35, "q0 |0⟩")}
      {wire(80, "q1 |0⟩")}
      {gate(80, 35, "H")}
      <line x1="140" y1="35" x2="140" y2="80" stroke={P} strokeWidth="1.6" />
      <circle cx="140" cy="35" r="5" fill={P} />
      <circle cx="140" cy="80" r="9" fill="none" stroke={P} strokeWidth="1.6" />
      <line x1="131" y1="80" x2="149" y2="80" stroke={P} strokeWidth="1.4" />
      <line x1="140" y1="71" x2="140" y2="89" stroke={P} strokeWidth="1.4" />
      {gate(200, 35, "Z")}
      <g>
        <rect x="245" y="22" width="26" height="26" rx="6" fill="var(--surface-2)" stroke={S} />
        <path d="M 250 42 A 8 8 0 0 1 266 42" fill="none" stroke={S} strokeWidth="1.4" />
        <line x1="258" y1="42" x2="265" y2="31" stroke={S} strokeWidth="1.4" />
        <rect x="245" y="67" width="26" height="26" rx="6" fill="var(--surface-2)" stroke={S} />
        <path d="M 250 87 A 8 8 0 0 1 266 87" fill="none" stroke={S} strokeWidth="1.4" />
        <line x1="258" y1="87" x2="265" y2="76" stroke={S} strokeWidth="1.4" />
      </g>
      {label(140, 116, "superposition → entanglement → phase → measure", 8)}
    </Frame>
  );
}

function Measure() {
  return (
    <Frame viewBox="0 0 300 140">
      <circle cx="55" cy="60" r="26" fill={P} opacity="0.15" stroke={P} strokeDasharray="3 3" />
      {label(55, 64, "|ψ⟩", 11, P)}
      {label(55, 104, "superposed", 8)}
      <line x1="90" y1="60" x2="140" y2="60" stroke={B} />
      <polygon points="140,60 132,56 132,64" fill={B} />
      {label(115, 50, "measure", 8, S)}
      <rect x="150" y="16" width="56" height="34" rx="8" fill="var(--surface-2)" stroke={P} />
      {label(178, 38, "|0⟩", 11, P)}
      {label(232, 38, "p = |α|²", 9, G, "start")}
      <rect x="150" y="70" width="56" height="34" rx="8" fill="var(--surface-2)" stroke={B} />
      {label(178, 92, "|1⟩", 11, M)}
      {label(232, 92, "p = |β|²", 9, M, "start")}
      {label(150, 130, "collapse is irreversible — the other branch is gone", 8, M, "start")}
    </Frame>
  );
}

function Interference() {
  return (
    <Frame viewBox="0 0 300 130">
      <path d="M 10 45 Q 40 5 70 45 Q 100 85 130 45 Q 160 5 190 45" fill="none" stroke={P} strokeWidth="1.8" />
      <path d="M 10 45 Q 40 85 70 45 Q 100 5 130 45 Q 160 85 190 45" fill="none" stroke={S} strokeWidth="1.8" opacity="0.8" />
      {label(100, 108, "opposite phases cancel → destructive", 8)}
      <line x1="200" y1="20" x2="200" y2="90" stroke={B} strokeDasharray="3 3" />
      <line x1="210" y1="45" x2="285" y2="45" stroke={M} strokeWidth="1.4" />
      {label(247, 34, "amplitude ≈ 0", 8, M)}
      {label(247, 70, "wrong answers vanish", 8, G)}
    </Frame>
  );
}

function Encoding() {
  const box = (x: number, t: string, sub: string, accent = false) => (
    <g key={t}>
      <rect x={x} y="30" width="70" height="44" rx="10" fill="var(--surface-2)" stroke={accent ? P : B} />
      {label(x + 35, 52, t, 10, accent ? P : M)}
      {label(x + 35, 66, sub, 7)}
    </g>
  );
  return (
    <Frame viewBox="0 0 300 110">
      {box(6, "x ∈ ℝⁿ", "classical row")}
      {box(96, "scale", "→ [0, π]")}
      {box(186, "RY(xᵢ)", "quantum state", true)}
      <line x1="76" y1="52" x2="96" y2="52" stroke={B} />
      <line x1="166" y1="52" x2="186" y2="52" stroke={B} />
      {label(150, 96, "angle encoding: one feature per rotation, n features → n qubits", 8)}
    </Frame>
  );
}

function VqcLoop() {
  return (
    <Frame viewBox="0 0 300 150">
      <rect x="14" y="24" width="76" height="38" rx="9" fill="var(--surface-2)" stroke={P} />
      {label(52, 40, "encode x", 9, P)}
      {label(52, 54, "feature map", 7)}
      <rect x="112" y="24" width="76" height="38" rx="9" fill="var(--surface-2)" stroke={P} />
      {label(150, 40, "U(θ)", 9, P)}
      {label(150, 54, "ansatz", 7)}
      <rect x="210" y="24" width="76" height="38" rx="9" fill="var(--surface-2)" stroke={S} />
      {label(248, 40, "⟨Z⟩", 9, S)}
      {label(248, 54, "expectation", 7)}
      <line x1="90" y1="43" x2="112" y2="43" stroke={B} />
      <line x1="188" y1="43" x2="210" y2="43" stroke={B} />
      <rect x="90" y="96" width="120" height="34" rx="9" fill="var(--surface-2)" stroke={G} />
      {label(150, 117, "classical optimiser", 9, G)}
      <path d="M 248 62 L 248 113 L 210 113" fill="none" stroke={B} strokeDasharray="3 3" />
      <path d="M 90 113 L 52 113 L 52 62" fill="none" stroke={B} strokeDasharray="3 3" />
      <polygon points="52,62 48,70 56,70" fill={B} />
      {label(150, 86, "loss ↓ via parameter-shift gradients", 8)}
    </Frame>
  );
}

function Qnn() {
  const col = (x: number, ys: number[], fill: string) =>
    ys.map((y) => <circle key={x + "-" + y} cx={x} cy={y} r="7" fill={fill} opacity="0.85" />);
  const xs = [40, 120, 200, 265];
  const layers = [[30, 60, 90, 120], [30, 60, 90, 120], [45, 75, 105], [75]];
  return (
    <Frame viewBox="0 0 300 150">
      {xs.slice(0, 3).map((x, i) =>
        layers[i]!.flatMap((y) =>
          layers[i + 1]!.map((y2) => (
            <line key={`${x}-${y}-${y2}`} x1={x} y1={y} x2={xs[i + 1]} y2={y2} stroke={B} strokeWidth="0.6" />
          )),
        ),
      )}
      {col(40, layers[0]!, P)}
      {col(120, layers[1]!, G)}
      {col(200, layers[2]!, G)}
      {col(265, layers[3]!, S)}
      {label(40, 142, "encode", 8)}
      {label(120, 142, "layer 1", 8)}
      {label(200, 142, "layer 2", 8)}
      {label(265, 142, "⟨Z⟩", 8)}
      {label(150, 14, "data re-uploading repeats encode → variational blocks", 8)}
    </Frame>
  );
}

function Kernel() {
  const pts: [number, number, boolean][] = [
    [40, 90, true], [60, 60, true], [30, 50, true], [70, 100, true],
    [95, 40, false], [110, 95, false], [85, 75, false], [120, 55, false],
  ];
  return (
    <Frame viewBox="0 0 300 140">
      <rect x="10" y="20" width="130" height="100" rx="10" fill="var(--surface-2)" stroke={B} />
      {pts.map(([x, y, a], i) => (
        <circle key={i} cx={x} cy={y} r="4.5" fill={a ? P : S} />
      ))}
      {label(75, 134, "classical space — not separable", 8)}
      <line x1="148" y1="70" x2="172" y2="70" stroke={B} />
      <polygon points="172,70 164,66 164,74" fill={B} />
      {label(160, 58, "φ(x)", 8, G)}
      <rect x="180" y="20" width="110" height="100" rx="10" fill="var(--surface-2)" stroke={P} />
      <line x1="188" y1="105" x2="282" y2="35" stroke={G} strokeWidth="1.6" strokeDasharray="4 3" />
      {[[200, 40], [225, 30], [210, 55], [240, 45]].map(([x, y], i) => (
        <circle key={"a" + i} cx={x} cy={y} r="4.5" fill={P} />
      ))}
      {[[220, 95], [250, 85], [265, 100], [240, 105]].map(([x, y], i) => (
        <circle key={"b" + i} cx={x} cy={y} r="4.5" fill={S} />
      ))}
      {label(235, 134, "Hilbert space — linearly separable", 8)}
    </Frame>
  );
}

function Gan() {
  return (
    <Frame viewBox="0 0 300 140">
      <rect x="10" y="20" width="80" height="38" rx="9" fill="var(--surface-2)" stroke={P} />
      {label(50, 43, "G(θ) quantum", 8, P)}
      <rect x="10" y="82" width="80" height="38" rx="9" fill="var(--surface-2)" stroke={M} />
      {label(50, 105, "real data", 8, M)}
      <rect x="150" y="51" width="86" height="38" rx="9" fill="var(--surface-2)" stroke={S} />
      {label(193, 74, "discriminator", 8, S)}
      <line x1="90" y1="39" x2="150" y2="63" stroke={B} />
      <line x1="90" y1="101" x2="150" y2="77" stroke={B} />
      <path d="M 236 70 L 268 70 L 268 12 L 50 12 L 50 20" fill="none" stroke={B} strokeDasharray="3 3" />
      <polygon points="50,20 46,28 54,28" fill={B} />
      {label(160, 130, "adversarial loop until the discriminator guesses at 50%", 8, M, "middle")}
    </Frame>
  );
}

function Noise() {
  return (
    <Frame viewBox="0 0 300 140">
      <line x1="34" y1="112" x2="288" y2="112" stroke={B} />
      <line x1="34" y1="112" x2="34" y2="18" stroke={B} />
      {label(20, 26, "err", 8, M, "end")}
      {label(160, 132, "noise scale factor λ", 8)}
      {[[80, 84], [140, 62], [200, 40], [258, 22]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4.5" fill={S} />
      ))}
      <path d="M 80 84 L 258 22" stroke={S} strokeWidth="1.4" />
      <path d="M 80 84 L 34 100" stroke={P} strokeWidth="1.8" strokeDasharray="4 3" />
      <circle cx="34" cy="100" r="5" fill={P} />
      {label(60, 100, "λ→0 extrapolated", 8, P, "start")}
      {label(232, 44, "measured", 8, S, "start")}
    </Frame>
  );
}

function Spectrum() {
  const rows: [string, string][] = [
    ["Z", "+1 / −1"],
    ["X", "+1 / −1"],
    ["H", "+1 / −1"],
  ];
  return (
    <Frame viewBox="0 0 300 130">
      <line x1="150" y1="24" x2="150" y2="112" stroke={B} />
      {rows.map(([n], i) => {
        const y = 40 + i * 30;
        return (
          <g key={n}>
            <rect x="16" y={y - 12} width="34" height="24" rx="6" fill="var(--surface-2)" stroke={P} />
            {label(33, y + 4, n, 10, P)}
            <line x1="52" y1={y} x2="146" y2={y} stroke={B} strokeDasharray="3 3" />
            <circle cx="196" cy={y} r="5" fill={G} />
            <circle cx="244" cy={y} r="5" fill={S} />
            {label(196, y - 12, "−1", 8)}
            {label(244, y - 12, "+1", 8)}
          </g>
        );
      })}
      {label(80, 122, "operator", 8)}
      {label(220, 122, "eigenvalues = outcomes", 8)}
    </Frame>
  );
}

const ART: Record<ArtId, () => React.ReactElement> = {
  bloch: Bloch,
  tensor: Tensor,
  circuit: Circuit,
  measure: Measure,
  interference: Interference,
  encoding: Encoding,
  "vqc-loop": VqcLoop,
  qnn: Qnn,
  kernel: Kernel,
  gan: Gan,
  noise: Noise,
  spectrum: Spectrum,
};

export function QuantumArt({ id }: { id: ArtId }) {
  const Cmp = ART[id];
  return <Cmp />;
}
