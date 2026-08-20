import { v4 as uuidv4 } from 'uuid';
import { Exercise, GateType } from '../types';

export const evaluateGate = (type: GateType, a: number, b: number = 0): number => {
  switch (type) {
    case 'AND': return (a === 1 && b === 1) ? 1 : 0;
    case 'OR': return (a === 1 || b === 1) ? 1 : 0;
    case 'NOT': return a === 1 ? 0 : 1;
    case 'XOR': return ((a === 1 && b === 0) || (a === 0 && b === 1)) ? 1 : 0;
    case 'NAND': return !(a === 1 && b === 1) ? 1 : 0;
    case 'NOR': return !(a === 1 || b === 1) ? 1 : 0;
    case 'XNOR': return (a === b) ? 1 : 0;
    case 'BUFFER': return a;
    default: return 0;
  }
};

const generateGateExercises = (): Exercise[] => {
  const exercises: Exercise[] = [];
  const gateConfigs: { gate: GateType; module: string; descEl: string; descEn: string }[] = [
    { gate: 'AND', module: 'and-gate', descEl: 'AND (Σύζευξη)', descEn: 'AND (Conjunction)' },
    { gate: 'OR', module: 'or-gate', descEl: 'OR (Διάζευξη)', descEn: 'OR (Disjunction)' },
    { gate: 'NOT', module: 'not-gate', descEl: 'NOT (Αντιστροφέας)', descEn: 'NOT (Inverter)' },
    { gate: 'XOR', module: 'xor-gate', descEl: 'XOR (Αποκλειστικό Ή)', descEn: 'XOR (Exclusive OR)' },
    { gate: 'NAND', module: 'nand-gate', descEl: 'NAND (NOT-AND)', descEn: 'NAND (Universal)' },
    { gate: 'NOR', module: 'nor-gate', descEl: 'NOR (NOT-OR)', descEn: 'NOR (Universal)' },
    { gate: 'XNOR', module: 'xnor-gate', descEl: 'XNOR (Ισοδυναμία)', descEn: 'XNOR (Equivalence)' },
  ];

  // All 4 input permutations for each 2-input gate, and 2 for NOT
  gateConfigs.forEach(({ gate, module, descEl, descEn }) => {
    if (gate === 'NOT') {
      [0, 1].forEach((a) => {
        const expected = evaluateGate(gate, a);
        exercises.push({
          id: `gate_${gate}_${a}_${uuidv4().substring(0, 6)}`,
          type: 'gate-evaluation',
          difficulty: 'easy',
          moduleId: module,
          gate,
          inputs: { A: a },
          expectedOutput: expected,
          options: [0, 1],
          questionEl: `Ποια είναι η έξοδος της πύλης ${descEl} με είσοδο A = ${a};`,
          questionEn: `What is the output of the ${descEn} gate for input A = ${a}?`,
          explanationEl: `Η πύλη NOT αντιστρέφει το σήμα: NOT(${a}) = ${expected}.`,
          explanationEn: `NOT inverts the binary input: NOT(${a}) = ${expected}.`,
        });
      });
    } else {
      const inputs = [
        { a: 0, b: 0 },
        { a: 0, b: 1 },
        { a: 1, b: 0 },
        { a: 1, b: 1 },
      ];
      inputs.forEach(({ a, b }) => {
        const expected = evaluateGate(gate, a, b);
        const difficulty = (gate === 'AND' || gate === 'OR') ? 'easy' : 'medium';
        exercises.push({
          id: `gate_${gate}_${a}_${b}_${uuidv4().substring(0, 6)}`,
          type: 'gate-evaluation',
          difficulty,
          moduleId: module,
          gate,
          inputs: { A: a, B: b },
          expectedOutput: expected,
          options: [0, 1],
          questionEl: `Ποια είναι η έξοδος της πύλης ${descEl} για εισόδους A = ${a} και B = ${b};`,
          questionEn: `What is the output of the ${descEn} gate for inputs A = ${a} and B = ${b}?`,
          explanationEl: `Για εισόδους A=${a} και B=${b}, η πύλη ${gate} δίνει έξοδο: ${expected}.`,
          explanationEn: `For inputs A=${a} and B=${b}, the ${gate} gate produces: ${expected}.`,
        });
      });
    }
  });

  return exercises;
};

