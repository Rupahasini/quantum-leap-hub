export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type Kata = { id: string; title: string; task: string; hint: string; stars: number };

export type Chapter = {
  id: string;
  index: number;
  title: string;
  track: "Foundations" | "Quantum Computing" | "Quantum Machine Learning";
  summary: string;
  duration: string;
  objectives: string[];
  concepts: { term: string; detail: string }[];
  code: { language: string; label: string; snippet: string };
  quiz: QuizQuestion[];
  kata: Kata;
};

export const QUIZ_STARS = 2;

export const chapters: Chapter[] = [
  {
    id: "linear-algebra",
    index: 1,
    title: "Linear Algebra for Quantum States",
    track: "Foundations",
    summary:
      "Complex vector spaces, inner products and Dirac notation — the grammar every quantum learning algorithm is written in.",
    duration: "3h 20m",
    objectives: [
      "Write kets, bras and inner products in Dirac notation",
      "Normalise a complex amplitude vector",
      "Compute tensor products for multi-qubit registers",
    ],
    concepts: [
      { term: "Ket |ψ⟩", detail: "A column vector in a complex Hilbert space with unit norm." },
      { term: "Inner product ⟨φ|ψ⟩", detail: "Overlap between states; its modulus squared is a transition probability." },
      { term: "Tensor product", detail: "Composes registers: an n-qubit state lives in 2^n dimensions." },
    ],
    code: {
      language: "python",
      label: "Normalising a state with NumPy",
      snippet: `import numpy as np

psi = np.array([1+1j, 2-1j], dtype=complex)
psi = psi / np.linalg.norm(psi)
print(psi, np.vdot(psi, psi).real)  # -> 1.0`,
    },
    quiz: [
      {
        id: "la-1",
        prompt: "What is the dimension of the Hilbert space of a 5-qubit register?",
        options: ["10", "25", "32", "5"],
        answer: 2,
        explanation: "Each qubit doubles the dimension: 2^5 = 32 complex amplitudes.",
      },
      {
        id: "la-2",
        prompt: "⟨ψ|ψ⟩ = 1 expresses which physical requirement?",
        options: [
          "The state is entangled",
          "Probabilities sum to one",
          "The state is real-valued",
          "The state is separable",
        ],
        answer: 1,
        explanation: "Normalisation guarantees the measurement probabilities sum to 1.",
      },
    ],
    kata: {
      id: "kata-la",
      title: "Kata: Bell state by hand",
      task: "Write the amplitude vector of (|00⟩ + |11⟩)/√2 as four complex numbers.",
      hint: "Only the first and last amplitudes are non-zero, each equal to 1/√2.",
      stars: 3,
    },
  },
  {
    id: "hermitian",
    index: 2,
    title: "Hermitian & Unitary Matrices",
    track: "Foundations",
    summary:
      "Observables are Hermitian, evolution is unitary. Eigen-decomposition is the workhorse behind every measurement statistic.",
    duration: "3h 05m",
    objectives: [
      "Test a matrix for Hermiticity and unitarity",
      "Diagonalise a Pauli operator",
      "Relate eigenvalues to measurement outcomes",
    ],
    concepts: [
      { term: "Hermitian A = A†", detail: "Real eigenvalues; models measurable observables such as energy." },
      { term: "Unitary U†U = I", detail: "Norm-preserving evolution — every quantum gate is unitary." },
      { term: "Spectral theorem", detail: "A = Σ λᵢ |vᵢ⟩⟨vᵢ| gives the measurement projectors directly." },
    ],
    code: {
      language: "python",
      label: "Checking Hermiticity",
      snippet: `import numpy as np

Y = np.array([[0, -1j], [1j, 0]])
print(np.allclose(Y, Y.conj().T))          # Hermitian
print(np.allclose(Y @ Y.conj().T, np.eye(2)))  # also unitary
print(np.linalg.eigvalsh(Y))               # [-1, 1]`,
    },
    quiz: [
      {
        id: "her-1",
        prompt: "Eigenvalues of a Hermitian matrix are always…",
        options: ["Positive", "Real", "Complex", "Integers"],
        answer: 1,
        explanation: "Hermiticity forces a real spectrum, which is why observables are Hermitian.",
      },
      {
        id: "her-2",
        prompt: "Which property makes a matrix a valid quantum gate?",
        options: ["Symmetric", "Unitary", "Invertible only", "Diagonal"],
        answer: 1,
        explanation: "Gates must preserve the norm of the state, i.e. be unitary.",
      },
    ],
    kata: {
      id: "kata-her",
      title: "Kata: Prove Z is unitary",
      task: "Show Z†Z = I for the Pauli-Z matrix and state its eigenvalues.",
      hint: "Z is real diagonal with entries +1 and −1.",
      stars: 3,
    },
  },
  {
    id: "bloch",
    index: 3,
    title: "Qubits and the Bloch Sphere",
    track: "Foundations",
    summary:
      "Geometric intuition for single-qubit states: polar angle sets probability, azimuth sets relative phase.",
    duration: "2h 45m",
    objectives: [
      "Map |ψ⟩ = cos(θ/2)|0⟩ + e^{iφ}sin(θ/2)|1⟩ to a point on the sphere",
      "Read rotation gates as sphere rotations",
      "Distinguish global from relative phase",
    ],
    concepts: [
      { term: "Polar angle θ", detail: "Controls the |0⟩/|1⟩ measurement probabilities." },
      { term: "Azimuth φ", detail: "Relative phase — invisible to Z-measurement, crucial for interference." },
      { term: "Mixed states", detail: "Points inside the sphere; radius < 1 signals decoherence or entanglement." },
    ],
    code: {
      language: "python",
      label: "Bloch vector from a statevector",
      snippet: `from qiskit.quantum_info import Statevector, DensityMatrix
import numpy as np

sv = Statevector.from_label('+')
rho = DensityMatrix(sv).data
paulis = [np.array([[0,1],[1,0]]), np.array([[0,-1j],[1j,0]]), np.diag([1,-1])]
print([np.trace(rho @ p).real for p in paulis])  # [1, 0, 0]`,
    },
    quiz: [
      {
        id: "bl-1",
        prompt: "Where does the |+⟩ state sit on the Bloch sphere?",
        options: ["North pole", "South pole", "+X axis", "−Y axis"],
        answer: 2,
        explanation: "|+⟩ = (|0⟩+|1⟩)/√2 points along +X.",
      },
      {
        id: "bl-2",
        prompt: "A Bloch vector of length 0.5 describes…",
        options: ["An impossible state", "A pure state", "A mixed state", "An entangled pair"],
        answer: 2,
        explanation: "Only unit-length vectors are pure; shorter vectors are mixed.",
      },
    ],
    kata: {
      id: "kata-bloch",
      title: "Kata: Rotate to |−⟩",
      task: "Find a two-gate sequence taking |0⟩ to |−⟩ and give the resulting Bloch vector.",
      hint: "X then H, or H then Z.",
      stars: 3,
    },
  },
  {
    id: "gates",
    index: 4,
    title: "Quantum Gates & Circuit Composition",
    track: "Quantum Computing",
    summary:
      "Universal gate sets, circuit depth, and how to read a circuit diagram as a matrix product applied right-to-left.",
    duration: "3h 30m",
    objectives: [
      "Build circuits from H, X, Y, Z, S, T and CNOT",
      "Reason about circuit depth versus decoherence",
      "Decompose an arbitrary single-qubit unitary",
    ],
    concepts: [
      { term: "Universality", detail: "{H, T, CNOT} approximates any unitary to arbitrary precision." },
      { term: "Circuit depth", detail: "Number of sequential layers; the practical limit on NISQ devices." },
      { term: "Transpilation", detail: "Mapping logical gates onto a device's native basis and connectivity." },
    ],
    code: {
      language: "python",
      label: "Bell pair in Qiskit",
      snippet: `from qiskit import QuantumCircuit

qc = QuantumCircuit(2)
qc.h(0)
qc.cx(0, 1)
qc.measure_all()
print(qc.draw())`,
    },
    quiz: [
      {
        id: "g-1",
        prompt: "Applying H twice to |0⟩ gives…",
        options: ["|1⟩", "|+⟩", "|0⟩", "A mixed state"],
        answer: 2,
        explanation: "H is its own inverse: H² = I.",
      },
      {
        id: "g-2",
        prompt: "Which gate set is universal?",
        options: ["{X, Z}", "{H, T, CNOT}", "{S, Z}", "{CNOT}"],
        answer: 1,
        explanation: "Clifford+T with CNOT is the standard universal set.",
      },
    ],
    kata: {
      id: "kata-gates",
      title: "Kata: GHZ state",
      task: "Build a 3-qubit circuit producing (|000⟩ + |111⟩)/√2 in the simulator.",
      hint: "One Hadamard and two CNOTs fanning out from qubit 0.",
      stars: 4,
    },
  },
  {
    id: "entanglement",
    index: 5,
    title: "Entanglement, Measurement & Noise",
    track: "Quantum Computing",
    summary:
      "Bell inequalities, partial trace, shot noise and the error channels that constrain every real QML experiment.",
    duration: "3h 10m",
    objectives: [
      "Compute reduced density matrices",
      "Estimate shots needed for a target precision",
      "Name the dominant NISQ noise channels",
    ],
    concepts: [
      { term: "Partial trace", detail: "Discards a subsystem; entangled pure states become mixed marginals." },
      { term: "Shot noise", detail: "Estimator error scales as 1/√N — expensive for gradient estimation." },
      { term: "Decoherence", detail: "T1 amplitude damping and T2 dephasing bound usable circuit depth." },
    ],
    code: {
      language: "python",
      label: "Entanglement entropy",
      snippet: `from qiskit.quantum_info import Statevector, partial_trace, entropy

bell = Statevector.from_label('00').evolve(  # H then CX
    __import__('qiskit').QuantumCircuit(2).compose(None) if False else None) if False else None
sv = Statevector([1/2**0.5, 0, 0, 1/2**0.5])
print(entropy(partial_trace(sv, [1])))  # 1.0 bit`,
    },
    quiz: [
      {
        id: "e-1",
        prompt: "Entanglement entropy of a Bell state's single-qubit marginal is…",
        options: ["0", "0.5", "1 bit", "2 bits"],
        answer: 2,
        explanation: "The marginal is maximally mixed, giving exactly one bit of entropy.",
      },
      {
        id: "e-2",
        prompt: "To halve the statistical error of an expectation value you must…",
        options: ["Halve the shots", "Double the shots", "Quadruple the shots", "Add one qubit"],
        answer: 2,
        explanation: "Error ∝ 1/√N, so 4× the shots halves the error.",
      },
    ],
    kata: {
      id: "kata-ent",
      title: "Kata: Break separability",
      task: "Show that (|00⟩+|11⟩)/√2 cannot be written as a product of two single-qubit states.",
      hint: "Assume a product form and derive a contradiction from the missing |01⟩ term.",
      stars: 4,
    },
  },
  {
    id: "algorithms",
    index: 6,
    title: "Core Quantum Algorithms",
    track: "Quantum Computing",
    summary:
      "Deutsch–Jozsa, Grover and phase estimation — the interference patterns reused inside quantum learning routines.",
    duration: "4h 00m",
    objectives: [
      "Explain amplitude amplification geometrically",
      "Use QPE as a subroutine for eigenvalue extraction",
      "Identify where speedups genuinely come from",
    ],
    concepts: [
      { term: "Oracle", detail: "A unitary encoding the problem; query complexity is the resource counted." },
      { term: "Grover diffusion", detail: "Reflection about the mean giving a quadratic search speedup." },
      { term: "QPE", detail: "Extracts eigenphases; underlies HHL and quantum linear-algebra kernels." },
    ],
    code: {
      language: "python",
      label: "Grover iterations",
      snippet: `import math
N, marked = 2**10, 1
iterations = math.floor(math.pi / 4 * math.sqrt(N / marked))
print(iterations)  # ~25 instead of ~512 classical guesses`,
    },
    quiz: [
      {
        id: "al-1",
        prompt: "Grover's algorithm provides which speedup?",
        options: ["Exponential", "Quadratic", "Linear", "None"],
        answer: 1,
        explanation: "O(√N) queries versus O(N) classically.",
      },
      {
        id: "al-2",
        prompt: "Quantum phase estimation returns…",
        options: [
          "A measurement basis",
          "An eigenphase of a unitary",
          "A gradient",
          "A density matrix",
        ],
        answer: 1,
        explanation: "QPE estimates φ in U|u⟩ = e^{2πiφ}|u⟩.",
      },
    ],
    kata: {
      id: "kata-alg",
      title: "Kata: Count the oracle calls",
      task: "For a 1M-item unstructured search, how many Grover iterations are optimal?",
      hint: "π/4 · √N with N = 10^6.",
      stars: 4,
    },
  },
  {
    id: "encoding",
    index: 7,
    title: "Data Encoding & Feature Maps",
    track: "Quantum Machine Learning",
    summary:
      "Basis, angle and amplitude encoding — the step where classical data becomes a quantum state, and where most QML advantage is won or lost.",
    duration: "3h 40m",
    objectives: [
      "Choose an encoding for a given data shape and qubit budget",
      "Implement amplitude encoding with normalisation",
      "Design a ZZ feature map with entangling layers",
    ],
    concepts: [
      { term: "Angle encoding", detail: "One feature per rotation angle; shallow but linear in qubits." },
      { term: "Amplitude encoding", detail: "2^n features in n qubits; exponentially compact, costly to prepare." },
      { term: "Feature map expressivity", detail: "Hard-to-simulate maps enable kernels no classical model reproduces cheaply." },
    ],
    code: {
      language: "python",
      label: "Amplitude encoding in PennyLane",
      snippet: `import pennylane as qml
import numpy as np

dev = qml.device("default.qubit", wires=2)

@qml.qnode(dev)
def circuit(x):
    qml.AmplitudeEmbedding(x, wires=[0, 1], normalize=True)
    return qml.state()

print(circuit(np.array([1.0, 2.0, 3.0, 4.0])))`,
    },
    quiz: [
      {
        id: "en-1",
        prompt: "How many features fit into 8 qubits with amplitude encoding?",
        options: ["8", "64", "256", "16"],
        answer: 2,
        explanation: "2^8 = 256 amplitudes (after normalisation).",
      },
      {
        id: "en-2",
        prompt: "The main drawback of amplitude encoding is…",
        options: [
          "It needs too many qubits",
          "State preparation depth",
          "It destroys entanglement",
          "It only works for binary data",
        ],
        answer: 1,
        explanation: "Preparing an arbitrary amplitude vector can require exponentially deep circuits.",
      },
    ],
    kata: {
      id: "kata-enc",
      title: "Kata: Normalise a feature row",
      task: "Encode [3, 4] as a single-qubit amplitude state and give both amplitudes.",
      hint: "Divide by the L2 norm 5 → [0.6, 0.8].",
      stars: 3,
    },
  },
  {
    id: "variational",
    index: 8,
    title: "Variational Quantum Algorithms",
    track: "Quantum Machine Learning",
    summary:
      "The hybrid loop: parameterised circuit, cost Hamiltonian, classical optimiser. VQE and QAOA as the canonical examples.",
    duration: "4h 15m",
    objectives: [
      "Assemble an ansatz with entangling layers",
      "Compute gradients with the parameter-shift rule",
      "Diagnose barren plateaus",
    ],
    concepts: [
      { term: "Ansatz", detail: "Trainable circuit; hardware-efficient vs. problem-inspired designs." },
      { term: "Parameter-shift rule", detail: "Exact analytic gradients from two extra circuit evaluations." },
      { term: "Barren plateau", detail: "Exponentially vanishing gradients in deep random circuits." },
    ],
    code: {
      language: "python",
      label: "Parameter-shift gradient",
      snippet: `import pennylane as qml
from pennylane import numpy as np

dev = qml.device("default.qubit", wires=1)

@qml.qnode(dev, diff_method="parameter-shift")
def cost(theta):
    qml.RY(theta, wires=0)
    return qml.expval(qml.PauliZ(0))

theta = np.array(0.3, requires_grad=True)
print(qml.grad(cost)(theta))`,
    },
    quiz: [
      {
        id: "v-1",
        prompt: "The parameter-shift rule computes a gradient using…",
        options: [
          "Finite differences",
          "Two shifted circuit evaluations",
          "Backpropagation through gates",
          "Automatic sampling",
        ],
        answer: 1,
        explanation: "Evaluating at θ ± π/2 yields the exact derivative for common gates.",
      },
      {
        id: "v-2",
        prompt: "Barren plateaus make training hard because…",
        options: [
          "Gradients vanish exponentially with qubits",
          "Circuits become non-unitary",
          "The optimiser overfits",
          "Measurements are biased",
        ],
        answer: 0,
        explanation: "Random deep ansätze concentrate the cost landscape, killing gradient signal.",
      },
    ],
    kata: {
      id: "kata-vqa",
      title: "Kata: Minimise ⟨Z⟩",
      task: "Which RY angle minimises ⟨Z⟩ on a single qubit, and what is the minimum value?",
      hint: "cos(θ) is minimised at θ = π.",
      stars: 4,
    },
  },
  {
    id: "qnn",
    index: 9,
    title: "Quantum Neural Networks",
    track: "Quantum Machine Learning",
    summary:
      "Layered QNNs, data re-uploading, expressivity measures and how quantum layers plug into PyTorch autograd.",
    duration: "4h 30m",
    objectives: [
      "Build a data re-uploading classifier",
      "Wrap a QNode as a Torch layer",
      "Measure expressivity and entangling capability",
    ],
    concepts: [
      { term: "Data re-uploading", detail: "Interleaving encoding and trainable layers boosts expressivity on few qubits." },
      { term: "Hybrid autograd", detail: "TorchLayer/KerasLayer make quantum layers differentiable end-to-end." },
      { term: "Effective dimension", detail: "Information-geometry measure of a model's trainable capacity." },
    ],
    code: {
      language: "python",
      label: "Quantum layer inside PyTorch",
      snippet: `import pennylane as qml, torch

dev = qml.device("default.qubit", wires=4)

@qml.qnode(dev, interface="torch")
def qnode(inputs, weights):
    qml.AngleEmbedding(inputs, wires=range(4))
    qml.BasicEntanglerLayers(weights, wires=range(4))
    return [qml.expval(qml.PauliZ(w)) for w in range(4)]

qlayer = qml.qnn.TorchLayer(qnode, {"weights": (3, 4)})
model = torch.nn.Sequential(qlayer, torch.nn.Linear(4, 2))`,
    },
    quiz: [
      {
        id: "q-1",
        prompt: "Data re-uploading improves a QNN by…",
        options: [
          "Adding more qubits",
          "Repeating encoding between trainable layers",
          "Removing entanglement",
          "Increasing shots",
        ],
        answer: 1,
        explanation: "Repeated encoding raises the Fourier degree the model can represent.",
      },
      {
        id: "q-2",
        prompt: "A hybrid QNN is trained with…",
        options: [
          "Only quantum optimisation",
          "A classical optimiser on quantum gradients",
          "Grover search",
          "Annealing only",
        ],
        answer: 1,
        explanation: "The classical optimiser updates parameters using quantum-evaluated gradients.",
      },
    ],
    kata: {
      id: "kata-qnn",
      title: "Kata: Count parameters",
      task: "How many weights does BasicEntanglerLayers with 3 layers on 4 wires hold?",
      hint: "One rotation per wire per layer.",
      stars: 4,
    },
  },
  {
    id: "kernels",
    index: 10,
    title: "Quantum Kernels & QSVM",
    track: "Quantum Machine Learning",
    summary:
      "Fidelity kernels, kernel-target alignment, and training an SVM whose Gram matrix is measured on hardware.",
    duration: "3h 50m",
    objectives: [
      "Estimate a fidelity kernel entry with a swap test",
      "Assemble a Gram matrix for scikit-learn",
      "Evaluate kernel alignment against labels",
    ],
    concepts: [
      { term: "Fidelity kernel", detail: "K(x,y) = |⟨φ(x)|φ(y)⟩|² measured by inverse-circuit overlap." },
      { term: "Kernel alignment", detail: "Correlation between the Gram matrix and the ideal label kernel." },
      { term: "Concentration", detail: "Over-expressive maps drive kernels toward the identity — useless." },
    ],
    code: {
      language: "python",
      label: "QSVM with a precomputed kernel",
      snippet: `from sklearn.svm import SVC
import numpy as np

K_train = np.array(quantum_gram(X_train, X_train))  # measured on device
clf = SVC(kernel="precomputed").fit(K_train, y_train)
print(clf.score(np.array(quantum_gram(X_test, X_train)), y_test))`,
    },
    quiz: [
      {
        id: "k-1",
        prompt: "A quantum fidelity kernel entry is estimated from…",
        options: [
          "The state vector directly",
          "Probability of measuring all-zeros after φ(y)†φ(x)",
          "The circuit depth",
          "The parameter count",
        ],
        answer: 1,
        explanation: "Running the inverse feature map and reading the |0…0⟩ probability gives |⟨φ(x)|φ(y)⟩|².",
      },
      {
        id: "k-2",
        prompt: "Kernel concentration means the Gram matrix approaches…",
        options: ["All ones", "The identity", "A random matrix", "A rank-1 matrix"],
        answer: 1,
        explanation: "Off-diagonal similarities vanish, so the SVM cannot generalise.",
      },
    ],
    kata: {
      id: "kata-kernel",
      title: "Kata: Symmetry check",
      task: "State two properties any valid kernel matrix must satisfy.",
      hint: "Symmetric and positive semi-definite.",
      stars: 4,
    },
  },
  {
    id: "qgan",
    index: 11,
    title: "Quantum GANs & Generative Models",
    track: "Quantum Machine Learning",
    summary:
      "Quantum generators against classical discriminators, Born machines, and loading distributions for finance simulations.",
    duration: "4h 05m",
    objectives: [
      "Set up a qGAN adversarial loop",
      "Train a Born machine with MMD loss",
      "Load a learned distribution for amplitude estimation",
    ],
    concepts: [
      { term: "Quantum generator", detail: "Parameterised circuit whose measurement distribution is the sample source." },
      { term: "Born machine", detail: "Generative model trained directly on the Born-rule probabilities." },
      { term: "Mode collapse", detail: "Adversarial instability also appears in the hybrid quantum setting." },
    ],
    code: {
      language: "python",
      label: "qGAN generator sampling",
      snippet: `import pennylane as qml
dev = qml.device("default.qubit", wires=3, shots=1000)

@qml.qnode(dev)
def generator(weights):
    qml.StronglyEntanglingLayers(weights, wires=range(3))
    return qml.sample()`,
    },
    quiz: [
      {
        id: "gan-1",
        prompt: "In a typical qGAN the discriminator is…",
        options: ["Always quantum", "Usually a classical neural net", "A kernel machine", "An oracle"],
        answer: 1,
        explanation: "Hybrid qGANs pair a quantum generator with a classical discriminator.",
      },
      {
        id: "gan-2",
        prompt: "A Born machine is trained on…",
        options: [
          "Amplitudes directly",
          "Measurement probabilities via a distribution loss",
          "Gradient-free annealing",
          "Classical backprop through gates",
        ],
        answer: 1,
        explanation: "Losses such as MMD compare sampled and target probability distributions.",
      },
    ],
    kata: {
      id: "kata-qgan",
      title: "Kata: Distribution loading",
      task: "Name one financial task where loading a distribution into amplitudes pays off.",
      hint: "Think derivative pricing with amplitude estimation.",
      stars: 4,
    },
  },
  {
    id: "hardware",
    index: 12,
    title: "Hardware, Error Mitigation & Deployment",
    track: "Quantum Machine Learning",
    summary:
      "Running QML on real devices: transpilation, zero-noise extrapolation, readout mitigation, and MLOps for hybrid jobs.",
    duration: "3h 45m",
    objectives: [
      "Transpile to a real backend's coupling map",
      "Apply zero-noise extrapolation and readout correction",
      "Design a reproducible hybrid training pipeline",
    ],
    concepts: [
      { term: "ZNE", detail: "Amplify noise deliberately, extrapolate the observable back to the zero-noise limit." },
      { term: "Readout mitigation", detail: "Invert a calibrated confusion matrix over measurement outcomes." },
      { term: "Hybrid MLOps", detail: "Version circuits, seeds, backends and calibration snapshots together." },
    ],
    code: {
      language: "python",
      label: "Submitting to IBM Quantum",
      snippet: `from qiskit_ibm_runtime import QiskitRuntimeService, EstimatorV2

service = QiskitRuntimeService()
backend = service.least_busy(operational=True, simulator=False)
estimator = EstimatorV2(mode=backend)
job = estimator.run([(transpiled_circuit, observable)])
print(job.result()[0].data.evs)`,
    },
    quiz: [
      {
        id: "hw-1",
        prompt: "Zero-noise extrapolation works by…",
        options: [
          "Removing gates",
          "Running at amplified noise levels and extrapolating",
          "Increasing shots",
          "Using more qubits",
        ],
        answer: 1,
        explanation: "Observables are measured at several noise scalings and fitted back to zero.",
      },
      {
        id: "hw-2",
        prompt: "Transpilation is required because…",
        options: [
          "Python is slow",
          "Devices have native gates and limited connectivity",
          "Circuits must be shallow",
          "Measurements are noisy",
        ],
        answer: 1,
        explanation: "Logical circuits must be rewritten into the backend's basis gates and coupling map.",
      },
    ],
    kata: {
      id: "kata-hw",
      title: "Kata: Mitigation plan",
      task: "List the mitigation stack you would apply to a 5-qubit QNN inference run.",
      hint: "Readout correction → dynamical decoupling → ZNE.",
      stars: 5,
    },
  },
];

