import { parseMathExpression } from './expressionParser';
import { InverseSolution } from '../types/math';

export interface TestCaseResult {
  id: number;
  input: string;
  expectedType: string;
  actualType: string;
  originalEquation: string;
  inverseEquation: string;
  domainInverse: string;
  hltPassed: boolean;
  passed: boolean;
  error?: string;
}

export const REGRESSION_TEST_CASES = [
  { id: 1, input: '3x-7', expectedType: 'linear', description: 'Linear function' },
  { id: 2, input: 'x²+4x+1', expectedType: 'quadratic', description: 'Quadratic function with Unicode square' },
  { id: 3, input: '(2x+3)/(x-5)', expectedType: 'rational', description: 'Rational linear-over-linear' },
  { id: 4, input: 'e^x', expectedType: 'exponential', description: 'Natural exponential base e' },
  { id: 5, input: '√(x-1)', expectedType: 'radical', description: 'Square root with Unicode radical' },
  { id: 6, input: 'x^3', expectedType: 'cubic', description: 'Cubic monomial power' },
  { id: 7, input: 'x^3+1', expectedType: 'cubic', description: 'Shifted cubic polynomial' },
  { id: 8, input: 'ln(x)', expectedType: 'logarithmic', description: 'Natural logarithm' },
  { id: 9, input: '1/(x+2)', expectedType: 'rational', description: 'Reciprocal rational fraction' },
  { id: 10, input: '2^x', expectedType: 'exponential', description: 'Exponential with base 2' },
];

export function runRegressionTests(): {
  allPassed: boolean;
  results: TestCaseResult[];
  passCount: number;
  totalCount: number;
} {
  const results: TestCaseResult[] = [];
  let passCount = 0;

  for (const tc of REGRESSION_TEST_CASES) {
    try {
      const res = parseMathExpression(tc.input);
      if (!res.success) {
        results.push({
          id: tc.id,
          input: tc.input,
          expectedType: tc.expectedType,
          actualType: 'unparsed',
          originalEquation: '',
          inverseEquation: '',
          domainInverse: '',
          hltPassed: false,
          passed: false,
          error: res.error,
        });
        continue;
      }

      const sol: InverseSolution = res.solution;
      const typeMatches = res.type === tc.expectedType;
      const hasInverse = Boolean(sol.inverseEquation && sol.inverseEquation.includes('f^{-1}'));
      const hasSteps = sol.steps.length >= 3;
      const passed = typeMatches && hasInverse && hasSteps;

      if (passed) passCount++;

      results.push({
        id: tc.id,
        input: tc.input,
        expectedType: tc.expectedType,
        actualType: res.type,
        originalEquation: sol.originalEquation,
        inverseEquation: sol.inverseEquation,
        domainInverse: sol.domainInverse,
        hltPassed: sol.horizontalLineTest.passed,
        passed,
      });
    } catch (err: any) {
      results.push({
        id: tc.id,
        input: tc.input,
        expectedType: tc.expectedType,
        actualType: 'error',
        originalEquation: '',
        inverseEquation: '',
        domainInverse: '',
        hltPassed: false,
        passed: false,
        error: err.message || String(err),
      });
    }
  }

  return {
    allPassed: passCount === REGRESSION_TEST_CASES.length,
    results,
    passCount,
    totalCount: REGRESSION_TEST_CASES.length,
  };
}
