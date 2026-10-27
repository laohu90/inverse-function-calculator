import { FunctionType, InverseSolution } from '../types/math';
import {
  solveLinear,
  solveQuadratic,
  solvePolynomialPower,
  solveRational,
  solveRadical,
  solveExponential,
  solveLogarithmic,
  solveTrigonometric,
  solveInverseTrig,
  solvePiecewise,
} from './inverseSolver';

export interface ParseResultSuccess {
  success: true;
  type: FunctionType;
  solution: InverseSolution;
  canonical: string;
}

export interface ParseResultError {
  success: false;
  error: string;
  suggestion?: string;
}

export type ParseResult = ParseResultSuccess | ParseResultError;

/**
 * Normalizes input strings by converting Unicode symbols, removing spaces,
 * and stripping leading "f(x) =" or "y =".
 */
export function normalizeExpr(raw: string): string {
  let s = raw.trim();
  // Strip "f(x) =" or "y =" prefix
  s = s.replace(/^(f\(x\)|y)\s*=\s*/i, '').trim();

  // Unicode superscripts to ^n
  s = s.replace(/²/g, '^2');
  s = s.replace(/³/g, '^3');
  s = s.replace(/⁴/g, '^4');
  s = s.replace(/⁵/g, '^5');
  s = s.replace(/⁶/g, '^6');
  s = s.replace(/⁷/g, '^7');
  s = s.replace(/⁸/g, '^8');
  s = s.replace(/⁹/g, '^9');
  s = s.replace(/⁰/g, '^0');

  // Unicode radical √ to sqrt
  s = s.replace(/∛/g, 'cbrt');
  s = s.replace(/√/g, 'sqrt');
  s = s.replace(/\\sqrt\{([^}]+)\}/g, 'sqrt($1)');
  s = s.replace(/\\sqrt\[3\]\{([^}]+)\}/g, 'cbrt($1)');

  // LaTeX fractions \frac{a}{b} to (a)/(b)
  s = s.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)');

  // LaTeX \cdot or *
  s = s.replace(/\\cdot/g, '*');

  // Strip LaTeX \left and \right
  s = s.replace(/\\left|\\right/g, '');

  return s;
}

/**
 * Parses coefficient and constant from a linear string like "3x - 7", "x + 2", "-x", "5".
 */
function parseLinearPart(part: string): { m: number; b: number; isValid: boolean } {
  const p = part.replace(/\s+/g, '');
  if (!p) return { m: 0, b: 0, isValid: false };

  // Match: mx + b or mx or b + mx or b
  // e.g. "2x+3", "x-5", "-x+1", "3x", "4"
  const linearRegex = /^([+-]?(?:\d+(?:\.\d+)?)?)x([+-]\d+(?:\.\d+)?)?$/i;
  const match = p.match(linearRegex);
  if (match) {
    let m = 1;
    if (match[1] === '-' || match[1] === '-1') m = -1;
    else if (match[1] === '+' || match[1] === '') m = 1;
    else m = parseFloat(match[1]);

    const b = match[2] ? parseFloat(match[2]) : 0;
    return { m, b, isValid: !isNaN(m) && !isNaN(b) };
  }

  // Const + mx: e.g. "3-2x"
  const revRegex = /^([+-]?\d+(?:\.\d+)?)([+-](?:\d+(?:\.\d+)?)?)x$/i;
  const revMatch = p.match(revRegex);
  if (revMatch) {
    const b = parseFloat(revMatch[1]);
    let m = 1;
    if (revMatch[2] === '-' || revMatch[2] === '-1') m = -1;
    else if (revMatch[2] === '+' || revMatch[2] === '') m = 1;
    else m = parseFloat(revMatch[2]);
    return { m, b, isValid: !isNaN(m) && !isNaN(b) };
  }

  // Pure constant: e.g. "1"
  if (/^[+-]?\d+(?:\.\d+)?$/.test(p)) {
    return { m: 0, b: parseFloat(p), isValid: true };
  }

  return { m: 0, b: 0, isValid: false };
}

/**
 * Main parser function.
 * Strictly avoids falling back to linear identity f(x) = x when recognition fails.
 */