export type Project = {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  stars: number;
  duration: string;
  stack: string[];
  summary: string;
  steps: { title: string; detail: string }[];
  starter: string;
};

export const projects: Project[] = [
  {
    id: "qrng",
    title: "Quantum Random Number Generator",
    level: "Beginner",
    stars: 5,
    duration: "2 hours",
    stack: ["Qiskit", "Python 3.11", "Matplotlib"],
    summary:
      "Harvest genuine randomness from superposition, then validate it with statistical randomness tests.",
    steps: [
      { title: "Prepare superposition", detail: "Apply H to each of n qubits so every bitstring is equally likely." },
      { title: "Measure", detail: "Measure in the computational basis; each shot yields n raw random bits." },
      { title: "Post-process", detail: "Apply von Neumann debiasing to remove hardware bias from the raw stream." },
      { title: "Validate", detail: "Run monobit, runs and chi-square tests; plot the histogram of outcomes." },
      { title: "Ship", detail: "Wrap it as a CLI that streams bytes and logs the backend + calibration used." },
    ],
    starter: `from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

n = 8
qc = QuantumCircuit(n, n)
qc.h(range(n))
qc.measure(range(n), range(n))
counts = AerSimulator().run(qc, shots=1024).result().get_counts()`,
  },
  {
    id: "qsvm",
    title: "Quantum Support Vector Machine",
    level: "Intermediate",
    stars: 8,
    duration: "6 hours",
    stack: ["PennyLane", "scikit-learn", "NumPy"],
    summary:
      "Build a fidelity feature map, measure the Gram matrix, and classify a real dataset with a precomputed-kernel SVM.",
    steps: [
      { title: "Pick the data", detail: "Use a 4-feature subset of Iris or a synthetic ad-hoc dataset; standardise it." },
      { title: "Design the feature map", detail: "ZZ feature map with 2 repetitions; keep depth low enough for hardware." },
      { title: "Measure the kernel", detail: "Run φ(y)†φ(x) and record P(|0…0⟩) for every training pair." },
      { title: "Train the SVM", detail: "Fit sklearn SVC with kernel='precomputed' on the measured Gram matrix." },
      { title: "Benchmark", detail: "Compare against RBF-kernel SVM, and report kernel-target alignment." },
      { title: "Mitigate", detail: "Add readout error mitigation and re-measure a few entries to show the delta." },
    ],
    starter: `import pennylane as qml, numpy as np
dev = qml.device("default.qubit", wires=4)

@qml.qnode(dev)
def kernel_circuit(x1, x2):
    qml.AngleEmbedding(x1, wires=range(4))
    qml.adjoint(qml.AngleEmbedding)(x2, wires=range(4))
    return qml.probs(wires=range(4))

kernel = lambda a, b: kernel_circuit(a, b)[0]`,
  },
  {
    id: "hybrid-transfer",
    title: "Hybrid Classical–Quantum Transfer Learning",
    level: "Advanced",
    stars: 12,
    duration: "10 hours",
    stack: ["PyTorch", "PennyLane", "torchvision"],
    summary:
      "Freeze a pretrained ResNet, replace the head with a variational quantum circuit, and fine-tune on a small image set.",
    steps: [
      { title: "Load the backbone", detail: "ResNet-18 pretrained on ImageNet with all layers frozen." },
      { title: "Compress features", detail: "Linear layer down to 4 dimensions matching your qubit count." },
      { title: "Add the quantum head", detail: "TorchLayer wrapping angle embedding + strongly entangling layers." },
      { title: "Train", detail: "Adam at 1e-3, batch 8; log train/val curves and gradient norms." },
      { title: "Ablate", detail: "Swap the quantum head for a classical MLP of equal parameter count and compare." },
      { title: "Run on hardware", detail: "Execute inference on a real backend; report accuracy delta under noise." },
    ],
    starter: `import torch, pennylane as qml
from torchvision.models import resnet18

model = resnet18(weights="IMAGENET1K_V1")
for p in model.parameters():
    p.requires_grad = False
model.fc = torch.nn.Sequential(torch.nn.Linear(512, 4), quantum_head, torch.nn.Linear(4, 2))`,
  },
];

