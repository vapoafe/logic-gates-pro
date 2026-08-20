export type GateType = 'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND' | 'NOR' | 'XNOR' | 'BUFFER';

export type ComponentType = GateType | 'SWITCH' | 'PUSH' | 'CLOCK' | 'CONST_1' | 'CONST_0' | 'LED' | 'PROBE' | 'SEVEN_SEGMENT';

export interface Pin {
  id: string;
  label?: string;
  x: number; // relative to gate
  y: number;
}

export interface CircuitNode {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  label?: string;
  state?: number; // for switches/clocks/LEDs: 0 or 1
  clockSpeed?: number; // in ms
  outputValue?: number;
}

export interface WireConnection {
  id: string;
  fromNodeId: string;
  fromPinIndex: number; // usually 0 for single output
  toNodeId: string;
  toPinIndex: number;   // 0 (A) or 1 (B)
  signal?: number;
}

export interface PresetCircuit {
  id: string;
  name: string;
  nameEl: string;
  description: string;
  descriptionEl: string;
  nodes: CircuitNode[];
  connections: WireConnection[];
}

export interface Lesson {
  id: string;
  title: string;
  titleEl: string;
  description: string;
  descriptionEl: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  icon: string;
  category: 'basics' | 'gates' | 'boolean' | 'circuits';
  contentEl: string;
  contentEn: string;
  gateDemoType?: GateType;
  truthTable?: {
    headers: string[];
    rows: (number | string)[][];
  };
}

export type ExerciseType = 'gate-evaluation' | 'boolean-simplification' | 'truth-table' | 'circuit-output';

export interface Exercise {
  id: string;
  type: ExerciseType;
  difficulty: 'easy' | 'medium' | 'hard';
  moduleId: string;
  questionEl: string;
  questionEn: string;
  explanationEl: string;
  explanationEn: string;
  // gate-evaluation specific
  gate?: GateType;
  inputs?: Record<string, number>;
  expectedOutput?: number;
  options?: (string | number)[];
  // boolean-simplification specific
  expression?: string;
  correctAnswer?: string;
  // truth-table specific
  tableHeaders?: string[];
  tableRows?: { inputs: number[]; output: number | null; expected: number }[];
  // circuit-output specific
  circuitDescription?: string;
}

export interface Badge {
  id: string;
  name: string;
  nameEl: string;
  icon: string;
  description: string;
  descriptionEl: string;
  category: 'streak' | 'exercises' | 'designer' | 'lessons' | 'mastery' | 'boolean';
  unlockedAt?: string;
}

export interface DailyActivity {
  day: string;
  dayEl: string;
  xp: number;
  exercisesSolved: number;
}