const staticBooleanExercises: Exercise[] = [
  {
    id: 'bool_1',
    type: 'boolean-simplification',
    difficulty: 'hard',
    moduleId: 'demorgan',
    expression: '¯(A · B)',
    options: ['¯A + ¯B', '¯A · ¯B', 'A + B', 'A · B'],
    correctAnswer: '¯A + ¯B',
    questionEl: 'Απλοποιήστε σύμφωνα με τον 1ο Νόμο De Morgan: ¯(A · B) = ?',
    questionEn: "Simplify using De Morgan's 1st Law: ¯(A · B) = ?",
    explanationEl: '1ος Νόμος De Morgan: Η άρνηση του γινομένου ισούται με το άθροισμα των αρνήσεων ¯(A · B) = ¯A + ¯B.',
    explanationEn: "1st De Morgan's Law: ¯(A · B) = ¯A + ¯B.",
  },
  {
    id: 'bool_2',
    type: 'boolean-simplification',
    difficulty: 'hard',
    moduleId: 'demorgan',
    expression: '¯(A + B)',
    options: ['¯A · ¯B', '¯A + ¯B', 'A · B', 'A + B'],
    correctAnswer: '¯A · ¯B',
    questionEl: 'Απλοποιήστε σύμφωνα με τον 2ο Νόμο De Morgan: ¯(A + B) = ?',
    questionEn: "Simplify using De Morgan's 2nd Law: ¯(A + B) = ?",
    explanationEl: '2ος Νόμος De Morgan: Η άρνηση του αθροίσματος ισούται με το γινόμενο των αρνήσεων ¯(A + B) = ¯A · ¯B.',
    explanationEn: "2nd De Morgan's Law: ¯(A + B) = ¯A · ¯B.",
  },
  {
    id: 'bool_3',
    type: 'boolean-simplification',
    difficulty: 'medium',
    moduleId: 'demorgan',
    expression: 'A + A · B',
    options: ['A', 'A · B', 'A + B', 'B'],
    correctAnswer: 'A',
    questionEl: 'Απλοποιήστε με το Νόμο Απορρόφησης (Absorption): A + A · B = ?',
    questionEn: 'Simplify using Absorption Law: A + A · B = ?',
    explanationEl: 'Νόμος απορρόφησης: A + A · B = A · (1 + B) = A · 1 = A.',
    explanationEn: 'Absorption Law: A + A · B = A(1 + B) = A · 1 = A.',
  },
  {
    id: 'bool_4',
    type: 'boolean-simplification',
    difficulty: 'medium',
    moduleId: 'demorgan',
    expression: 'A · (A + B)',
    options: ['A', 'A + B', 'A · B', 'B'],
    correctAnswer: 'A',
    questionEl: 'Απλοποιήστε: A · (A + B) = ?',
    questionEn: 'Simplify: A · (A + B) = ?',
    explanationEl: 'A · (A + B) = A · A + A · B = A + A · B = A (Απορρόφηση).',
    explanationEn: 'A · (A + B) = A·A + A·B = A + A·B = A (Absorption).',
  },
  {
    id: 'bool_5',
    type: 'boolean-simplification',
    difficulty: 'hard',
    moduleId: 'demorgan',
    expression: 'A + ¯A · B',
    options: ['A + B', 'A · B', 'A', 'B'],
    correctAnswer: 'A + B',
    questionEl: 'Απλοποιήστε την έκφραση: A + ¯A · B = ?',
    questionEn: 'Simplify the expression: A + ¯A · B = ?',
    explanationEl: 'Ταυτότητα: A + ¯A · B = (A + ¯A) · (A + B) = 1 · (A + B) = A + B.',
    explanationEn: 'Identity: A + ¯A · B = (A + ¯A)(A + B) = 1 · (A + B) = A + B.',
  },
  {
    id: 'bool_6',
    type: 'boolean-simplification',
    difficulty: 'medium',
    moduleId: 'demorgan',
    expression: 'A · ¯A',
    options: ['0', '1', 'A', '¯A'],
    correctAnswer: '0',
    questionEl: 'Συμπλήρωμα AND: A · ¯A = ?',
    questionEn: 'Complement AND: A · ¯A = ?',
    explanationEl: 'Αντίφαση: Ένα στοιχείο και το συμπλήρωμά του δεν μπορούν να είναι ταυτόχρονα 1, άρα A · ¯A = 0.',
    explanationEn: 'Contradiction: A and NOT A cannot both be 1 simultaneously, so A · ¯A = 0.',
  },
  {
    id: 'bool_7',
    type: 'boolean-simplification',
    difficulty: 'medium',
    moduleId: 'demorgan',
    expression: 'A + ¯A',
    options: ['1', '0', 'A', '2A'],
    correctAnswer: '1',
    questionEl: 'Συμπλήρωμα OR: A + ¯A = ?',
    questionEn: 'Complement OR: A + ¯A = ?',
    explanationEl: 'Ταυτολογία: Ένα από τα A ή ¯A είναι πάντοτε 1, άρα A + ¯A = 1.',
    explanationEn: 'Tautology: One of A or ¯A is always 1, so A + ¯A = 1.',
  },
];