export type Technique = { id: string; name: string; category: string; detail: string; useWhen: string };

export const techniques: Technique[] = [
  {
    id: "amplitude-encoding",
    name: "Amplitude Encoding",
    category: "Encoding",
    detail: "Stores 2^n normalised features in n qubits' amplitudes — exponentially compact input representation.",
    useWhen: "High-dimensional, dense feature vectors with a tolerable state-preparation cost.",
  },
  {
    id: "angle-encoding",
    name: "Angle Encoding",
    category: "Encoding",
    detail: "Maps each feature to a rotation angle; constant-depth and hardware friendly.",
    useWhen: "Few features, NISQ hardware, or as the base layer for data re-uploading.",
  },
  {
    id: "parameter-shift",
    name: "Parameter-Shift Rule",
    category: "Training",
    detail: "Exact analytic gradients from evaluations at θ ± π/2 — no finite-difference bias.",
    useWhen: "Any variational model trained on hardware.",
  },
  {
    id: "fidelity-kernel",
    name: "Fidelity Kernels",
    category: "Kernels",
    detail: "Similarity measured as overlap between encoded states; feeds classical kernel machines.",
    useWhen: "Small datasets where the Gram matrix stays affordable.",
  },
  {
    id: "data-reuploading",
    name: "Data Re-uploading",
    category: "Architecture",
    detail: "Alternates encoding and trainable layers to raise the model's Fourier expressivity.",
    useWhen: "Qubit-constrained devices needing more model capacity.",
  },
  {
    id: "zne",
    name: "Zero-Noise Extrapolation",
    category: "Mitigation",
    detail: "Amplifies noise deliberately then extrapolates observables to the zero-noise limit.",
    useWhen: "Expectation-value workloads on noisy backends.",
  },
  {
    id: "qaoa",
    name: "QAOA Layers",
    category: "Optimisation",
    detail: "Alternating cost and mixer Hamiltonians for combinatorial objectives.",
    useWhen: "Portfolio selection, routing and scheduling formulations.",
  },
  {
    id: "amplitude-estimation",
    name: "Amplitude Estimation",
    category: "Inference",
    detail: "Quadratic speedup over Monte Carlo for expectation values of loaded distributions.",
    useWhen: "Risk analysis and derivative pricing pipelines.",
  },
];

