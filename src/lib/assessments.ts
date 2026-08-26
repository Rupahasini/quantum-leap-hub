import { chapters } from "@/lib/curriculum";

/* ---------------------------------- types --------------------------------- */

export type Assignment = {
  id: string;
  chapterId: string;
  title: string;
  brief: string;
  tasks: string[];
  starter: string;
  solution: string;
  stars: number;
};

export type TestQuestionKind = "mcq" | "algorithm" | "coding";

export type TestQuestion = {
  id: string;
  kind: TestQuestionKind;
  prompt: string;
  code?: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type Test = {
  id: string;
  title: string;
  scope: "Foundations" | "Quantum Computing" | "Quantum Machine Learning" | "Final";
  blurb: string;
  chapterIds: string[];
  questions: TestQuestion[];
};

/** Every test is scored out of 5 stars. */
export const TEST_MAX_STARS = 5;
export const ASSIGNMENT_STARS = 3;

/** Stars earned = proportional score, rounded down, with a 60% pass floor of 3. */
export function starsForScore(correct: number, total: number) {
  if (total === 0) return 0;
  const pct = correct / total;
  if (pct < 0.4) return 0;
  return Math.max(1, Math.min(TEST_MAX_STARS, Math.round(pct * TEST_MAX_STARS)));
}

/* ------------------------------- assignments ------------------------------ */

export const assignments: Assignment[] = [
  {
    id: "as-linear-algebra",
    chapterId: "linear-algebra",
    title: "Assignment 1 — State vector toolkit",
    brief:
      "Build a tiny helper module that normalises complex amplitude vectors, computes overlaps and tensors two single-qubit states into a two-qubit register.",
    tasks: [
      "Write normalise(psi) that returns psi / ‖psi‖ and raises on the zero vector.",
      "Write overlap(phi, psi) using the conjugate inner product ⟨φ|ψ⟩ and return |⟨φ|ψ⟩|².",
      "Write tensor(a, b) with np.kron and verify tensor(|0⟩, |1⟩) == [0, 1, 0, 0].",
      "Confirm the Bell state (|00⟩+|11⟩)/√2 cannot be written as tensor(a, b) for any a, b.",
    ],
    starter: `import numpy as np

def normalise(psi):
    ...

def overlap(phi, psi):
    ...

def tensor(a, b):
    ...`,
    solution: `import numpy as np

def normalise(psi):
    psi = np.asarray(psi, dtype=complex)
    n = np.linalg.norm(psi)
    if n == 0:
        raise ValueError("zero vector has no direction")
    return psi / n

def overlap(phi, psi):
    return abs(np.vdot(normalise(phi), normalise(psi))) ** 2

def tensor(a, b):
    return np.kron(np.asarray(a, dtype=complex), np.asarray(b, dtype=complex))

# Bell state is entangled: no product of 1-qubit states gives [1,0,0,1]/sqrt(2)
bell = np.array([1, 0, 0, 1]) / np.sqrt(2)
print(overlap(bell, tensor([1, 0], [1, 0])))  # 0.5 -> not a product state`,
    stars: ASSIGNMENT_STARS,
  },
  {
    id: "as-hermitian",
    chapterId: "hermitian",
    title: "Assignment 2 — Observable inspector",
    brief:
      "Classify matrices as Hermitian, unitary, both or neither, then predict measurement statistics from the spectral decomposition.",
    tasks: [
      "Write is_hermitian(A) and is_unitary(A) with np.allclose tolerances.",
      "Diagonalise Pauli-X with np.linalg.eigh and print eigenvalues and eigenvectors.",
      "Use the projectors |v⟩⟨v| to compute ⟨X⟩ for the state |0⟩ and explain the result.",
      "Show that the Hadamard is both Hermitian and unitary, so H² = I.",
    ],
    starter: `import numpy as np

X = np.array([[0, 1], [1, 0]], dtype=complex)
H = np.array([[1, 1], [1, -1]], dtype=complex) / np.sqrt(2)`,
    solution: `import numpy as np

def is_hermitian(A): return np.allclose(A, A.conj().T)
def is_unitary(A):   return np.allclose(A @ A.conj().T, np.eye(len(A)))

X = np.array([[0, 1], [1, 0]], dtype=complex)
vals, vecs = np.linalg.eigh(X)
psi = np.array([1, 0], dtype=complex)
exp = sum(l * abs(np.vdot(vecs[:, i], psi)) ** 2 for i, l in enumerate(vals))
print(vals, exp.real)   # [-1, 1] and <X> = 0 for |0>

H = np.array([[1, 1], [1, -1]], dtype=complex) / np.sqrt(2)
print(is_hermitian(H), is_unitary(H), np.allclose(H @ H, np.eye(2)))`,
    stars: ASSIGNMENT_STARS,
  },
  {
    id: "as-bloch",
    chapterId: "bloch",
    title: "Assignment 3 — Bloch sphere tracer",
    brief:
      "Convert statevectors to Bloch coordinates and track how RX, RY and RZ rotations move the point on the sphere.",
    tasks: [
      "Write bloch(psi) returning (x, y, z) from the Pauli expectation values.",
      "Verify bloch(|0⟩) = (0,0,1) and bloch(|+⟩) = (1,0,0).",
      "Apply RZ(π/2) to |+⟩ and show only the azimuth φ changes.",
      "Explain in two lines why a global phase leaves the Bloch vector unchanged.",
    ],
    starter: `import numpy as np

def bloch(psi):
    ...`,
    solution: `import numpy as np

I = np.eye(2); X = np.array([[0,1],[1,0]]); Y = np.array([[0,-1j],[1j,0]]); Z = np.diag([1,-1])

def bloch(psi):
    psi = np.asarray(psi, dtype=complex); psi = psi / np.linalg.norm(psi)
    return tuple(np.vdot(psi, P @ psi).real for P in (X, Y, Z))

def rz(t): return np.array([[np.exp(-1j*t/2), 0], [0, np.exp(1j*t/2)]])

plus = np.array([1, 1]) / np.sqrt(2)
print(bloch([1, 0]), bloch(plus), bloch(rz(np.pi/2) @ plus))
# a global phase e^{ia} cancels in <psi|P|psi>, so the vector is unchanged`,
    stars: ASSIGNMENT_STARS,
  },
  {
    id: "as-gates",
    chapterId: "gates",
    title: "Assignment 4 — Circuit composer",
    brief: "Compose multi-qubit unitaries by hand and reproduce them in the browser Circuit Lab.",
    tasks: [
      "Build the 4×4 matrix of CNOT (control q0) and verify it is unitary.",
      "Show that H⊗H followed by CZ followed by H⊗H equals CNOT up to relabelling.",
      "Create a 3-qubit GHZ circuit: H on q0, then CNOT 0→1 and CNOT 0→2.",
      "Recreate the GHZ circuit in the Circuit Lab and record the measured probabilities.",
    ],
    starter: `from qiskit import QuantumCircuit
qc = QuantumCircuit(3)`,
    solution: `from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

qc = QuantumCircuit(3)
qc.h(0); qc.cx(0, 1); qc.cx(0, 2)
print(Statevector(qc).probabilities_dict())  # {'000': 0.5, '111': 0.5}`,
    stars: ASSIGNMENT_STARS,
  },
  {
    id: "as-entanglement",
    chapterId: "entanglement",
    title: "Assignment 5 — Entanglement & noise lab",
    brief:
      "Quantify entanglement with the reduced density matrix and watch depolarising noise shrink the Bloch vector.",
    tasks: [
      "Build the Bell state and compute the partial trace over qubit 1.",
      "Show the reduced state is the maximally mixed I/2 (purity 0.5).",
      "Apply a depolarising channel with p = 0.3 to |+⟩ and report the new Bloch radius.",
      "Explain why measuring one Bell qubit fixes the other outcome instantly.",
    ],
    starter: `from qiskit.quantum_info import Statevector, partial_trace`,
    solution: `import numpy as np
from qiskit.quantum_info import Statevector, partial_trace, DensityMatrix

bell = Statevector.from_label('00').evolve(__import__('qiskit').circuit.library.HGate(), [0])
rho = partial_trace(DensityMatrix([1,0,0,1]/np.sqrt(2)), [1])
print(rho.data, np.trace(rho.data @ rho.data).real)  # I/2, purity 0.5

p = 0.3
r = 1 - p          # depolarising shrinks the Bloch radius by (1 - p)
print("radius", r)`,
    stars: ASSIGNMENT_STARS,
  },
  {
    id: "as-algorithms",
    chapterId: "algorithms",
    title: "Assignment 6 — Oracle algorithms",
    brief: "Implement Deutsch–Jozsa and one Grover iteration, then count the oracle calls saved.",
    tasks: [
      "Implement a balanced and a constant oracle for 3 input qubits.",
      "Run Deutsch–Jozsa and show a single query separates the two cases.",
      "Implement Grover's diffusion operator for 2 qubits and mark |11⟩.",
      "Report how many iterations are optimal for N = 16 and why (⌊π/4·√N⌋).",
    ],
    starter: `from qiskit import QuantumCircuit
n = 3`,
    solution: `from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector
import numpy as np

# Grover for 2 qubits, marking |11>
qc = QuantumCircuit(2)
qc.h([0, 1])
qc.cz(0, 1)                     # oracle marks |11>
qc.h([0, 1]); qc.z([0, 1]); qc.cz(0, 1); qc.h([0, 1])   # diffusion
print(Statevector(qc).probabilities_dict())   # |11> ~ 1.0
print(int(np.floor(np.pi / 4 * np.sqrt(16))))  # 3 iterations for N=16`,
    stars: ASSIGNMENT_STARS,
  },
  {
    id: "as-encoding",
    chapterId: "encoding",
    title: "Assignment 7 — Feature map benchmark",
    brief: "Encode the same dataset with angle, amplitude and ZZ feature maps and compare qubit cost.",
    tasks: [
      "Angle-encode a 4-feature sample with RY rotations on 4 qubits.",
      "Amplitude-encode the same sample on 2 qubits after normalising it.",
      "Build a ZZFeatureMap with 2 repetitions and count its two-qubit gates.",
      "Tabulate qubits vs circuit depth for each encoding and state the trade-off.",
    ],
    starter: `from qiskit.circuit.library import ZZFeatureMap
x = [0.4, 0.9, 0.1, 0.7]`,
    solution: `import numpy as np
from qiskit import QuantumCircuit
from qiskit.circuit.library import ZZFeatureMap

x = np.array([0.4, 0.9, 0.1, 0.7])

angle = QuantumCircuit(4)
for i, xi in enumerate(x):
    angle.ry(2 * np.arcsin(np.clip(xi, -1, 1)), i)

amp = QuantumCircuit(2)
amp.initialize(x / np.linalg.norm(x), [0, 1])

fm = ZZFeatureMap(feature_dimension=2, reps=2).decompose()
print(angle.depth(), amp.num_qubits, fm.count_ops())
# angle: n qubits, depth 1  |  amplitude: log2(n) qubits, deep state prep`,
    stars: ASSIGNMENT_STARS,
  },
  {
    id: "as-variational",
    chapterId: "variational",
    title: "Assignment 8 — VQE from scratch",
    brief: "Minimise ⟨H⟩ for a 1-qubit Hamiltonian with a parameter-shift gradient descent loop.",
    tasks: [
      "Define H = 0.5·Z + 0.3·X and an RY(θ)RZ(φ) ansatz.",
      "Write cost(θ, φ) as the analytic expectation value.",
      "Implement the parameter-shift rule ∂θ = [f(θ+π/2) − f(θ−π/2)]/2.",
      "Run 100 gradient steps and compare the minimum with the exact lowest eigenvalue.",
    ],
    starter: `import numpy as np
H = 0.5 * np.diag([1, -1]) + 0.3 * np.array([[0, 1], [1, 0]])`,
    solution: `import numpy as np
Z = np.diag([1, -1]); X = np.array([[0, 1], [1, 0]])
H = 0.5 * Z + 0.3 * X

def state(t, p):
    ry = np.array([[np.cos(t/2), -np.sin(t/2)], [np.sin(t/2), np.cos(t/2)]])
    rz = np.diag([np.exp(-1j*p/2), np.exp(1j*p/2)])
    return rz @ ry @ np.array([1, 0], dtype=complex)

def cost(t, p):
    s = state(t, p); return np.vdot(s, H @ s).real

t, p, lr = 0.1, 0.1, 0.3
for _ in range(200):
    gt = (cost(t + np.pi/2, p) - cost(t - np.pi/2, p)) / 2
    gp = (cost(t, p + np.pi/2) - cost(t, p - np.pi/2)) / 2
    t -= lr * gt; p -= lr * gp
print(cost(t, p), min(np.linalg.eigvalsh(H)))`,
    stars: ASSIGNMENT_STARS,
  },
  {
    id: "as-qnn",
    chapterId: "qnn",
    title: "Assignment 9 — Train a quantum classifier",
    brief: "Train a data re-uploading QNN on a 2-D moons subset and plot the loss curve.",
    tasks: [
      "Build a 1-qubit circuit with 3 re-uploading layers of RX(x)·RY(w)·RZ(w).",
      "Use ⟨Z⟩ as the model output with a binary cross-entropy loss.",
      "Train with parameter-shift gradients on 60 samples for 40 epochs.",
      "Report train/test accuracy and comment on whether re-uploading depth helped.",
    ],
    starter: `import pennylane as qml
dev = qml.device("default.qubit", wires=1)`,
    solution: `import pennylane as qml
from pennylane import numpy as np

dev = qml.device("default.qubit", wires=1)

@qml.qnode(dev)
def model(w, x):
    for layer in w:
        qml.RX(x[0], wires=0); qml.RY(layer[0], wires=0); qml.RZ(layer[1], wires=0)
        qml.RX(x[1], wires=0)
    return qml.expval(qml.PauliZ(0))

w = np.random.normal(0, 0.3, (3, 2), requires_grad=True)
opt = qml.AdamOptimizer(0.1)
def loss(w, X, y):
    p = (1 - np.stack([model(w, xi) for xi in X])) / 2
    p = np.clip(p, 1e-6, 1 - 1e-6)
    return -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))`,
    stars: ASSIGNMENT_STARS,
  },
  {
    id: "as-kernels",
    chapterId: "kernels",
    title: "Assignment 10 — Fidelity kernel QSVM",
    brief: "Compute a fidelity kernel matrix and feed it to scikit-learn's SVC as a precomputed kernel.",
    tasks: [
      "Build the fidelity kernel k(x,y) = |⟨φ(x)|φ(y)⟩|² with a ZZ feature map.",
      "Assemble the symmetric Gram matrix for 40 training samples.",
      "Fit SVC(kernel='precomputed') and score the held-out set.",
      "Compare against an RBF kernel and note where the quantum kernel wins or loses.",
    ],
    starter: `from sklearn.svm import SVC
from qiskit.circuit.library import ZZFeatureMap`,
    solution: `import numpy as np
from sklearn.svm import SVC
from qiskit.circuit.library import ZZFeatureMap
from qiskit.quantum_info import Statevector

fm = ZZFeatureMap(2, reps=2)
def phi(x): return Statevector(fm.assign_parameters(x))
def kernel(A, B): return np.array([[abs(phi(a).inner(phi(b)))**2 for b in B] for a in A])

K = kernel(Xtr, Xtr)
svc = SVC(kernel="precomputed").fit(K, ytr)
print(svc.score(kernel(Xte, Xtr), yte))`,
    stars: ASSIGNMENT_STARS,
  },
  {
    id: "as-qgan",
    chapterId: "qgan",
    title: "Assignment 11 — Quantum GAN sampler",
    brief: "Train a small qGAN to reproduce a target discrete distribution.",
    tasks: [
      "Define a 3-qubit parameterised generator with 2 entangling layers.",
      "Use a classical MLP discriminator on the sampled bitstring histogram.",
      "Alternate generator/discriminator updates for 200 steps.",
      "Plot generated vs target distribution and report the KL divergence.",
    ],
    starter: `import numpy as np
target = np.array([0.05, 0.1, 0.2, 0.3, 0.2, 0.1, 0.04, 0.01])`,
    solution: `import numpy as np
# KL divergence check after training
def kl(p, q):
    p, q = np.clip(p, 1e-9, 1), np.clip(q, 1e-9, 1)
    return float(np.sum(p * np.log(p / q)))
# generator probs come from Statevector(gen.assign_parameters(theta)).probabilities()
# alternate: d_step(real=target_samples, fake=gen_samples) then g_step(theta)`,
    stars: ASSIGNMENT_STARS,
  },
  {
    id: "as-hardware",
    chapterId: "hardware",
    title: "Assignment 12 — Mitigate and deploy",
    brief: "Run a circuit under a noise model, apply zero-noise extrapolation, and expose it as an API.",
    tasks: [
      "Simulate a 2-qubit circuit with a depolarising noise model and record ⟨ZZ⟩.",
      "Fold the circuit at scale factors 1, 2, 3 and linearly extrapolate to zero noise.",
      "Wrap the routine in a FastAPI POST /simulate endpoint with a Pydantic schema.",
      "Document expected latency and how you would cache repeated requests.",
    ],
    starter: `from fastapi import FastAPI
app = FastAPI()`,
    solution: `import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel

class Job(BaseModel):
    gates: list[str]
    shots: int = 1024

app = FastAPI()

@app.post("/simulate")
def simulate(job: Job):
    scales, vals = [1, 2, 3], [run(job, s) for s in [1, 2, 3]]
    zne = np.polyfit(scales, vals, 1)[1]   # intercept = zero-noise estimate
    return {"expectation": float(zne)}`,
    stars: ASSIGNMENT_STARS,
  },
];

export const assignmentByChapter = (chapterId: string) =>
  assignments.find((a) => a.chapterId === chapterId);

/* ---------------------------------- tests --------------------------------- */

export const tests: Test[] = [
  {
    id: "test-foundations",
    title: "Phase test — Foundations",
    scope: "Foundations",
    blurb: "Linear algebra, Hermitian/unitary operators and the Bloch sphere. 6 questions, up to 5 stars.",
    chapterIds: ["linear-algebra", "hermitian", "bloch"],
    questions: [
      {
        id: "tf-1",
        kind: "mcq",
        prompt: "How many complex amplitudes describe a 6-qubit register?",
        options: ["12", "36", "64", "128"],
        answer: 2,
        explanation: "2^6 = 64 amplitudes.",
      },
      {
        id: "tf-2",
        kind: "mcq",
        prompt: "Which statement about a unitary matrix U is always true?",
        options: [
          "U is Hermitian",
          "U preserves the norm of any state",
          "U has only real entries",
          "U is diagonal in the computational basis",
        ],
        answer: 1,
        explanation: "U†U = I means ‖Uψ‖ = ‖ψ‖ — norm preservation.",
      },
      {
        id: "tf-3",
        kind: "coding",
        prompt: "What does this snippet print?",
        code: `import numpy as np
psi = np.array([3, 4], dtype=complex)
psi = psi / np.linalg.norm(psi)
print(round(abs(psi[0])**2, 2))`,
        options: ["0.36", "0.6", "0.64", "1.0"],
        answer: 0,
        explanation: "‖psi‖ = 5, so amplitude 3/5 and probability 0.36.",
      },
      {
        id: "tf-4",
        kind: "algorithm",
        prompt: "Order the steps to compute ⟨X⟩ for a state |ψ⟩ from its spectral decomposition.",
        options: [
          "Diagonalise X → project |ψ⟩ on each eigenvector → weight eigenvalues by |overlap|²",
          "Measure in Z → average the bits → multiply by 2",
          "Normalise X → multiply by |ψ⟩ → take the trace",
          "Invert X → apply to |ψ⟩ → take the real part",
        ],
        answer: 0,
        explanation: "⟨X⟩ = Σ λᵢ|⟨vᵢ|ψ⟩|² — diagonalise, project, weight.",
      },
      {
        id: "tf-5",
        kind: "mcq",
        prompt: "On the Bloch sphere, the azimuthal angle φ controls…",
        options: [
          "Measurement probabilities in the Z basis",
          "The relative phase between |0⟩ and |1⟩",
          "The purity of the state",
          "The number of qubits",
        ],
        answer: 1,
        explanation: "θ sets probabilities; φ sets the relative phase.",
      },
      {
        id: "tf-6",
        kind: "mcq",
        prompt: "A Bloch vector with radius 0.5 describes…",
        options: ["An impossible state", "A pure state", "A mixed state", "An entangled pair"],
        answer: 2,
        explanation: "Radius < 1 means the single-qubit state is mixed.",
      },
    ],
  },
  {
    id: "test-quantum-computing",
    title: "Phase test — Quantum Computing",
    scope: "Quantum Computing",
    blurb: "Gates, entanglement, measurement, noise and the core oracle algorithms. 6 questions, up to 5 stars.",
    chapterIds: ["gates", "entanglement", "algorithms"],
    questions: [
      {
        id: "tq-1",
        kind: "mcq",
        prompt: "H applied twice to any state is equivalent to…",
        options: ["X", "Z", "Identity", "A measurement"],
        answer: 2,
        explanation: "H is Hermitian and unitary, so H² = I.",
      },
      {
        id: "tq-2",
        kind: "coding",
        prompt: "Which measurement histogram does this circuit produce?",
        code: `qc = QuantumCircuit(2)
qc.h(0)
qc.cx(0, 1)`,
        options: [
          "{'00': 0.5, '11': 0.5}",
          "{'01': 0.5, '10': 0.5}",
          "{'00': 0.25, '01': 0.25, '10': 0.25, '11': 0.25}",
          "{'00': 1.0}",
        ],
        answer: 0,
        explanation: "That is the Bell state (|00⟩+|11⟩)/√2.",
      },
      {
        id: "tq-3",
        kind: "algorithm",
        prompt: "Grover's search on N items needs roughly how many oracle calls?",
        options: ["log N", "√N", "N", "N log N"],
        answer: 1,
        explanation: "≈ (π/4)√N iterations — a quadratic speed-up.",
      },
      {
        id: "tq-4",
        kind: "algorithm",
        prompt: "Correct order of one Grover iteration?",
        options: [
          "Diffusion → oracle → measure",
          "Oracle phase flip → diffusion (inversion about the mean)",
          "Measure → oracle → Hadamard",
          "Hadamard → measure → oracle",
        ],
        answer: 1,
        explanation: "Mark the target with a phase flip, then amplify with diffusion.",
      },
      {
        id: "tq-5",
        kind: "mcq",
        prompt: "Deutsch–Jozsa decides constant vs balanced with how many oracle queries?",
        options: ["1", "2", "n", "2^{n-1}+1"],
        answer: 0,
        explanation: "A single query suffices, versus 2^{n−1}+1 classically.",
      },
      {
        id: "tq-6",
        kind: "mcq",
        prompt: "Depolarising noise on a single qubit primarily…",
        options: [
          "Rotates the Bloch vector",
          "Shrinks the Bloch vector toward the centre",
          "Increases the state purity",
          "Adds more qubits",
        ],
        answer: 1,
        explanation: "It mixes the state toward I/2, shrinking the Bloch radius.",
      },
    ],
  },
  {
    id: "test-qml",
    title: "Phase test — Quantum Machine Learning",
    scope: "Quantum Machine Learning",
    blurb: "Encodings, variational training, QNNs, kernels, qGANs and hardware realities. 7 questions, up to 5 stars.",
    chapterIds: ["encoding", "variational", "qnn", "kernels", "qgan", "hardware"],
    questions: [
      {
        id: "tm-1",
        kind: "mcq",
        prompt: "Amplitude encoding of 1024 features needs how many qubits?",
        options: ["10", "32", "512", "1024"],
        answer: 0,
        explanation: "log₂(1024) = 10 qubits, at the cost of deep state preparation.",
      },
      {
        id: "tm-2",
        kind: "algorithm",
        prompt: "The parameter-shift rule computes a gradient component as…",
        options: [
          "[f(θ+π/2) − f(θ−π/2)] / 2",
          "[f(θ+ε) − f(θ)] / ε",
          "f(θ)·log f(θ)",
          "The trace of the Hessian",
        ],
        answer: 0,
        explanation: "Exact analytic gradient for gates with two eigenvalues.",
      },
      {
        id: "tm-3",
        kind: "mcq",
        prompt: "A barren plateau shows up as…",
        options: [
          "Exploding gradients",
          "Gradients vanishing exponentially with qubit count",
          "Non-unitary gates",
          "Too few shots per circuit",
        ],
        answer: 1,
        explanation: "Random deep ansätze concentrate, killing the gradient signal.",
      },
      {
        id: "tm-4",
        kind: "coding",
        prompt: "In a QSVM, what goes into SVC(kernel='precomputed').fit(...)?",
        code: `K = fidelity_kernel(X_train, X_train)
svc = SVC(kernel="precomputed").fit(?, y_train)`,
        options: ["X_train", "K", "y_train", "the feature map circuit"],
        answer: 1,
        explanation: "A precomputed kernel expects the Gram matrix K.",
      },
      {
        id: "tm-5",
        kind: "mcq",
        prompt: "Data re-uploading increases model expressivity by…",
        options: [
          "Adding more qubits per feature",
          "Encoding the same input repeatedly between trainable layers",
          "Measuring in more bases",
          "Using a classical optimiser",
        ],
        answer: 1,
        explanation: "Repeated encoding raises the Fourier degree of the model.",
      },
      {
        id: "tm-6",
        kind: "mcq",
        prompt: "In a qGAN, the generator is…",
        options: [
          "A classical MLP",
          "A parameterised quantum circuit sampled for bitstrings",
          "The noise model",
          "The kernel matrix",
        ],
        answer: 1,
        explanation: "Sampling the PQC's output distribution produces fake data.",
      },
      {
        id: "tm-7",
        kind: "algorithm",
        prompt: "Zero-noise extrapolation works by…",
        options: [
          "Running at amplified noise levels and extrapolating back to zero",
          "Adding error-correcting qubits",
          "Increasing shot count only",
          "Removing entangling gates",
        ],
        answer: 0,
        explanation: "Scale the noise (e.g. gate folding), fit, extrapolate to λ = 0.",
      },
    ],
  },
  {
    id: "test-final",
    title: "Final exam — Full curriculum",
    scope: "Final",
    blurb: "8 mixed MCQ, algorithm and coding questions spanning all 12 chapters. Up to 5 stars.",
    chapterIds: chapters.map((c) => c.id),
    questions: [
      {
        id: "tx-1",
        kind: "mcq",
        prompt: "Which is NOT a valid quantum gate?",
        options: ["Hadamard", "CNOT", "Projection onto |0⟩", "Toffoli"],
        answer: 2,
        explanation: "A projection is not unitary — it is a measurement operator.",
      },
      {
        id: "tx-2",
        kind: "coding",
        prompt: "What is printed?",
        code: `import numpy as np
bell = np.array([1, 0, 0, 1]) / np.sqrt(2)
print(round(float(abs(bell[1])**2), 2))`,
        options: ["0.0", "0.5", "0.71", "1.0"],
        answer: 0,
        explanation: "|01⟩ has zero amplitude in the Bell state.",
      },
      {
        id: "tx-3",
        kind: "algorithm",
        prompt: "Correct pipeline for a variational quantum classifier?",
        options: [
          "Encode data → parameterised ansatz → measure observable → classical optimiser update",
          "Measure → encode → optimise → ansatz",
          "Ansatz → measure → encode → optimise",
          "Encode → measure → ansatz → optimise",
        ],
        answer: 0,
        explanation: "Encode, evolve, measure, then update parameters classically.",
      },
      {
        id: "tx-4",
        kind: "mcq",
        prompt: "Angle encoding of n features uses…",
        options: ["log₂ n qubits", "n qubits with depth ~1", "n² qubits", "1 qubit always"],
        answer: 1,
        explanation: "One rotation per feature on n qubits — shallow but qubit-hungry.",
      },
      {
        id: "tx-5",
        kind: "mcq",
        prompt: "Entanglement in a two-qubit state can be detected by…",
        options: [
          "A pure reduced density matrix",
          "A mixed reduced density matrix",
          "Real amplitudes only",
          "A diagonal unitary",
        ],
        answer: 1,
        explanation: "Tracing out one qubit of an entangled pure state gives a mixed state.",
      },
      {
        id: "tx-6",
        kind: "coding",
        prompt: "Which line makes the fidelity kernel symmetric and positive semi-definite?",
        code: `k = abs(inner(phi(x), phi(y))) ** ?`,
        options: ["1", "2", "0.5", "3"],
        answer: 1,
        explanation: "|⟨φ(x)|φ(y)⟩|² is a valid PSD kernel.",
      },
      {
        id: "tx-7",
        kind: "algorithm",
        prompt: "Best first response to a barren plateau?",
        options: [
          "Deepen the random ansatz",
          "Use a problem-inspired shallow ansatz and smart initialisation",
          "Reduce shots",
          "Switch to amplitude encoding",
        ],
        answer: 1,
        explanation: "Structure and local cost functions restore usable gradients.",
      },
      {
        id: "tx-8",
        kind: "mcq",
        prompt: "For deployment, a hybrid QML service typically exposes…",
        options: [
          "A Python HTTP API (e.g. FastAPI) wrapping the quantum backend",
          "Direct browser access to the QPU",
          "A SQL interface to the QPU",
          "Nothing — QML cannot be served",
        ],
        answer: 0,
        explanation: "The frontend calls a Python service that queues circuits on the backend.",
      },
    ],
  },
];

export const testById = (id: string) => tests.find((t) => t.id === id);