const staticTruthTableExercises: Exercise[] = [
  {
    id: 'tt_and',
    type: 'truth-table',
    difficulty: 'easy',
    moduleId: 'and-gate',
    questionEl: 'Συμπληρώστε τις τιμές εξόδου του πίνακα αληθείας για την πύλη AND (A · B):',
    questionEn: 'Complete the output values in the truth table for the AND gate (A · B):',
    explanationEl: 'Η πύλη AND δίνει έξοδο 1 μόνο στην τελευταία γραμμή (όπου A=1 και B=1).',
    explanationEn: 'AND gate outputs 1 only when both inputs A=1 and B=1.',
    tableHeaders: ['A', 'B', 'A · B'],
    tableRows: [
      { inputs: [0, 0], output: null, expected: 0 },
      { inputs: [0, 1], output: null, expected: 0 },
      { inputs: [1, 0], output: null, expected: 0 },
      { inputs: [1, 1], output: null, expected: 1 },
    ],
  },
  {
    id: 'tt_or',
    type: 'truth-table',
    difficulty: 'easy',
    moduleId: 'or-gate',
    questionEl: 'Συμπληρώστε τον πίνακα αληθείας για την πύλη OR (A + B):',
    questionEn: 'Complete the truth table for the OR gate (A + B):',
    explanationEl: 'Η πύλη OR δίνει 0 μόνο όταν A=0 και B=0. Σε όλες τις άλλες περιπτώσεις δίνει 1.',
    explanationEn: 'OR gate outputs 0 only when A=0 and B=0. In all other cases it outputs 1.',
    tableHeaders: ['A', 'B', 'A + B'],
    tableRows: [
      { inputs: [0, 0], output: null, expected: 0 },
      { inputs: [0, 1], output: null, expected: 1 },
      { inputs: [1, 0], output: null, expected: 1 },
      { inputs: [1, 1], output: null, expected: 1 },
    ],
  },
  {
    id: 'tt_xor',
    type: 'truth-table',
    difficulty: 'medium',
    moduleId: 'xor-gate',
    questionEl: 'Συμπληρώστε τον πίνακα αληθείας για την πύλη XOR (A ⊕ B):',
    questionEn: 'Complete the truth table for the XOR gate (A ⊕ B):',
    explanationEl: 'Η πύλη XOR δίνει 1 όταν οι είσοδοι διαφέρουν (0,1 ή 1,0), και 0 όταν είναι ίδιες.',
    explanationEn: 'XOR outputs 1 when inputs differ (0,1 or 1,0), and 0 when identical.',
    tableHeaders: ['A', 'B', 'A ⊕ B'],
    tableRows: [
      { inputs: [0, 0], output: null, expected: 0 },
      { inputs: [0, 1], output: null, expected: 1 },
      { inputs: [1, 0], output: null, expected: 1 },
      { inputs: [1, 1], output: null, expected: 0 },
    ],
  },
  {
    id: 'tt_nand',
    type: 'truth-table',
    difficulty: 'medium',
    moduleId: 'nand-gate',
    questionEl: 'Συμπληρώστε τον πίνακα αληθείας για την πύλη NAND (¯(A · B)):',
    questionEn: 'Complete the truth table for the NAND gate (¯(A · B)):',
    explanationEl: 'Η πύλη NAND είναι η αναστροφή της AND: δίνει 0 μόνο όταν A=1 και B=1.',
    explanationEn: 'NAND is inverted AND: outputs 0 only when A=1 and B=1.',
    tableHeaders: ['A', 'B', '¯(A · B)'],
    tableRows: [
      { inputs: [0, 0], output: null, expected: 1 },
      { inputs: [0, 1], output: null, expected: 1 },
      { inputs: [1, 0], output: null, expected: 1 },
      { inputs: [1, 1], output: null, expected: 0 },
    ],
  },
];

export const allExercises: Exercise[] = [
  ...generateGateExercises(),
  ...staticBooleanExercises,
  ...staticTruthTableExercises,
];

export const getExercisesByModule = (moduleId: string): Exercise[] => {
  return allExercises.filter((ex) => ex.moduleId === moduleId);
};

export const getExercisesByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): Exercise[] => {
  return allExercises.filter((ex) => ex.difficulty === difficulty);
};

export const getRandomExercise = (moduleId?: string | null, difficulty?: string | null): Exercise => {
  let pool = allExercises;
  if (moduleId && moduleId !== 'all') {
    pool = pool.filter((ex) => ex.moduleId === moduleId);
  }
  if (difficulty && difficulty !== 'all') {
    pool = pool.filter((ex) => ex.difficulty === difficulty);
  }
  if (pool.length === 0) pool = allExercises;
  return pool[Math.floor(Math.random() * pool.length)];
};