export type Application = {
  id: string;
  industry: string;
  headline: string;
  detail: string;
  algorithms: string[];
  maturity: string;
};

export const applications: Application[] = [
  {
    id: "drug-discovery",
    industry: "Drug Discovery",
    headline: "Molecular ground-state energies and binding affinity screens",
    detail:
      "VQE estimates electronic structure for candidate molecules while quantum kernels rank binding affinity on small curated assay datasets.",
    algorithms: ["VQE", "Quantum kernels", "Qubit tapering"],
    maturity: "Early experiments on 20–100 qubit devices",
  },
  {
    id: "finance",
    industry: "Finance",
    headline: "Risk analysis, portfolio optimisation and synthetic market data",
    detail:
      "Amplitude estimation accelerates Monte Carlo VaR; QAOA tackles constrained portfolio selection; qGANs load empirical return distributions.",
    algorithms: ["Amplitude estimation", "QAOA", "qGAN"],
    maturity: "Active pilots with banks and exchanges",
  },
  {
    id: "climate",
    industry: "Climate Science",
    headline: "Materials for carbon capture and coarse-grained climate models",
    detail:
      "Variational simulation of catalyst surfaces plus quantum-enhanced regression on sparse sensor and satellite datasets.",
    algorithms: ["VQE", "QNN regression", "Quantum PCA"],
    maturity: "Research stage, strong classical baselines",
  },
  {
    id: "logistics",
    industry: "Logistics & Energy",
    headline: "Routing, grid balancing and scheduling under constraints",
    detail:
      "QAOA and annealing hybrids attack routing and unit-commitment problems where classical solvers hit combinatorial walls.",
    algorithms: ["QAOA", "Annealing hybrids"],
    maturity: "Benchmark-driven pilots",
  },
];

