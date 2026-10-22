import { FunctionType } from '../types/math';

export interface ParsedFunctionResult {
  success: boolean;
  type: FunctionType;
  params: Record<string, number | string>;
  canonical: string;
}

export function parseMathExpression(input: string): ParsedFunctionResult | null {
  if (!input || !input.trim()) return null;

  let expr = input.trim();
  // Strip "f(x) =" or "y =" prefix if present
  expr = expr.replace(/^(f\(x\)|y)\s*=\s*/i, '').trim();

  // Normalize signs and spaces
  expr = expr.replace(/\s+/g, '');

  // 1. Try Rational: e.g. (ax+b)/(cx+d) or ax+b/cx+d
  const rationalMatch = expr.match(/^\(?([+-]?\d*x[+-]?\d+)\)?\/\(?([+-]?\d*x[+-]?\d+)\)?$/i);
  if (rationalMatch) {
    const numPart = rationalMatch[1];
    const denPart = rationalMatch[2];

    const parseLinearPart = (part: string) => {
      let a = 0;
      let b = 0;
      const xMatch = part.match(/([+-]?\d*)x/i);
      if (xMatch) {
        if (xMatch[1] === '' || xMatch[1] === '+') a = 1;
        else if (xMatch[1] === '-') a = -1;
        else a = parseFloat(xMatch[1]);
      }
      const remainder = part.replace(/([+-]?\d*)x/i, '');
      if (remainder) {
        b = parseFloat(remainder);
      }
      return { a, b };
    };

    const num = parseLinearPart(numPart);
    const den = parseLinearPart(denPart);

    return {
      success: true,
      type: 'rational',
      params: {
        a: num.a,
        b: num.b,
        c: den.a || 1,
        d: den.b || 0,
      },
      canonical: `(${num.a === 1 ? '' : num.a}x ${num.b >= 0 ? `+ ${num.b}` : `- ${Math.abs(num.b)}`}) / (${den.a === 1 ? '' : den.a}x ${den.b >= 0 ? `+ ${den.b}` : `- ${Math.abs(den.b)}`})`,
    };
  }

  // 2. Try Square Root Radical: e.g. sqrt(bx+c)+d or \sqrt{bx+c}+d
  const radicalMatch = expr.match(/^(?:([+-]?\d*)\*?)?(?:sqrt|\(?\\sqrt\{?|\(?√)\(?([+-]?\d*x[+-]?\d*)\)?\}?(?:([+-]\d+))?$/i);
  if (radicalMatch) {
    let a = 1;
    if (radicalMatch[1]) {
      if (radicalMatch[1] === '-') a = -1;
      else if (radicalMatch[1] === '+') a = 1;
      else a = parseFloat(radicalMatch[1]);
    }
    const inside = radicalMatch[2] || 'x';
    let b = 1;
    let c = 0;
    const xInside = inside.match(/([+-]?\d*)x/i);
    if (xInside) {
      if (xInside[1] === '' || xInside[1] === '+') b = 1;
      else if (xInside[1] === '-') b = -1;
      else b = parseFloat(xInside[1]);
    }
    const constInside = inside.replace(/([+-]?\d*)x/i, '');
    if (constInside) c = parseFloat(constInside);

    const d = radicalMatch[3] ? parseFloat(radicalMatch[3]) : 0;

    return {
      success: true,
      type: 'radical',
      params: { a, b, c, d },
      canonical: `${a === 1 ? '' : a}√( ${b === 1 ? '' : b}x ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`} ) ${d !== 0 ? (d > 0 ? `+ ${d}` : `- ${Math.abs(d)}`) : ''}`,
    };
  }

  // 3. Try Exponential: e.g. e^x + d or a*e^x + d
  const expMatch = expr.match(/^(?:([+-]?\d*)\*?)?e\^?\{?x\}?(?:([+-]\d+))?$/i);
  if (expMatch) {
    let a = 1;
    if (expMatch[1]) {
      if (expMatch[1] === '-') a = -1;
      else if (expMatch[1] === '+') a = 1;
      else a = parseFloat(expMatch[1]);
    }
    const d = expMatch[2] ? parseFloat(expMatch[2]) : 0;
    return {
      success: true,
      type: 'exponential',
      params: { a, d },
      canonical: `${a === 1 ? '' : a}e^x ${d !== 0 ? (d > 0 ? `+ ${d}` : `- ${Math.abs(d)}`) : ''}`,
    };
  }

  // 4. Try Quadratic: ax^2 + bx + c
  if (expr.includes('x^2') || expr.includes('x²')) {
    let clean = expr.replace('x²', 'x^2');
    let a = 1;
    let b = 0;
    let c = 0;

    const aMatch = clean.match(/^([+-]?\d*)\*?x\^2/i);
    if (aMatch) {
      if (aMatch[1] === '' || aMatch[1] === '+') a = 1;
      else if (aMatch[1] === '-') a = -1;
      else a = parseFloat(aMatch[1]);
    }

    clean = clean.replace(/^[+-]?\d*\*?x\^2/i, '');

    const bMatch = clean.match(/([+-]?\d*)\*?x(?!\^)/i);
    if (bMatch) {
      if (bMatch[1] === '' || bMatch[1] === '+') b = 1;
      else if (bMatch[1] === '-') b = -1;
      else b = parseFloat(bMatch[1]);
      clean = clean.replace(/([+-]?\d*)\*?x(?!\^)/i, '');
    }

    if (clean) {
      const cVal = parseFloat(clean);
      if (!isNaN(cVal)) c = cVal;
    }

    return {
      success: true,
      type: 'quadratic',
      params: { a, b, c, branch: '+' },
      canonical: `${a === 1 ? '' : a}x^2 ${b !== 0 ? (b > 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`) : ''} ${c !== 0 ? (c > 0 ? `+ ${c}` : `- ${Math.abs(c)}`) : ''}`,
    };
  }

  // 5. Try Linear: mx + b
  if (expr.includes('x')) {
    let clean = expr;
    let m = 1;
    let b = 0;

    const mMatch = clean.match(/([+-]?\d*)\*?x/i);
    if (mMatch) {
      if (mMatch[1] === '' || mMatch[1] === '+') m = 1;
      else if (mMatch[1] === '-') m = -1;
      else m = parseFloat(mMatch[1]);
    }

    clean = clean.replace(/([+-]?\d*)\*?x/i, '');
    if (clean) {
      const bVal = parseFloat(clean);
      if (!isNaN(bVal)) b = bVal;
    }

    return {
      success: true,
      type: 'linear',
      params: { m, b },
      canonical: `${m === 1 ? '' : m}x ${b !== 0 ? (b > 0 ? `+ ${b}` : `- ${Math.abs(b)}`) : ''}`,
    };
  }

  return null;
}