export function parseMathExpression(input: string): ParseResult {
  if (!input || !input.trim()) {
    return {
      success: false,
      error: 'Empty expression. Please enter a mathematical function.',
      suggestion: 'Try x^2 + 4x + 1 or 3x - 7',
    };
  }

  const rawExpr = input.trim();
  const normalized = normalizeExpr(rawExpr);
  const compact = normalized.replace(/\s+/g, '');

  // 1. Check for Piecewise function
  // e.g. "2x+1, x>=0; x-1, x<0" or "piecewise(2x+1, x>=0; x-1, x<0)"
  if (compact.includes(';') || compact.toLowerCase().startsWith('piecewise')) {
    const cleanPiecewise = compact.replace(/^piecewise\(/i, '').replace(/\)$/, '');
    const clauses = cleanPiecewise.split(';').filter((c) => c.trim().length > 0);
    if (clauses.length >= 2) {
      const parsedPieces: { expr: string; condition: string; parsed: InverseSolution }[] = [];
      for (const clause of clauses) {
        const parts = clause.split(',');
        if (parts.length === 2) {
          const pieceExpr = parts[0].trim();
          const condition = parts[1].trim();
          const res = parseMathExpression(pieceExpr);
          if (res.success) {
            parsedPieces.push({ expr: pieceExpr, condition, parsed: res.solution });
          }
        }
      }
      if (parsedPieces.length >= 2) {
        try {
          const solution = solvePiecewise(parsedPieces);
          return {
            success: true,
            type: 'piecewise',
            solution,
            canonical: solution.originalEquation,
          };
        } catch {
          // fallback to standard parsers
        }
      }
    }
  }

  // 2. Trigonometric functions: sin, cos, tan
  // e.g. sin(x), cos(2x+1), 3*tan(x)-1
  const trigMatch = compact.match(/^([+-]?\d*(?:\.\d+)?)\*?(sin|cos|tan)\(([^)]+)\)([+-]\d+(?:\.\d+)?)?$/i);
  if (trigMatch) {
    let a = 1;
    if (trigMatch[1] === '-') a = -1;
    else if (trigMatch[1] && trigMatch[1] !== '+') a = parseFloat(trigMatch[1]);

    const fnName = trigMatch[2].toLowerCase() as 'sin' | 'cos' | 'tan';
    const inner = parseLinearPart(trigMatch[3]);
    const d = trigMatch[4] ? parseFloat(trigMatch[4]) : 0;

    if (inner.isValid && inner.m !== 0) {
      const solution = solveTrigonometric(fnName, a, inner.m, inner.b, d);
      return {
        success: true,
        type: 'trigonometric',
        solution,
        canonical: solution.originalEquation,
      };
    }
  }

  // 3. Inverse Trigonometric: arcsin, arccos, arctan, asin, acos, atan
  const invTrigMatch = compact.match(/^([+-]?\d*(?:\.\d+)?)\*?(arcsin|arccos|arctan|asin|acos|atan)\(([^)]+)\)([+-]\d+(?:\.\d+)?)?$/i);
  if (invTrigMatch) {
    let a = 1;
    if (invTrigMatch[1] === '-') a = -1;
    else if (invTrigMatch[1] && invTrigMatch[1] !== '+') a = parseFloat(invTrigMatch[1]);

    let fnName = invTrigMatch[2].toLowerCase();
    if (fnName === 'asin') fnName = 'arcsin';
    if (fnName === 'acos') fnName = 'arccos';
    if (fnName === 'atan') fnName = 'arctan';

    const inner = parseLinearPart(invTrigMatch[3]);
    const d = invTrigMatch[4] ? parseFloat(invTrigMatch[4]) : 0;

    if (inner.isValid && inner.m !== 0) {
      const solution = solveInverseTrig(fnName as 'arcsin' | 'arccos' | 'arctan', a, inner.m, inner.b, d);
      return {
        success: true,
        type: 'inverse_trig',
        solution,
        canonical: solution.originalEquation,
      };
    }
  }

  // 4. Logarithmic functions: ln(x), log(x), log2(x), log10(x), log_b(x)
  // e.g. ln(x), 2*ln(x-1)+3, log(x), log2(x), log10(x)
  const logMatch = compact.match(/^([+-]?\d*(?:\.\d+)?)\*?(ln|log(?:_?(\d+(?:\.\d+)?))?)\(([^)]+)\)([+-]\d+(?:\.\d+)?)?$/i);
  if (logMatch) {
    let a = 1;
    if (logMatch[1] === '-') a = -1;
    else if (logMatch[1] && logMatch[1] !== '+') a = parseFloat(logMatch[1]);

    const logType = logMatch[2].toLowerCase();
    let base = Math.E;
    if (logType.startsWith('log')) {
      const baseSub = logMatch[3];
      base = baseSub ? parseFloat(baseSub) : 10;
    }

    const inner = parseLinearPart(logMatch[4]);
    const k = logMatch[5] ? parseFloat(logMatch[5]) : 0;

    if (inner.isValid && inner.m !== 0) {
      const solution = solveLogarithmic(a, base, inner.m, inner.b, k);
      return {
        success: true,
        type: 'logarithmic',
        solution,
        canonical: solution.originalEquation,
      };
    }
  }

  // 5. Exponential functions: e^x, 2^x, 10^x, b^(cx+d) + k, a*e^(...) + k
  // e.g. e^x, 2^x, 2^(x+1), e^(2x)-3, 3*2^x+1
  const expMatch = compact.match(/^([+-]?\d*(?:\.\d+)?)\*?(?:(\d+(?:\.\d+)?)|e)\^\(?([+-]?\d*(?:\.\d+)?x[+-]?\d*(?:\.\d+)?|\{?[^{}]+\}?)\)?([+-]\d+(?:\.\d+)?)?$/i);
  if (expMatch) {
    let a = 1;
    if (expMatch[1] === '-') a = -1;
    else if (expMatch[1] && expMatch[1] !== '+') a = parseFloat(expMatch[1]);

    const baseVal = expMatch[2] ? parseFloat(expMatch[2]) : Math.E;
    const exponentRaw = expMatch[3].replace(/[{}]/g, '');
    const inner = parseLinearPart(exponentRaw);
    const k = expMatch[4] ? parseFloat(expMatch[4]) : 0;

    if (inner.isValid && inner.m !== 0) {
      const solution = solveExponential(a, baseVal, inner.m, inner.b, k);
      return {
        success: true,
        type: 'exponential',
        solution,
        canonical: solution.originalEquation,
      };
    }
  }

  // 6. Radical functions: sqrt(x), cbrt(x), sqrt(bx+c)+d, a*sqrt(...)
  // e.g. sqrt(x-1), sqrt(2x-5)+3, cbrt(x)
  const radMatch = compact.match(/^([+-]?\d*(?:\.\d+)?)\*?(sqrt|cbrt)\(([^)]+)\)([+-]\d+(?:\.\d+)?)?$/i);
  if (radMatch) {
    let a = 1;
    if (radMatch[1] === '-') a = -1;
    else if (radMatch[1] && radMatch[1] !== '+') a = parseFloat(radMatch[1]);

    const n = radMatch[2].toLowerCase() === 'cbrt' ? 3 : 2;
    const inner = parseLinearPart(radMatch[3]);
    const d = radMatch[4] ? parseFloat(radMatch[4]) : 0;

    if (inner.isValid && inner.m !== 0) {
      const solution = solveRadical(a, inner.m, inner.b, d, n);
      return {
        success: true,
        type: 'radical',
        solution,
        canonical: solution.originalEquation,
      };
    }
  }

  // 7. Rational functions: e.g. (2x+3)/(x-5), 1/(x+2), (x+1)/(x-1), 3/(2x-1)+4
  if (compact.includes('/')) {
    // Check form: (Num) / (Den) or Num / Den
    const slashIdx = compact.lastIndexOf('/');
    const leftPart = compact.substring(0, slashIdx);
    const rightPart = compact.substring(slashIdx + 1);

    const cleanNum = leftPart.replace(/^\((.*)\)$/, '$1');
    const cleanDen = rightPart.replace(/^\((.*)\)$/, '$1');

    const numParsed = parseLinearPart(cleanNum);
    const denParsed = parseLinearPart(cleanDen);

    if (denParsed.isValid && denParsed.m !== 0) {
      // Valid rational function (ax + b)/(cx + d)
      try {
        const solution = solveRational(numParsed.m, numParsed.b, denParsed.m, denParsed.b);
        return {
          success: true,
          type: 'rational',
          solution,
          canonical: solution.originalEquation,
        };
      } catch {
        // ad - bc = 0 or non-invertible
      }
    } else if (denParsed.isValid && denParsed.m === 0 && denParsed.b !== 0) {
      // (mx + b) / const => Linear!
      const m = numParsed.m / denParsed.b;
      const b = numParsed.b / denParsed.b;
      if (numParsed.isValid && m !== 0) {
        const solution = solveLinear(m, b);
        return {
          success: true,
          type: 'linear',
          solution,
          canonical: solution.originalEquation,
        };
      }
    }
  }

  // 8. General Polynomials & Shifted Powers: a(x - h)^n + k or a*x^n + c
  // Handles: x^3, x^3+1, 2x^3 - 5, (x-2)^3 - 1, x^4, x^5
  const polyPowerMatch = compact.match(/^([+-]?\d*(?:\.\d+)?)\*?(?:\(([^)]+)\)|x)\^(\d+)([+-]\d+(?:\.\d+)?)?$/i);
  if (polyPowerMatch) {
    let a = 1;
    if (polyPowerMatch[1] === '-') a = -1;
    else if (polyPowerMatch[1] && polyPowerMatch[1] !== '+') a = parseFloat(polyPowerMatch[1]);

    const innerStr = polyPowerMatch[2] || 'x';
    const n = parseInt(polyPowerMatch[3], 10);
    const k = polyPowerMatch[4] ? parseFloat(polyPowerMatch[4]) : 0;

    const inner = parseLinearPart(innerStr);
    if (inner.isValid && inner.m === 1 && n >= 2) {
      // (x - h) where inner.b = -h
      const h = -inner.b;
      const solution = solvePolynomialPower(a, n, h, k);
      return {
        success: true,
        type: n === 3 ? 'cubic' : 'polynomial',
        solution,
        canonical: solution.originalEquation,
      };
    }
  }

  // 9. Standard Quadratic: ax^2 + bx + c
  // e.g. x^2 + 4x + 1, 2x^2 - 12x + 11, -x^2 + 2x, x^2 - 4
  if (compact.includes('x^2') || compact.includes('x²')) {
    let expr = compact.replace(/x²/g, 'x^2');
    let a = 0;
    let b = 0;
    let c = 0;

    // Match leading ax^2
    const aMatch = expr.match(/^([+-]?\d*(?:\.\d+)?)\*?x\^2/i);
    if (aMatch) {
      if (aMatch[1] === '' || aMatch[1] === '+') a = 1;
      else if (aMatch[1] === '-') a = -1;
      else a = parseFloat(aMatch[1]);

      expr = expr.replace(/^([+-]?\d*(?:\.\d+)?)\*?x\^2/i, '');

      // Match bx
      const bMatch = expr.match(/^([+-]\d*(?:\.\d+)?)\*?x(?!\^)/i);
      if (bMatch) {
        if (bMatch[1] === '+') b = 1;
        else if (bMatch[1] === '-') b = -1;
        else b = parseFloat(bMatch[1]);
        expr = expr.replace(/^([+-]\d*(?:\.\d+)?)\*?x(?!\^)/i, '');
      }

      // Remaining is constant c
      if (expr) {
        const cVal = parseFloat(expr);
        if (!isNaN(cVal)) c = cVal;
        else return {
          success: false,
          error: `Unrecognized trailing characters in quadratic expression: "${expr}"`,
          suggestion: 'Ensure format is ax^2 + bx + c, e.g. x^2 + 4x + 1',
        };
      }

      if (a !== 0) {
        const solution = solveQuadratic(a, b, c, '+');
        return {
          success: true,
          type: 'quadratic',
          solution,
          canonical: solution.originalEquation,
        };
      }
    }
  }

  // 10. STRICT Linear: mx + b or b + mx
  // MUST NOT match polynomials with higher powers (e.g. x^3, x^4) or unparsed symbols!
  if (!compact.includes('^') && !compact.includes('/') && !compact.includes('(')) {
    const lin = parseLinearPart(compact);
    if (lin.isValid && lin.m !== 0) {
      const solution = solveLinear(lin.m, lin.b);
      return {
        success: true,
        type: 'linear',
        solution,
        canonical: solution.originalEquation,
      };
    }
  }

  // 11. If recognition fails, DO NOT SILENTLY DOWNGRADE TO LINEAR IDENTITY!
  // Explicitly return structured error with user guidance
  return {
    success: false,
    error: `Unable to recognize formula: "${rawExpr}".`,
    suggestion: 'Please check your syntax (e.g. 3x - 7, x^3 + 1, e^x, sqrt(x-1)), or click any Function Family button above to configure directly!',
  };
}