export type Perk = {
  id: string;
  title: string;
  cost: number;
  category: "Case Study" | "Hardware" | "Badge" | "Deep Dive";
  description: string;
};

export const perks: Perk[] = [
  {
    id: "case-pharma",
    title: "Case study: QML in a pharma discovery pipeline",
    cost: 6,
    category: "Case Study",
    description: "How a mid-size biotech benchmarked quantum kernels against gradient boosting on ADMET data.",
  },
  {
    id: "case-bank",
    title: "Case study: Amplitude estimation for VaR at a tier-1 bank",
    cost: 8,
    category: "Case Study",
    description: "Full write-up of the pilot: circuit budget, error mitigation stack and the honest speedup verdict.",
  },
  {
    id: "hardware-ibm",
    title: "Early access: IBM Quantum hardware runs",
    cost: 15,
    category: "Hardware",
    description: "Queue-priority credits to run your QSVM and QNN notebooks on real superconducting backends.",
  },
  {
    id: "hardware-sandbox",
    title: "Noise-model sandbox with device calibration snapshots",
    cost: 10,
    category: "Hardware",
    description: "Replay your circuits against last week's real calibration data before spending queue time.",
  },
  {
    id: "badge-entangler",
    title: "Badge: Master Entangler",
    cost: 5,
    category: "Badge",
    description: "Profile badge for clearing every circuit kata in the Quantum Computing track.",
  },
  {
    id: "badge-variational",
    title: "Badge: Variational Architect",
    cost: 9,
    category: "Badge",
    description: "Awarded for shipping a trained QNN with documented ablations.",
  },
  {
    id: "deep-dive-barren",
    title: "Deep dive: Barren plateaus, with a guest physicist",
    cost: 12,
    category: "Deep Dive",
    description: "90-minute lecture on landscape geometry, initialisation strategies and local cost functions.",
  },
  {
    id: "deep-dive-error",
    title: "Deep dive: Error correction beyond the NISQ era",
    cost: 14,
    category: "Deep Dive",
    description: "Surface codes, magic-state distillation and what fault tolerance means for QML timelines.",
  },
];
