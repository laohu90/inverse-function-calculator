export type FunctionType = 
  | 'quadratic'
  | 'linear'
  | 'rational'
  | 'radical'
  | 'exponential'
  | 'logarithmic'
  | 'cubic'
  | 'polynomial'
  | 'trigonometric'
  | 'inverse_trig'
  | 'composite'
  | 'piecewise'
  | 'custom';

export interface StepItem {
  stepNumber: number;
  title: string;
  latex: string;
  explanation: string;
  tip?: string;
  badge?: string;
}

export interface HorizontalLineTestResult {
  passed: boolean;              // true if strictly monotonic across entire natural domain
  isLocallyRestricted: boolean; // true if restricted to a single branch to pass HLT
  title: string;
  explanation: string;
  restrictedDomain?: string;
  criticalPoints?: number[];
}

export interface CompletingTheSquareDetail {
  originalStandardForm: string; // e.g. y = x^2 + 4x + 1
  a: number;
  b: number;
  c: number;
  h: number; // -b / (2a)
  k: number; // c - b^2 / (4a)
  vertexForm: string; // e.g. (x + 2)^2 - 3
  step1_isolate: string;
  step2_half_b: string;
  step3_add_both_sides: string;
  step4_factor_perfect_square: string;
  step5_square_root_branch: string;
  chosenBranch: '+' | '-';
  domainRestriction: string; // e.g. x >= -2
  rangeRestriction: string; // e.g. y >= -3
}

export interface PiecewiseBranch {
  originalCondition: string;   // e.g. x \ge 0
  inverseCondition: string;    // e.g. x \ge 1
  originalExpr: string;        // e.g. 2x + 1
  inverseExpr: string;         // e.g. \frac{x - 1}{2}
  domainOriginal: string;
  rangeOriginal: string;
  domainInverse: string;
  rangeInverse: string;
  steps: StepItem[];
}

export interface InverseSolution {
  originalEquation: string; // e.g. f(x) = x^2 + 4x + 1
  inverseEquation: string;  // e.g. f^{-1}(x) = -2 + \sqrt{x + 3}
  functionType: FunctionType;
  domainOriginal: string;
  rangeOriginal: string;
  domainInverse: string;
  rangeInverse: string;
  isOneToOne: boolean;
  restrictionNote?: string;
  horizontalLineTest: HorizontalLineTestResult;
  steps: StepItem[];
  completingSquareDetail?: CompletingTheSquareDetail;
  piecewiseBranches?: PiecewiseBranch[];
  verificationSteps: {
    composition1: string; // f(f^{-1}(x)) = ... = x
    composition2: string; // f^{-1}(f(x)) = ... = x
    explanation: string;
  };
  evaluateOriginal: (x: number) => number | null;
  evaluateInverse: (x: number) => number | null;
}
