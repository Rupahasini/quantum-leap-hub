/** Tiny complex state-vector simulator for the browser circuit lab. */

export type Complex = { re: number; im: number };

export const c = (re: number, im = 0): Complex => ({ re, im });
const add = (a: Complex, b: Complex): Complex => ({ re: a.re + b.re, im: a.im + b.im });
const mul = (a: Complex, b: Complex): Complex => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});

export type GateId = "H" | "X" | "Y" | "Z" | "S" | "T" | "CNOT";

const INV_SQRT2 = 1 / Math.SQRT2;

type Matrix2 = [Complex, Complex, Complex, Complex];

export const SINGLE_GATES: Record<Exclude<GateId, "CNOT">, Matrix2> = {
  H: [c(INV_SQRT2), c(INV_SQRT2), c(INV_SQRT2), c(-INV_SQRT2)],
  X: [c(0), c(1), c(1), c(0)],
  Y: [c(0), c(0, -1), c(0, 1), c(0)],
  Z: [c(1), c(0), c(0), c(-1)],
  S: [c(1), c(0), c(0), c(0, 1)],
  T: [c(1), c(0), c(0), c(INV_SQRT2, INV_SQRT2)],
};

export const GATE_INFO: Record<GateId, { label: string; description: string }> = {
  H: { label: "H", description: "Hadamard — creates equal superposition" },
  X: { label: "X", description: "Pauli-X — bit flip (NOT)" },
  Y: { label: "Y", description: "Pauli-Y — bit + phase flip" },
  Z: { label: "Z", description: "Pauli-Z — phase flip" },
  S: { label: "S", description: "Phase gate — quarter turn (π/2)" },
  T: { label: "T", description: "T gate — eighth turn (π/4)" },
  CNOT: { label: "●⊕", description: "CNOT — entangles control and target" },
};

export function zeroState(nQubits: number): Complex[] {
  const state = Array.from({ length: 1 << nQubits }, () => c(0));
  state[0] = c(1);
  return state;
}

/** Qubit 0 is the most significant bit in the basis-label ordering used here. */
function bitOf(index: number, qubit: number, nQubits: number): number {
  return (index >> (nQubits - 1 - qubit)) & 1;
}

function flipBit(index: number, qubit: number, nQubits: number): number {
  return index ^ (1 << (nQubits - 1 - qubit));
}

export function applySingle(
  state: Complex[],
  matrix: Matrix2,
  qubit: number,
  nQubits: number,
): Complex[] {
  const out = state.slice();
  const seen = new Set<number>();
  for (let i = 0; i < state.length; i++) {
    if (seen.has(i)) continue;
    const partner = flipBit(i, qubit, nQubits);
    seen.add(i);
    seen.add(partner);
    const zeroIdx = bitOf(i, qubit, nQubits) === 0 ? i : partner;
    const oneIdx = zeroIdx === i ? partner : i;
    const a0 = state[zeroIdx]!;
    const a1 = state[oneIdx]!;
    out[zeroIdx] = add(mul(matrix[0], a0), mul(matrix[1], a1));
    out[oneIdx] = add(mul(matrix[2], a0), mul(matrix[3], a1));

  }
  return out;
}

export function applyCNOT(
  state: Complex[],
  control: number,
  target: number,
  nQubits: number,
): Complex[] {
  if (control === target) return state;
  const out = state.slice();
  for (let i = 0; i < state.length; i++) {
    if (bitOf(i, control, nQubits) === 1) {
      out[flipBit(i, target, nQubits)] = state[i]!;
    }
  }
  return out;
}

export type Cell =
  | { kind: "empty" }
  | { kind: "single"; gate: Exclude<GateId, "CNOT"> }
  | { kind: "control"; target: number }
  | { kind: "target" };

export type Circuit = Cell[][]; // [qubit][column]

export function emptyCircuit(nQubits: number, nColumns: number): Circuit {
  return Array.from({ length: nQubits }, () =>
    Array.from({ length: nColumns }, () => ({ kind: "empty" }) as Cell),
  );
}

export function simulate(circuit: Circuit): Complex[] {
  const nQubits = circuit.length;
  const nColumns = circuit[0]?.length ?? 0;
  let state = zeroState(nQubits);
  for (let col = 0; col < nColumns; col++) {
    for (let q = 0; q < nQubits; q++) {
      const cell = circuit[q]![col]!;
      if (cell.kind === "single") {
        state = applySingle(state, SINGLE_GATES[cell.gate], q, nQubits);
      } else if (cell.kind === "control") {
        state = applyCNOT(state, q, cell.target, nQubits);
      }
    }
  }
  return state;
}

export type Amplitude = {
  basis: string;
  re: number;
  im: number;
  probability: number;
  phase: number;
};

export function amplitudes(state: Complex[], nQubits: number): Amplitude[] {
  return state.map((amp, i) => ({
    basis: i.toString(2).padStart(nQubits, "0"),
    re: amp.re,
    im: amp.im,
    probability: amp.re * amp.re + amp.im * amp.im,
    phase: Math.atan2(amp.im, amp.re),
  }));
}

/** Single-qubit Bloch vector via reduced density matrix. */
export function blochVector(state: Complex[], qubit: number, nQubits: number) {
  let x = 0;
  let y = 0;
  let z = 0;
  for (let i = 0; i < state.length; i++) {
    const a = state[i]!;
    if (bitOf(i, qubit, nQubits) === 0) {
      const j = flipBit(i, qubit, nQubits);
      const b = state[j]!;

      // rho01 = a * conj(b)
      x += 2 * (a.re * b.re + a.im * b.im);
      y += 2 * (a.im * b.re - a.re * b.im);
      z += a.re * a.re + a.im * a.im;
    } else {
      z -= a.re * a.re + a.im * a.im;
    }
  }
  return { x, y, z };
}

export function fmt(n: number, digits = 3) {
  const v = Math.abs(n) < 1e-10 ? 0 : n;
  return v.toFixed(digits);
}
