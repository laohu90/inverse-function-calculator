import { 
  CompletingTheSquareDetail, 
  FunctionType, 
  HorizontalLineTestResult, 
  InverseSolution, 
  PiecewiseBranch, 
  StepItem 
} from '../types/math';

// Helper to format numbers cleanly (e.g. 2 instead of 2.0, or fraction string)
export function formatNum(n: number): string {
  if (Math.abs(n) < 1e-10) return '0';
  if (Math.abs(n - Math.round(n)) < 1e-6) {
    return Math.round(n).toString();
  }
  // Check known constants
  if (Math.abs(n - Math.PI) < 1e-4) return '\\pi';
  if (Math.abs(n - Math.PI / 2) < 1e-4) return '\\frac{\\pi}{2}';
  if (Math.abs(n - Math.E) < 1e-4) return 'e';

  // Try simple fractions up to denominator 16
  for (let d = 2; d <= 16; d++) {
    const num = Math.round(n * d);
    if (Math.abs(n - num / d) < 1e-5) {
      if (num < 0) {
        return `-\\frac{${Math.abs(num)}}{${d}}`;
      }
      return `\\frac{${num}}{${d}}`;
    }
  }
  return Number(n.toFixed(3)).toString();
}

export function formatSignedNum(n: number): string {
  if (n >= 0) {
    return `+ ${formatNum(n)}`;
  } else {
    return `- ${formatNum(Math.abs(n))}`;
  }
}

// 1. LINEAR SOLVER: f(x) = mx + b
export function solveLinear(m: number, b: number): InverseSolution {
  if (Math.abs(m) < 1e-9) {
    throw new Error('Slope m cannot be 0 for an invertible linear function (constant functions fail the Horizontal Line Test).');
  }

  const mStr = m === 1 ? 'x' : m === -1 ? '-x' : `${formatNum(m)}x`;
  const bTerm = b !== 0 ? formatSignedNum(b) : '';
  const origEq = `f(x) = ${mStr} ${bTerm}`.trim();

  const invNumerator = b !== 0 ? `x ${formatSignedNum(-b)}` : 'x';
  const invEq = m === 1 
    ? (b !== 0 ? `f^{-1}(x) = x ${formatSignedNum(-b)}` : 'f^{-1}(x) = x')
    : `f^{-1}(x) = \\frac{${invNumerator}}{${formatNum(m)}}`;

  const hlt: HorizontalLineTestResult = {
    passed: true,
    isLocallyRestricted: false,
    title: 'Horizontal Line Test: PASSED (Global)',
    explanation: `Since slope m = ${formatNum(m)} ≠ 0, the function is strictly ${m > 0 ? 'increasing' : 'decreasing'} everywhere on (-∞, ∞). Every horizontal line y = c intersects the graph at exactly one unique point.`,
  };

  const steps: StepItem[] = [
    {
      stepNumber: 1,
      title: 'Replace f(x) with y',
      latex: `y = ${mStr} ${bTerm}`.trim(),
      explanation: 'Rewrite function notation using y to represent output values.',
      badge: 'Step 1: Setup',
    },
    {
      stepNumber: 2,
      title: 'Swap x and y (The Inverse Inversion)',
      latex: `x = ${m === 1 ? 'y' : m === -1 ? '-y' : `${formatNum(m)}y`} ${bTerm}`.trim(),
      explanation: 'Interchange the roles of input and output. Geometrically, this reflects the graph across the identity line y = x.',
      tip: 'The core definition of finding an inverse is swapping input x and output y.',
      badge: 'Step 2: Core Swap',
    },
    {
      stepNumber: 3,
      title: 'Isolate the y Term',
      latex: `x ${formatSignedNum(-b)} = ${m === 1 ? 'y' : m === -1 ? '-y' : `${formatNum(m)}y`}`,
      explanation: b !== 0 
        ? `Subtract ${formatNum(b)} from both sides to gather terms with y on one side.` 
        : 'The y term is already isolated.',
      badge: 'Step 3: Isolate',
    },
    {
      stepNumber: 4,
      title: 'Divide by Slope m & State Inverse',
      latex: invEq,
      explanation: `Divide both sides by ${formatNum(m)}. Notice that the inverse function slope is 1/m = ${formatNum(1 / m)}.`,
      tip: 'The slope of a linear inverse function is always the reciprocal of the original slope.',
      badge: 'Step 4: Solve y',
    },
  ];

  return {
    originalEquation: origEq,
    inverseEquation: invEq,
    functionType: 'linear',
    domainOriginal: '(-\\infty, \\infty)',
    rangeOriginal: '(-\\infty, \\infty)',
    domainInverse: '(-\\infty, \\infty)',
    rangeInverse: '(-\\infty, \\infty)',
    isOneToOne: true,
    horizontalLineTest: hlt,
    steps,
    verificationSteps: {
      composition1: `f(f^{-1}(x)) = ${formatNum(m)}\\left(${invEq.replace('f^{-1}(x) = ', '')}\\right) ${bTerm} = x`,
      composition2: `f^{-1}(f(x)) = \\frac{(${mStr} ${bTerm}) ${formatSignedNum(-b)}}{${formatNum(m)}} = x`,
      explanation: 'Multiplying by m and dividing by m cancels out to the identity x.',
    },
    evaluateOriginal: (xVal: number) => m * xVal + b,
    evaluateInverse: (xVal: number) => (xVal - b) / m,
  };
}

// 2. QUADRATIC SOLVER WITH COMPLETING THE SQUARE (配方法)
export function solveQuadratic(
  a: number,
  b: number,
  c: number,
  branch: '+' | '-' = '+'
): InverseSolution {
  if (Math.abs(a) < 1e-9) {
    return solveLinear(b, c);
  }

  // Vertex h = -b / (2a), k = c - b^2 / (4a)
  const h = -b / (2 * a);
  const k = c - (b * b) / (4 * a);

  const aStr = a === 1 ? '' : a === -1 ? '-' : formatNum(a);
  const bTerm = b !== 0 ? (b > 0 ? `+ ${b === 1 ? '' : formatNum(b)}x` : `- ${formatNum(Math.abs(b))}x`) : '';
  const cTerm = c !== 0 ? formatSignedNum(c) : '';
  const origEq = `f(x) = ${aStr}x^2 ${bTerm} ${cTerm}`.replace(/\s+/g, ' ').trim();

  const domainOrig = branch === '+' 
    ? `[${formatNum(h)}, \\infty)` 
    : `(-\\infty, ${formatNum(h)}]`;
  const rangeOrig = a > 0 
    ? `[${formatNum(k)}, \\infty)` 
    : `(-\\infty, ${formatNum(k)}]`;

  const domainInv = rangeOrig;
  const rangeInv = domainOrig;

  const bOverA = b / a;
  const halfBOverA = bOverA / 2;
  const squareTerm = halfBOverA * halfBOverA;

  const completingSquare: CompletingTheSquareDetail = {
    originalStandardForm: `y = ${origEq.replace('f(x) = ', '')}`,
    a,
    b,
    c,
    h,
    k,
    vertexForm: `${a === 1 ? '' : a === -1 ? '-' : formatNum(a)}(x ${formatSignedNum(-h)})^2 ${formatSignedNum(k)}`,
    step1_isolate: `x ${formatSignedNum(-c)} = ${a === 1 ? '' : a === -1 ? '-' : formatNum(a)}y^2 ${b !== 0 ? (b > 0 ? `+ ${formatNum(b)}y` : `- ${formatNum(Math.abs(b))}y`) : ''}`,
    step2_half_b: `\\text{Half of coefficient of } y = \\frac{${formatNum(b)}}{2 \\cdot (${formatNum(a)})} = ${formatNum(halfBOverA)}`,
    step3_add_both_sides: `\\left(${formatNum(halfBOverA)}\\right)^2 = ${formatNum(squareTerm)}`,
    step4_factor_perfect_square: `\\left(y ${formatSignedNum(halfBOverA)}\\right)^2 = \\frac{x ${formatSignedNum(-k)}}{${formatNum(a)}}`,
    step5_square_root_branch: `y ${formatSignedNum(halfBOverA)} = ${branch}\\sqrt{\\frac{x ${formatSignedNum(-k)}}{${formatNum(a)}}}`,
    chosenBranch: branch,
    domainRestriction: `x \\ge ${formatNum(h)}` + (branch === '-' ? ' (Left Branch: x \\le ' + formatNum(h) + ')' : ''),
    rangeRestriction: `y \\ge ${formatNum(k)}`,
  };

  const hTerm = h !== 0 ? formatNum(h) : '';
  const sign = branch === '+' ? '+' : '-';
  const insideRoot = a === 1 ? `x ${formatSignedNum(-k)}` : `\\frac{x ${formatSignedNum(-k)}}{${formatNum(a)}}`;
  const invEq = h !== 0 
    ? `f^{-1}(x) = ${hTerm} ${sign} \\sqrt{${insideRoot}}`
    : `f^{-1}(x) = ${branch === '-' ? '-' : ''}\\sqrt{${insideRoot}}`;

  const hlt: HorizontalLineTestResult = {
    passed: false,
    isLocallyRestricted: true,
    title: '在全实数域上不是一一对应，以下为主值分支',
    explanation: `二次抛物线在顶点 x = ${formatNum(h)} 两侧对称，在全实数域上不是一一对应。为求反函数，已将其定义域限制为主值单调区间 ${domainOrig}，在此区间内求得对应反函数。`,
    restrictedDomain: domainOrig,
    criticalPoints: [h],
  };

  const steps: StepItem[] = [
    {
      stepNumber: 1,
      title: 'Replace f(x) with y & State Domain Restriction',
      latex: `y = ${aStr}x^2 ${bTerm} ${cTerm}, \\quad x \\in ${domainOrig}`,
      explanation: `Because a quadratic fails the Horizontal Line Test across (-∞, ∞), we restrict x to the ${branch === '+' ? 'right' : 'left'} branch [${formatNum(h)}, ∞) to ensure it is one-to-one.`,
      badge: 'Step 1: Setup & Domain',
    },
    {
      stepNumber: 2,
      title: 'Swap x and y',
      latex: `x = ${aStr}y^2 ${b !== 0 ? (b > 0 ? `+ ${formatNum(b)}y` : `- ${formatNum(Math.abs(b))}y`) : ''} ${cTerm}`,
      explanation: 'Interchange x and y to begin solving for the inverse curve.',
      badge: 'Step 2: Core Swap',
    },
    {
      stepNumber: 3,
      title: 'Isolate Variable Terms (Completing the Square Prep)',
      latex: `x ${formatSignedNum(-c)} = ${a === 1 ? '' : a === -1 ? '-' : formatNum(a)}y^2 ${b !== 0 ? (b > 0 ? `+ ${formatNum(b)}y` : `- ${formatNum(Math.abs(b))}y`) : ''}`,
      explanation: `Subtract constant ${formatNum(c)} from both sides so all y terms remain together.`,
      badge: 'Step 3A: Isolate',
    },
  ];

  if (a !== 1) {
    steps.push({
      stepNumber: 4,
      title: 'Divide by Leading Coefficient (a)',
      latex: `\\frac{x ${formatSignedNum(-c)}}{${formatNum(a)}} = y^2 ${formatSignedNum(bOverA)}y`,
      explanation: `Divide the entire equation by ${formatNum(a)} so that the y² coefficient is 1.`,
      badge: 'Step 3B: Normalize',
    });
  }

  steps.push(
    {
      stepNumber: steps.length + 1,
      title: 'Find Term to Complete the Square: (b / 2a)²',
      latex: `\\left(\\frac{${formatNum(bOverA)}}{2}\\right)^2 = \\left(${formatNum(halfBOverA)}\\right)^2 = ${formatNum(squareTerm)}`,
      explanation: `Take half of the linear coefficient (${formatNum(halfBOverA)}) and square it (${formatNum(squareTerm)}). Add this to BOTH sides!`,
      tip: 'Adding this term forms a perfect square trinomial (y + d)² on the right-hand side.',
      badge: 'Step 3C: Completing the Square',
    },
    {
      stepNumber: steps.length + 1,
      title: 'Add to Both Sides and Factor into a Perfect Square',
      latex: `\\frac{x ${formatSignedNum(-k)}}{${formatNum(a)}} = \\left(y ${formatSignedNum(halfBOverA)}\\right)^2`,
      explanation: `Factor the right side into (y ${formatSignedNum(halfBOverA)})² and simplify constants on the left.`,
      badge: 'Step 3D: Factor Trinomial',
    },
    {
      stepNumber: steps.length + 1,
      title: 'Square Root & Branch Selection (Horizontal Line Test Requirement)',
      latex: `y ${formatSignedNum(halfBOverA)} = ${branch}\\sqrt{${insideRoot}}`,
      explanation: `Take the square root of both sides. Because original domain was restricted to ${domainOrig}, we select the ${branch === '+' ? 'positive (+)' : 'negative (-)'} branch.`,
      badge: 'Step 3E: Square Root & Branch',
    },
    {
      stepNumber: steps.length + 1,
      title: 'Isolate y & Specify Inverse Domain',
      latex: `${invEq}, \\quad x \\in ${domainInv}`,
      explanation: `Isolate y and state the domain of f⁻¹(x), which matches the range of the restricted original function.`,
      badge: 'Step 4: Final Inverse',
    }
  );

  return {
    originalEquation: origEq,
    inverseEquation: `${invEq}, \\, x \\in ${domainInv}`,
    functionType: 'quadratic',
    domainOriginal: domainOrig,
    rangeOriginal: rangeOrig,
    domainInverse: domainInv,
    rangeInverse: rangeInv,
    isOneToOne: false,
    restrictionNote: `Requires domain restriction x ${branch === '+' ? '\\ge' : '\\le'} ${formatNum(h)} to satisfy the Horizontal Line Test.`,
    horizontalLineTest: hlt,
    steps,
    completingSquareDetail: completingSquare,
    verificationSteps: {
      composition1: `f(f^{-1}(x)) = ${a === 1 ? '' : formatNum(a)}\\left(${invEq.replace('f^{-1}(x) = ', '')}\\right)^2 + \\dots = x`,
      composition2: `f^{-1}(f(x)) = x`,
      explanation: 'Algebraic substitution confirms f(f⁻¹(x)) = x and f⁻¹(f(x)) = x on the restricted domain.',
    },
    evaluateOriginal: (xVal: number) => {
      if (branch === '+' && xVal < h - 1e-4) return null;
      if (branch === '-' && xVal > h + 1e-4) return null;
      return a * xVal * xVal + b * xVal + c;
    },
    evaluateInverse: (xVal: number) => {
      const underRoot = (xVal - k) / a;
      if (underRoot < 0) return null;
      const rootVal = Math.sqrt(underRoot);
      return branch === '+' ? h + rootVal : h - rootVal;
    },
  };
}

// 3. POLYNOMIAL & CUBIC SOLVER: f(x) = a(x - h)^n + k
export function solvePolynomialPower(
  a: number,
  n: number,
  h: number = 0,
  k: number = 0,
  branch: '+' | '-' = '+'
): InverseSolution {
  if (n === 1) return solveLinear(a, k - a * h);
  if (n === 2) return solveQuadratic(a, -2 * a * h, a * h * h + k, branch);

  const isOdd = n % 2 !== 0;
  const aPrefix = a === 1 ? '' : a === -1 ? '-' : `${formatNum(a)}`;
  const hTerm = h !== 0 ? formatSignedNum(-h) : '';
  const kTerm = k !== 0 ? formatSignedNum(k) : '';

  const innerX = h !== 0 ? `(x ${hTerm})` : 'x';
  const origEq = `f(x) = ${aPrefix}${innerX}^${n} ${kTerm}`.trim();

  // Domain & Range
  let domainOrig = '(-\\infty, \\infty)';
  let rangeOrig = '(-\\infty, \\infty)';
  if (!isOdd) {
    domainOrig = branch === '+' ? `[${formatNum(h)}, \\infty)` : `(-\\infty, ${formatNum(h)}]`;
    rangeOrig = a > 0 ? `[${formatNum(k)}, \\infty)` : `(-\\infty, ${formatNum(k)}]`;
  }
  const domainInv = rangeOrig;
  const rangeInv = domainOrig;

  // Inverse expression:
  // x = a(y - h)^n + k
  // (x - k)/a = (y - h)^n
  // y - h = \sqrt[n]{(x - k)/a} (with branch if even)
  const insideRoot = a === 1 
    ? (k !== 0 ? `x ${formatSignedNum(-k)}` : 'x')
    : `\\frac{x ${formatSignedNum(-k)}}{${formatNum(a)}}`;

  let rootSymbol = n === 3 ? `\\sqrt[3]{${insideRoot}}` : `\\sqrt[${n}]{${insideRoot}}`;
  if (!isOdd && branch === '-') {
    rootSymbol = `-${rootSymbol}`;
  }

  const hShift = h !== 0 ? formatSignedNum(h) : '';
  const invEq = h !== 0 ? `f^{-1}(x) = ${rootSymbol} ${hShift}`.trim() : `f^{-1}(x) = ${rootSymbol}`;

  const hlt: HorizontalLineTestResult = isOdd
    ? {
        passed: true,
        isLocallyRestricted: false,
        title: '水平线检验：通过（全实数域一一对应）',
        explanation: `因为多项式次数 n = ${n} 为奇数且 a = ${formatNum(a)} ≠ 0，原函数 f(x) 在 (-∞, ∞) 上严格单调。任意水平线均与图像仅交于一个点，存在全域反函数。`,
      }
    : {
        passed: false,
        isLocallyRestricted: true,
        title: '在全实数域上不是一一对应，以下为主值分支',
        explanation: `偶次幂 n = ${n} 使原函数在对称轴 x = ${formatNum(h)} 两侧对称，在全实数域上不是一一对应。为求反函数，已将其定义域限制为主值单调区间 ${domainOrig}，在此区间内求得对应反函数。`,
        restrictedDomain: domainOrig,
        criticalPoints: [h],
      };

  const steps: StepItem[] = [
    {
      stepNumber: 1,
      title: 'Replace f(x) with y',
      latex: `y = ${aPrefix}${innerX}^${n} ${kTerm}`.trim() + (!isOdd ? `, \\quad x \\in ${domainOrig}` : ''),
      explanation: isOdd 
        ? 'Rewrite function notation using y.' 
        : `Rewrite using y and restrict x to ${domainOrig} to ensure injectivity (one-to-one).`,
      badge: 'Step 1: Setup',
    },
    {
      stepNumber: 2,
      title: 'Swap x and y (Reflect across y = x)',
      latex: `x = ${aPrefix}${h !== 0 ? `(y ${hTerm})` : 'y'}^${n} ${kTerm}`.trim(),
      explanation: 'Swap coordinates x and y.',
      badge: 'Step 2: Core Swap',
    },
    {
      stepNumber: 3,
      title: `Isolate the ${n}-th Power Term`,
      latex: `${insideRoot} = ${h !== 0 ? `(y ${hTerm})` : 'y'}^${n}`,
      explanation: k !== 0 || a !== 1 
        ? `Subtract constant ${formatNum(k)} and divide by ${formatNum(a)} to isolate the power term.` 
        : 'The power term is already isolated.',
      badge: 'Step 3: Isolate Power',
    },
    {
      stepNumber: 4,
      title: `Take the ${n}-th Root of Both Sides`,
      latex: `${rootSymbol} = ${h !== 0 ? `y ${hTerm}` : 'y'}`,
      explanation: isOdd 
        ? (n === 3 
            ? 'Take the cube root (∛). Odd roots preserve sign and are defined for all real numbers without ambiguity.' 
            : `Take the ${n}-th root (√[${n}]). Odd roots are defined for all real numbers without ambiguity.`)
        : `Take the ${n}-th root (√[${n}]). Because the domain was restricted to ${domainOrig}, we select the ${branch === '+' ? 'positive' : 'negative'} principal branch.`,
      badge: `Step 4: Take ${n}-th Root`,
    },
    {
      stepNumber: 5,
      title: 'Isolate y & Specify Domain Restriction',
      latex: `${invEq}${!isOdd ? `, \\quad x \\in ${domainInv}` : ''}`,
      explanation: h !== 0 
        ? `Add ${formatNum(h)} to both sides to solve for y.` 
        : 'Variable y is isolated. Write final inverse function notation.',
      badge: 'Step 5: Final Result',
    },
  ];

  return {
    originalEquation: origEq,
    inverseEquation: !isOdd ? `${invEq}, \\, x \\in ${domainInv}` : invEq,
    functionType: n === 3 ? 'cubic' : 'polynomial',
    domainOriginal: domainOrig,
    rangeOriginal: rangeOrig,
    domainInverse: domainInv,
    rangeInverse: rangeInv,
    isOneToOne: isOdd,
    restrictionNote: !isOdd ? `Requires domain restriction x ${branch === '+' ? '\\ge' : '\\le'} ${formatNum(h)} to pass the Horizontal Line Test.` : undefined,
    horizontalLineTest: hlt,
    steps,
    verificationSteps: {
      composition1: `f(f^{-1}(x)) = ${a === 1 ? '' : formatNum(a)}\\left(${rootSymbol}\\right)^${n} ${kTerm} = x`,
      composition2: `f^{-1}(f(x)) = x`,
      explanation: `Applying the ${n}-th power to the ${n}-th root simplifies identically to x.`,
    },
    evaluateOriginal: (xVal: number) => {
      if (!isOdd) {
        if (branch === '+' && xVal < h - 1e-4) return null;
        if (branch === '-' && xVal > h + 1e-4) return null;
      }
      return a * Math.pow(xVal - h, n) + k;
    },
    evaluateInverse: (xVal: number) => {
      const val = (xVal - k) / a;
      if (!isOdd && val < 0) return null;
      if (isOdd) {
        const signVal = val < 0 ? -1 : 1;
        const root = signVal * Math.pow(Math.abs(val), 1 / n);
        return root + h;
      } else {
        const root = Math.pow(val, 1 / n);
        return (branch === '+' ? root : -root) + h;
      }
    },
  };
}

// 4. CUBIC SHIFTED SOLVER (Convenience alias)
export function solveCubic(a: number, h: number, k: number): InverseSolution {
  return solvePolynomialPower(a, 3, h, k);
}

// 5. RATIONAL SOLVER: f(x) = (ax + b) / (cx + d)
export function solveRational(a: number, b: number, c: number, d: number): InverseSolution {
  // Check degeneracy: ad - bc = 0 means constant or undefined
  if (Math.abs(a * d - b * c) < 1e-9) {
    throw new Error('This rational function simplifies to a constant (ad - bc = 0) and is not invertible.');
  }

  const aStr = a === 1 ? 'x' : a === -1 ? '-x' : (a !== 0 ? `${formatNum(a)}x` : '');
  const bTerm = b !== 0 ? (a !== 0 ? formatSignedNum(b) : formatNum(b)) : (a === 0 ? '0' : '');
  const numOrig = `${aStr} ${b !== 0 && a !== 0 ? bTerm : (a === 0 ? bTerm : '')}`.trim() || '0';

  const cStr = c === 1 ? 'x' : c === -1 ? '-x' : (c !== 0 ? `${formatNum(c)}x` : '');
  const dTerm = d !== 0 ? (c !== 0 ? formatSignedNum(d) : formatNum(d)) : '';
  const denOrig = `${cStr} ${d !== 0 && c !== 0 ? dTerm : ''}`.trim() || '1';

  const origEq = `f(x) = \\frac{${numOrig}}{${denOrig}}`;

  // Determinant swap rule: swap a and d, negate both!
  // f^{-1}(x) = (-dx + b) / (cx - a)
  const negD = -d;
  const negA = -a;

  const invNumStr = negD === 1 ? 'x' : negD === -1 ? '-x' : (negD !== 0 ? `${formatNum(negD)}x` : '');
  const invBTerm = b !== 0 ? (negD !== 0 ? formatSignedNum(b) : formatNum(b)) : '';
  const invNum = `${invNumStr} ${invBTerm}`.trim() || '0';

  const invDenStr = c === 1 ? 'x' : c === -1 ? '-x' : (c !== 0 ? `${formatNum(c)}x` : '');
  const invATerm = negA !== 0 ? (c !== 0 ? formatSignedNum(negA) : formatNum(negA)) : '';
  const invDen = `${invDenStr} ${invATerm}`.trim() || '1';

  const invEq = `f^{-1}(x) = \\frac{${invNum}}{${invDen}}`;

  const origAsymptoteX = c !== 0 ? -d / c : null;
  const origAsymptoteY = c !== 0 ? a / c : null;

  const domainOrig = origAsymptoteX !== null 
    ? `\\{x \\in \\mathbb{R} \\mid x \\neq ${formatNum(origAsymptoteX)}\\}` 
    : '(-\\infty, \\infty)';
  const rangeOrig = origAsymptoteY !== null 
    ? `\\{y \\in \\mathbb{R} \\mid y \\neq ${formatNum(origAsymptoteY)}\\}` 
    : '(-\\infty, \\infty)';

  const domainInv = rangeOrig.replace(/y/g, 'x');
  const rangeInv = domainOrig.replace(/x/g, 'y');

  const hlt: HorizontalLineTestResult = {
    passed: true,
    isLocallyRestricted: false,
    title: 'Horizontal Line Test: PASSED (On Domain)',
    explanation: `The derivative f'(x) = (${formatNum(a * d - b * c)}) / (${denOrig})² does not change sign anywhere in its domain. The function is strictly monotonic on each interval and passes the Horizontal Line Test.`,
    restrictedDomain: domainOrig,
  };

  const steps: StepItem[] = [
    {
      stepNumber: 1,
      title: 'Replace f(x) with y & State Domain',
      latex: `y = \\frac{${numOrig}}{${denOrig}}, \\quad ${domainOrig}`,
      explanation: `Set up variable y. The original denominator cannot be zero, excluding x = ${origAsymptoteX !== null ? formatNum(origAsymptoteX) : 'N/A'}.`,
      badge: 'Step 1: Setup',
    },
    {
      stepNumber: 2,
      title: 'Swap x and y',
      latex: `x = \\frac{${numOrig.replace(/x/g, 'y')}}{${denOrig.replace(/x/g, 'y')}}`,
      explanation: 'Swap x and y to reflect the hyperbola across the line y = x.',
      badge: 'Step 2: Core Swap',
    },
    {
      stepNumber: 3,
      title: 'Clear Denominator (Cross Multiply)',
      latex: `x(${denOrig.replace(/x/g, 'y')}) = ${numOrig.replace(/x/g, 'y')}`,
      explanation: `Multiply both sides by (${denOrig.replace(/x/g, 'y')}) to eliminate the fraction.`,
      badge: 'Step 3: Clear Fraction',
    },
    {
      stepNumber: 4,
      title: 'Distribute and Expand',
      latex: `${c !== 0 ? `${formatNum(c)}xy` : ''} ${d !== 0 ? `${formatSignedNum(d)}x` : ''} = ${a !== 0 ? `${formatNum(a)}y` : ''} ${b !== 0 ? formatSignedNum(b) : ''}`,
      explanation: 'Expand the left side so all terms containing y can be grouped together.',
      badge: 'Step 4: Distribute',
    },
    {
      stepNumber: 5,
      title: 'Collect Terms Containing y on Left Side',
      latex: `(${invDen})y = ${invNum}`,
      explanation: `Move all terms with y to the left-hand side and all other terms to the right-hand side. Factor out y.`,
      tip: 'Factoring out y is the decisive algebraic step for rational function inverses.',
      badge: 'Step 5: Factor y',
    },
    {
      stepNumber: 6,
      title: 'Divide by Factor & State Explicit Domain',
      latex: `${invEq}, \\quad ${domainInv}`,
      explanation: `Divide both sides by (${invDen}) to isolate y. Exclude the vertical asymptote x = ${origAsymptoteY !== null ? formatNum(origAsymptoteY) : '0'} from the domain.`,
      badge: 'Step 6: Final Result',
    },
  ];

  return {
    originalEquation: origEq,
    inverseEquation: `${invEq}, \\, ${domainInv}`,
    functionType: 'rational',
    domainOriginal: domainOrig,
    rangeOriginal: rangeOrig,
    domainInverse: domainInv,
    rangeInverse: rangeInv,
    isOneToOne: true,
    horizontalLineTest: hlt,
    steps,
    verificationSteps: {
      composition1: `f(f^{-1}(x)) = \\frac{${formatNum(a)}\\left(\\frac{${invNum}}{${invDen}}\\right) ${bTerm}}{${formatNum(c)}\\left(\\frac{${invNum}}{${invDen}}\\right) ${dTerm}} = x`,
      composition2: `f^{-1}(f(x)) = x`,
      explanation: 'Multiplying through by common denominator clears fractions and simplifies identically to x.',
    },
    evaluateOriginal: (xVal: number) => {
      const den = c * xVal + d;
      if (Math.abs(den) < 1e-6) return null;
      return (a * xVal + b) / den;
    },
    evaluateInverse: (xVal: number) => {
      const den = c * xVal - a;
      if (Math.abs(den) < 1e-6) return null;
      return (-d * xVal + b) / den;
    },
  };
}

// 6. RADICAL SOLVER: f(x) = a \sqrt[n]{bx + c} + d
export function solveRadical(
  a: number,
  b: number,
  c: number,
  d: number,
  n: number = 2
): InverseSolution {
  const isSquareRoot = n === 2;
  const radicalSymbol = isSquareRoot ? '\\sqrt' : `\\sqrt[${n}]`;
  const inside = `${b === 1 ? 'x' : `${formatNum(b)}x`} ${c !== 0 ? formatSignedNum(c) : ''}`.trim();
  const aPrefix = a === 1 ? '' : a === -1 ? '-' : `${formatNum(a)}`;
  const dTerm = d !== 0 ? formatSignedNum(d) : '';
  const origEq = `f(x) = ${aPrefix}${radicalSymbol}{${inside}} ${dTerm}`.trim();

  const minX = -c / b;
  const domainOrig = isSquareRoot
    ? (b > 0 ? `[${formatNum(minX)}, \\infty)` : `(-\\infty, ${formatNum(minX)}]`)
    : '(-\\infty, \\infty)';

  const rangeOrig = isSquareRoot
    ? (a > 0 ? `[${formatNum(d)}, \\infty)` : `(-\\infty, ${formatNum(d)}]`)
    : '(-\\infty, \\infty)';

  const domainInv = rangeOrig;
  const rangeInv = domainOrig;

  // Solving for y:
  // x = a \sqrt[n]{by + c} + d
  // (x - d)/a = \sqrt[n]{by + c}
  // ((x - d)/a)^n = by + c
  // y = (((x - d)/a)^n - c) / b
  const shiftedX = d !== 0 ? `(x ${formatSignedNum(-d)})` : 'x';
  const powerPart = a === 1 
    ? `${shiftedX}^${n}` 
    : `\\left(\\frac{x ${formatSignedNum(-d)}}{${formatNum(a)}}\\right)^${n}`;

  let invEq = '';
  if (b === 1 && c === 0) {
    invEq = `f^{-1}(x) = ${powerPart}`;
  } else if (b === 1) {
    invEq = `f^{-1}(x) = ${powerPart} ${formatSignedNum(-c)}`;
  } else {
    invEq = `f^{-1}(x) = \\frac{${powerPart} ${formatSignedNum(-c)}}{${formatNum(b)}}`;
  }

  const hlt: HorizontalLineTestResult = {
    passed: true,
    isLocallyRestricted: false,
    title: 'Horizontal Line Test: PASSED (Strictly Monotonic)',
    explanation: `Radical functions are strictly monotonic across their domain of definition. Every horizontal line y within range ${rangeOrig} intersects the curve exactly once.`,
    restrictedDomain: domainOrig,
  };

  const domainConditionStr = isSquareRoot ? `x ${a > 0 ? '\\ge' : '\\le'} ${formatNum(d)}` : '';

  const steps: StepItem[] = [
    {
      stepNumber: 1,
      title: 'Replace f(x) with y & State Natural Domain',
      latex: `y = ${aPrefix}${radicalSymbol}{${inside}} ${dTerm}, \\quad x \\in ${domainOrig}`,
      explanation: isSquareRoot 
        ? `The expression inside the square root must be non-negative: ${inside} ≥ 0, giving domain ${domainOrig}.` 
        : 'Set up variable y.',
      badge: 'Step 1: Setup',
    },
    {
      stepNumber: 2,
      title: 'Swap x and y',
      latex: `x = ${aPrefix}${radicalSymbol}{${inside.replace(/x/g, 'y')}} ${dTerm}`,
      explanation: 'Swap coordinates x and y.',
      badge: 'Step 2: Core Swap',
    },
    {
      stepNumber: 3,
      title: 'Isolate Radical on One Side',
      latex: a === 1 
        ? `${d !== 0 ? `x ${formatSignedNum(-d)}` : 'x'} = ${radicalSymbol}{${inside.replace(/x/g, 'y')}}` 
        : `\\frac{x ${formatSignedNum(-d)}}{${formatNum(a)}} = ${radicalSymbol}{${inside.replace(/x/g, 'y')}}`,
      explanation: 'Move vertical shifts and coefficients away from the radical term.',
      badge: 'Step 3: Isolate Radical',
    },
    {
      stepNumber: 4,
      title: `Raise Both Sides to Power ${n}`,
      latex: `${powerPart} = ${inside.replace(/x/g, 'y')}`,
      explanation: `Raising to power ${n} cancels the ${radicalSymbol} radical sign.`,
      tip: isSquareRoot ? 'CRITICAL: Squaring introduces an extraneous branch! The inverse domain must be restricted to x ≥ ' + formatNum(d) + '.' : undefined,
      badge: `Step 4: Raise to Power ${n}`,
    },
    {
      stepNumber: 5,
      title: 'Isolate y & Specify Explicit Domain Restriction',
      latex: `${invEq}${domainConditionStr ? `, \\quad ${domainConditionStr}` : ''}`,
      explanation: `Solve for y. Because the range of the original square root function was ${rangeOrig}, the inverse domain is strictly restricted to ${domainInv}!`,
      badge: 'Step 5: Final Result',
    },
  ];

  return {
    originalEquation: origEq,
    inverseEquation: `${invEq}${domainConditionStr ? `, \\, ${domainConditionStr}` : ''}`,
    functionType: 'radical',
    domainOriginal: domainOrig,
    rangeOriginal: rangeOrig,
    domainInverse: domainInv,
    rangeInverse: rangeInv,
    isOneToOne: true,
    restrictionNote: isSquareRoot ? `Domain restriction ${domainConditionStr} is strictly required because squaring creates a full parabola, whereas the original function is only half a parabola.` : undefined,
    horizontalLineTest: hlt,
    steps,
    verificationSteps: {
      composition1: `f(f^{-1}(x)) = ${radicalSymbol}{${formatNum(b)}\\left(${invEq.replace('f^{-1}(x) = ', '')}\\right) ${formatSignedNum(c)}} ${dTerm} = x`,
      composition2: `f^{-1}(f(x)) = x`,
      explanation: 'Radical and power operations invert each other on the defined domain.',
    },
    evaluateOriginal: (xVal: number) => {
      const under = b * xVal + c;
      if (isSquareRoot && under < 0) return null;
      if (!isSquareRoot && under < 0) {
        return -a * Math.pow(-under, 1 / n) + d;
      }
      return a * Math.pow(under, 1 / n) + d;
    },
    evaluateInverse: (xVal: number) => {
      if (isSquareRoot) {
        if (a > 0 && xVal < d - 1e-4) return null;
        if (a < 0 && xVal > d + 1e-4) return null;
      }
      const frac = (xVal - d) / a;
      return (Math.pow(frac, n) - c) / b;
    },
  };
}

// 7. EXPONENTIAL SOLVER: f(x) = a \cdot b^{cx + d} + k
export function solveExponential(
  a: number,
  base: number = Math.E,
  c: number = 1,
  d: number = 0,
  k: number = 0
): InverseSolution {
  const isNaturalBase = Math.abs(base - Math.E) < 1e-4;
  const baseStr = isNaturalBase ? 'e' : formatNum(base);

  const aPrefix = a === 1 ? '' : a === -1 ? '-' : `${formatNum(a)}`;
  const exponentInner = c === 1 
    ? (d !== 0 ? `x ${formatSignedNum(d)}` : 'x')
    : `${formatNum(c)}x ${d !== 0 ? formatSignedNum(d) : ''}`.trim();
  const kTerm = k !== 0 ? formatSignedNum(k) : '';

  const origEq = `f(x) = ${aPrefix}${baseStr}^{${exponentInner}} ${kTerm}`.trim();

  const domainOrig = '(-\\infty, \\infty)';
  const rangeOrig = a > 0 ? `(${formatNum(k)}, \\infty)` : `(-\\infty, ${formatNum(k)})`;
  const domainInv = rangeOrig;
  const rangeInv = domainOrig;

  // Inverse derivation:
  // x = a * base^{cy + d} + k
  // (x - k)/a = base^{cy + d}
  // Taking log base:
  // cy + d = log_base((x - k)/a)
  // If natural base: ln((x - k)/a)
  // If arbitrary base b: log_b((x - k)/a) = \frac{\ln((x - k)/a)}{\ln(b)}
  const shiftedX = k !== 0 ? `x ${formatSignedNum(-k)}` : 'x';
  const insideLog = a === 1 ? shiftedX : `\\frac{${shiftedX}}{${formatNum(a)}}`;

  let logExpr = isNaturalBase 
    ? `\\ln(${insideLog})` 
    : (base === 10 ? `\\log(${insideLog})` : `\\log_{${baseStr}}(${insideLog})`);

  let invEq = '';
  if (c === 1 && d === 0) {
    invEq = `f^{-1}(x) = ${logExpr}`;
  } else if (c === 1) {
    invEq = `f^{-1}(x) = ${logExpr} ${formatSignedNum(-d)}`;
  } else {
    invEq = `f^{-1}(x) = \\frac{${logExpr} ${formatSignedNum(-d)}}{${formatNum(c)}}`;
  }

  const hlt: HorizontalLineTestResult = {
    passed: true,
    isLocallyRestricted: false,
    title: 'Horizontal Line Test: PASSED (Strictly Monotonic)',
    explanation: `Exponential functions with base ${baseStr} > 0 (≠ 1) are strictly monotonic on (-∞, ∞). Horizontal lines y > ${formatNum(k)} intersect the graph exactly once.`,
  };

  const steps: StepItem[] = [
    {
      stepNumber: 1,
      title: 'Replace f(x) with y',
      latex: `y = ${origEq.replace('f(x) = ', '')}`,
      explanation: 'Set up coordinate variables x and y.',
      badge: 'Step 1: Setup',
    },
    {
      stepNumber: 2,
      title: 'Swap x and y',
      latex: `x = ${aPrefix}${baseStr}^{${exponentInner.replace(/x/g, 'y')}} ${kTerm}`.trim(),
      explanation: 'Swap coordinates x and y.',
      badge: 'Step 2: Core Swap',
    },
    {
      stepNumber: 3,
      title: `Isolate Exponential Term ${baseStr}^y`,
      latex: a === 1 
        ? `${shiftedX} = ${baseStr}^{${exponentInner.replace(/x/g, 'y')}}` 
        : `\\frac{${shiftedX}}{${formatNum(a)}} = ${baseStr}^{${exponentInner.replace(/x/g, 'y')}}`,
      explanation: `Subtract ${formatNum(k)} and divide by ${formatNum(a)} to isolate the exponential power.`,
      badge: 'Step 3: Isolate Base',
    },
    {
      stepNumber: 4,
      title: isNaturalBase ? 'Take Natural Logarithm (ln) of Both Sides' : `Take Logarithm (log_${baseStr}) of Both Sides (Change of Base)`,
      latex: isNaturalBase 
        ? `${logExpr} = ${exponentInner.replace(/x/g, 'y')}`
        : `${logExpr} = \\frac{\\ln\\left(${insideLog}\\right)}{\\ln(${baseStr})} = ${exponentInner.replace(/x/g, 'y')}`,
      explanation: isNaturalBase 
        ? 'Applying ln undoes base e: ln(eᵘ) = u.' 
        : `Using logarithm definition and change of base formula: log_${baseStr}(u) = ln(u) / ln(${baseStr}).`,
      tip: 'Logarithms are the inverses of exponential functions by definition.',
      badge: 'Step 4: Take Log',
    },
    {
      stepNumber: 5,
      title: 'Isolate y & Specify Explicit Domain Restriction',
      latex: `${invEq}, \\quad x \\in ${domainInv}`,
      explanation: `Solve for y. Because the range of ${origEq.replace('f(x) = ', '')} is ${rangeOrig}, the logarithm domain requires x ∈ ${domainInv} (arguments to logarithms must be strictly positive).`,
      badge: 'Step 5: Final Result',
    },
  ];

  return {
    originalEquation: origEq,
    inverseEquation: `${invEq}, \\, x \\in ${domainInv}`,
    functionType: 'exponential',
    domainOriginal: domainOrig,
    rangeOriginal: rangeOrig,
    domainInverse: domainInv,
    rangeInverse: rangeInv,
    isOneToOne: true,
    horizontalLineTest: hlt,
    steps,
    verificationSteps: {
      composition1: `f(f^{-1}(x)) = ${baseStr}^{\\ln(${insideLog})/\\ln(${baseStr})} = ${insideLog} = x`,
      composition2: `f^{-1}(f(x)) = x`,
      explanation: 'Exponential and logarithmic operations with the same base cancel to identity x.',
    },
    evaluateOriginal: (xVal: number) => a * Math.pow(base, c * xVal + d) + k,
    evaluateInverse: (xVal: number) => {
      const arg = (xVal - k) / a;
      if (arg <= 0) return null;
      const logVal = Math.log(arg) / Math.log(base);
      return (logVal - d) / c;
    },
  };
}

// 8. LOGARITHMIC SOLVER: f(x) = a \log_b(cx + d) + k
export function solveLogarithmic(
  a: number,
  base: number = Math.E,
  c: number = 1,
  d: number = 0,
  k: number = 0
): InverseSolution {
  const isNaturalBase = Math.abs(base - Math.E) < 1e-4;
  const baseStr = isNaturalBase ? 'e' : formatNum(base);

  const aPrefix = a === 1 ? '' : a === -1 ? '-' : `${formatNum(a)}`;
  const insideLog = c === 1 
    ? (d !== 0 ? `x ${formatSignedNum(d)}` : 'x')
    : `${formatNum(c)}x ${d !== 0 ? formatSignedNum(d) : ''}`.trim();
  const kTerm = k !== 0 ? formatSignedNum(k) : '';

  const logName = isNaturalBase 
    ? `\\ln(${insideLog})` 
    : (base === 10 ? `\\log(${insideLog})` : `\\log_{${baseStr}}(${insideLog})`);
  const origEq = `f(x) = ${aPrefix}${logName} ${kTerm}`.trim();

  const minX = -d / c;
  const domainOrig = c > 0 ? `(${formatNum(minX)}, \\infty)` : `(-\\infty, ${formatNum(minX)})`;
  const rangeOrig = '(-\\infty, \\infty)';

  const domainInv = rangeOrig;
  const rangeInv = domainOrig;

  // Derivation:
  // x = a * log_b(cy + d) + k
  // (x - k)/a = log_b(cy + d)
  // b^{(x - k)/a} = cy + d
  // y = (b^{(x - k)/a} - d) / c
  const shiftedX = k !== 0 ? `x ${formatSignedNum(-k)}` : 'x';
  const exponentFrac = a === 1 ? shiftedX : `\\frac{${shiftedX}}{${formatNum(a)}}`;

  let invEq = '';
  if (c === 1 && d === 0) {
    invEq = `f^{-1}(x) = ${baseStr}^{${exponentFrac}}`;
  } else if (c === 1) {
    invEq = `f^{-1}(x) = ${baseStr}^{${exponentFrac}} ${formatSignedNum(-d)}`;
  } else {
    invEq = `f^{-1}(x) = \\frac{${baseStr}^{${exponentFrac}} ${formatSignedNum(-d)}}{${formatNum(c)}}`;
  }

  const hlt: HorizontalLineTestResult = {
    passed: true,
    isLocallyRestricted: false,
    title: 'Horizontal Line Test: PASSED (Strictly Monotonic)',
    explanation: `Logarithmic functions are strictly monotonic across their domain ${domainOrig}. Every horizontal line intersects the curve exactly once.`,
    restrictedDomain: domainOrig,
  };

  const steps: StepItem[] = [
    {
      stepNumber: 1,
      title: 'Replace f(x) with y & State Logarithm Domain',
      latex: `y = ${origEq.replace('f(x) = ', '')}, \\quad x \\in ${domainOrig}`,
      explanation: `Arguments of logarithms must be strictly positive: ${insideLog} > 0, giving domain ${domainOrig}.`,
      badge: 'Step 1: Setup',
    },
    {
      stepNumber: 2,
      title: 'Swap x and y',
      latex: `x = ${aPrefix}${isNaturalBase ? `\\ln(${insideLog.replace(/x/g, 'y')})` : `\\log_{${baseStr}}(${insideLog.replace(/x/g, 'y')})`} ${kTerm}`.trim(),
      explanation: 'Swap coordinates x and y.',
      badge: 'Step 2: Core Swap',
    },
    {
      stepNumber: 3,
      title: 'Isolate the Logarithmic Term',
      latex: a === 1 
        ? `${shiftedX} = ${isNaturalBase ? `\\ln(${insideLog.replace(/x/g, 'y')})` : `\\log_{${baseStr}}(${insideLog.replace(/x/g, 'y')})`}`
        : `\\frac{${shiftedX}}{${formatNum(a)}} = ${isNaturalBase ? `\\ln(${insideLog.replace(/x/g, 'y')})` : `\\log_{${baseStr}}(${insideLog.replace(/x/g, 'y')})`}`,
      explanation: 'Subtract k and divide by leading coefficient a.',
      badge: 'Step 3: Isolate Log',
    },
    {
      stepNumber: 4,
      title: `Exponentiate Both Sides with Base ${baseStr}`,
      latex: `${baseStr}^{${exponentFrac}} = ${insideLog.replace(/x/g, 'y')}`,
      explanation: `Exponentiating with base ${baseStr} undoes the logarithm: ${baseStr}^{log_${baseStr}(u)} = u.`,
      badge: 'Step 4: Exponentiate',
    },
    {
      stepNumber: 5,
      title: 'Isolate y & State Inverse',
      latex: invEq,
      explanation: `Solve for y by subtracting ${formatNum(d)} and dividing by ${formatNum(c)}. The domain of the exponential inverse is all real numbers (-∞, ∞).`,
      badge: 'Step 5: Final Result',
    },
  ];

  return {
    originalEquation: origEq,
    inverseEquation: invEq,
    functionType: 'logarithmic',
    domainOriginal: domainOrig,
    rangeOriginal: rangeOrig,
    domainInverse: domainInv,
    rangeInverse: rangeInv,
    isOneToOne: true,
    horizontalLineTest: hlt,
    steps,
    verificationSteps: {
      composition1: `f(f^{-1}(x)) = \\ln(${baseStr}^{${exponentFrac}}) = x`,
      composition2: `f^{-1}(f(x)) = x`,
      explanation: 'Logarithm and exponential functions invert each other identically.',
    },
    evaluateOriginal: (xVal: number) => {
      const arg = c * xVal + d;
      if (arg <= 0) return null;
      return a * (Math.log(arg) / Math.log(base)) + k;
    },
    evaluateInverse: (xVal: number) => {
      const p = (xVal - k) / a;
      return (Math.pow(base, p) - d) / c;
    },
  };
}

// 9. TRIGONOMETRIC SOLVER: sin, cos, tan with Principal Branch Restrictions
export function solveTrigonometric(
  fn: 'sin' | 'cos' | 'tan',
  a: number = 1,
  b: number = 1,
  c: number = 0,
  d: number = 0
): InverseSolution {
  const aPrefix = a === 1 ? '' : a === -1 ? '-' : `${formatNum(a)}`;
  const inside = b === 1 ? (c !== 0 ? `x ${formatSignedNum(c)}` : 'x') : `${formatNum(b)}x ${c !== 0 ? formatSignedNum(c) : ''}`.trim();
  const dTerm = d !== 0 ? formatSignedNum(d) : '';
  const origEq = `f(x) = ${aPrefix}\\${fn}(${inside}) ${dTerm}`.trim();

  // Principal branch domains
  let domainOrig = `[-\\frac{\\pi}{2}, \\frac{\\pi}{2}]`;
  let rangeOrig = `[${formatNum(d - Math.abs(a))}, ${formatNum(d + Math.abs(a))}]`;
  let invFn = `\\arcsin`;

  if (fn === 'cos') {
    domainOrig = `[0, \\pi]`;
    invFn = `\\arccos`;
  } else if (fn === 'tan') {
    domainOrig = `(-\\frac{\\pi}{2}, \\frac{\\pi}{2})`;
    rangeOrig = `(-\\infty, \\infty)`;
    invFn = `\\arctan`;
  }

  const domainInv = rangeOrig;
  const rangeInv = domainOrig;

  const shiftedX = d !== 0 ? `x ${formatSignedNum(-d)}` : 'x';
  const insideArc = a === 1 ? shiftedX : `\\frac{${shiftedX}}{${formatNum(a)}}`;

  let invEq = `f^{-1}(x) = ${invFn}\\left(${insideArc}\\right)`;
  if (b !== 1 || c !== 0) {
    invEq = `f^{-1}(x) = \\frac{${invFn}\\left(${insideArc}\\right) ${formatSignedNum(-c)}}{${formatNum(b)}}`;
  }

  const hlt: HorizontalLineTestResult = {
    passed: false,
    isLocallyRestricted: true,
    title: 'Horizontal Line Test: Periodic Function (Principal Domain Restricted)',
    explanation: `Trigonometric function ${fn}(x) is periodic and repeats endlessly, failing the Horizontal Line Test on (-∞, ∞). Standard mathematics restricts its domain to principal branch ${domainOrig} where it is strictly monotonic.`,
    restrictedDomain: domainOrig,
  };

  const steps: StepItem[] = [
    {
      stepNumber: 1,
      title: `Replace f(x) with y & Apply Principal Branch Restriction`,
      latex: `y = ${origEq.replace('f(x) = ', '')}, \\quad x \\in ${domainOrig}`,
      explanation: `To make \\${fn}(x) invertible, we restrict x to standard principal branch ${domainOrig}.`,
      badge: 'Step 1: Setup & Domain Cut',
    },
    {
      stepNumber: 2,
      title: 'Swap x and y',
      latex: `x = ${aPrefix}\\${fn}(${inside.replace(/x/g, 'y')}) ${dTerm}`,
      explanation: 'Swap coordinates x and y.',
      badge: 'Step 2: Core Swap',
    },
    {
      stepNumber: 3,
      title: `Isolate \\${fn}(y)`,
      latex: `${insideArc} = \\${fn}(${inside.replace(/x/g, 'y')})`,
      explanation: `Subtract ${formatNum(d)} and divide by ${formatNum(a)}.`,
      badge: 'Step 3: Isolate Trig Term',
    },
    {
      stepNumber: 4,
      title: `Apply Inverse Trigonometric Function ${invFn}`,
      latex: `${invFn}\\left(${insideArc}\\right) = ${inside.replace(/x/g, 'y')}`,
      explanation: `Applying ${invFn} undoes the trigonometric operator within the principal range.`,
      badge: 'Step 4: Inverse Trig',
    },
    {
      stepNumber: 5,
      title: 'Isolate y & State Domain Restriction',
      latex: `${invEq}, \\quad x \\in ${domainInv}`,
      explanation: `Solve for y. The domain of ${invFn} is restricted to ${domainInv}.`,
      badge: 'Step 5: Final Result',
    },
  ];

  return {
    originalEquation: origEq,
    inverseEquation: `${invEq}, \\, x \\in ${domainInv}`,
    functionType: 'trigonometric',
    domainOriginal: domainOrig,
    rangeOriginal: rangeOrig,
    domainInverse: domainInv,
    rangeInverse: rangeInv,
    isOneToOne: false,
    restrictionNote: `Domain must be restricted to principal branch ${domainOrig} to satisfy the Horizontal Line Test.`,
    horizontalLineTest: hlt,
    steps,
    verificationSteps: {
      composition1: `f(f^{-1}(x)) = \\${fn}(${invFn}(x)) = x`,
      composition2: `f^{-1}(f(x)) = ${invFn}(\\${fn}(x)) = x`,
      explanation: 'Trig and inverse trig operators cancel on the restricted principal domain.',
    },
    evaluateOriginal: (xVal: number) => {
      const arg = b * xVal + c;
      if (fn === 'sin') return a * Math.sin(arg) + d;
      if (fn === 'cos') return a * Math.cos(arg) + d;
      return a * Math.tan(arg) + d;
    },
    evaluateInverse: (xVal: number) => {
      const frac = (xVal - d) / a;
      if (fn === 'sin' || fn === 'cos') {
        if (frac < -1 || frac > 1) return null;
      }
      let arcVal = 0;
      if (fn === 'sin') arcVal = Math.asin(frac);
      else if (fn === 'cos') arcVal = Math.acos(frac);
      else arcVal = Math.atan(frac);
      return (arcVal - c) / b;
    },
  };
}

// 10. INVERSE TRIG SOLVER: arcsin, arccos, arctan
export function solveInverseTrig(
  fn: 'arcsin' | 'arccos' | 'arctan',
  a: number = 1,
  b: number = 1,
  c: number = 0,
  d: number = 0
): InverseSolution {
  const origTrig = fn === 'arcsin' ? 'sin' : fn === 'arccos' ? 'cos' : 'tan';
  const aPrefix = a === 1 ? '' : a === -1 ? '-' : `${formatNum(a)}`;
  const inside = b === 1 ? (c !== 0 ? `x ${formatSignedNum(c)}` : 'x') : `${formatNum(b)}x ${c !== 0 ? formatSignedNum(c) : ''}`.trim();
  const dTerm = d !== 0 ? formatSignedNum(d) : '';
  const origEq = `f(x) = ${aPrefix}\\${fn}(${inside}) ${dTerm}`.trim();

  let domainOrig = `[-1, 1]`;
  let rangeOrig = `[-\\frac{\\pi}{2}, \\frac{\\pi}{2}]`;
  if (fn === 'arccos') {
    rangeOrig = `[0, \\pi]`;
  } else if (fn === 'arctan') {
    domainOrig = `(-\\infty, \\infty)`;
    rangeOrig = `(-\\frac{\\pi}{2}, \\frac{\\pi}{2})`;
  }

  const domainInv = rangeOrig;
  const rangeInv = domainOrig;

  const shiftedX = d !== 0 ? `x ${formatSignedNum(-d)}` : 'x';
  const insideTrig = a === 1 ? shiftedX : `\\frac{${shiftedX}}{${formatNum(a)}}`;

  let invEq = `f^{-1}(x) = \\${origTrig}\\left(${insideTrig}\\right)`;
  if (b !== 1 || c !== 0) {
    invEq = `f^{-1}(x) = \\frac{\\${origTrig}\\left(${insideTrig}\\right) ${formatSignedNum(-c)}}{${formatNum(b)}}`;
  }

  const hlt: HorizontalLineTestResult = {
    passed: true,
    isLocallyRestricted: false,
    title: 'Horizontal Line Test: PASSED (Strictly Monotonic)',
    explanation: `Inverse trigonometric functions are strictly monotonic across their defined domain.`,
    restrictedDomain: domainOrig,
  };

  const steps: StepItem[] = [
    {
      stepNumber: 1,
      title: 'Replace f(x) with y',
      latex: `y = ${origEq.replace('f(x) = ', '')}, \\quad x \\in ${domainOrig}`,
      explanation: `Set up variable y with natural domain ${domainOrig}.`,
      badge: 'Step 1: Setup',
    },
    {
      stepNumber: 2,
      title: 'Swap x and y',
      latex: `x = ${aPrefix}\\${fn}(${inside.replace(/x/g, 'y')}) ${dTerm}`,
      explanation: 'Swap coordinates x and y.',
      badge: 'Step 2: Core Swap',
    },
    {
      stepNumber: 3,
      title: `Apply Trigonometric Function \\${origTrig}`,
      latex: `\\${origTrig}\\left(${insideTrig}\\right) = ${inside.replace(/x/g, 'y')}`,
      explanation: `Applying \\${origTrig} inverts \\${fn}.`,
      badge: 'Step 3: Trig Inversion',
    },
    {
      stepNumber: 4,
      title: 'Isolate y & Specify Domain Restriction',
      latex: `${invEq}, \\quad x \\in ${domainInv}`,
      explanation: `Isolate y. The domain of the inverse function is restricted to ${domainInv}.`,
      badge: 'Step 4: Final Inverse',
    },
  ];

  return {
    originalEquation: origEq,
    inverseEquation: `${invEq}, \\, x \\in ${domainInv}`,
    functionType: 'inverse_trig',
    domainOriginal: domainOrig,
    rangeOriginal: rangeOrig,
    domainInverse: domainInv,
    rangeInverse: rangeInv,
    isOneToOne: true,
    horizontalLineTest: hlt,
    steps,
    verificationSteps: {
      composition1: `f(f^{-1}(x)) = \\${fn}(\\${origTrig}(x)) = x`,
      composition2: `f^{-1}(f(x)) = x`,
      explanation: 'Inverse trig and trig functions cancel to identity x on legal domains.',
    },
    evaluateOriginal: (xVal: number) => {
      const arg = b * xVal + c;
      if (fn === 'arcsin' || fn === 'arccos') {
        if (arg < -1 || arg > 1) return null;
      }
      let val = 0;
      if (fn === 'arcsin') val = Math.asin(arg);
      else if (fn === 'arccos') val = Math.acos(arg);
      else val = Math.atan(arg);
      return a * val + d;
    },
    evaluateInverse: (xVal: number) => {
      const frac = (xVal - d) / a;
      let val = 0;
      if (origTrig === 'sin') val = Math.sin(frac);
      else if (origTrig === 'cos') val = Math.cos(frac);
      else val = Math.tan(frac);
      return (val - c) / b;
    },
  };
}

// 11. PIECEWISE FUNCTION SOLVER
export function solvePiecewise(
  pieces: { expr: string; condition: string; parsed: InverseSolution }[]
): InverseSolution {
  if (pieces.length === 0) {
    throw new Error('Piecewise function must contain at least one branch.');
  }

  // Build piecewise LaTeX
  const origBranchesStr = pieces
    .map((p) => `${p.parsed.originalEquation.replace('f(x) = ', '')} & \\text{if } ${p.condition}`)
    .join(' \\\\ ');
  const origEq = `f(x) = \\begin{cases} ${origBranchesStr} \\end{cases}`;

  const branches: PiecewiseBranch[] = pieces.map((p) => {
    // Map condition to inverse condition:
    // e.g. condition x >= 0 on 2x+1 gives range y >= 1, so inverse condition is x >= 1
    return {
      originalCondition: p.condition,
      inverseCondition: p.parsed.domainInverse,
      originalExpr: p.parsed.originalEquation.replace('f(x) = ', ''),
      inverseExpr: p.parsed.inverseEquation.replace('f^{-1}(x) = ', '').split(',')[0],
      domainOriginal: p.parsed.domainOriginal,
      rangeOriginal: p.parsed.rangeOriginal,
      domainInverse: p.parsed.domainInverse,
      rangeInverse: p.parsed.rangeInverse,
      steps: p.parsed.steps,
    };
  });

  const invBranchesStr = branches
    .map((b) => `${b.inverseExpr} & \\text{if } x \\in ${b.domainInverse}`)
    .join(' \\\\ ');
  const invEq = `f^{-1}(x) = \\begin{cases} ${invBranchesStr} \\end{cases}`;

  const hlt: HorizontalLineTestResult = {
    passed: true,
    isLocallyRestricted: false,
    title: 'Horizontal Line Test: Piecewise Verification',
    explanation: 'Each branch is independently inverted. Verify that the output ranges of the pieces do not overlap horizontally.',
  };

  const steps: StepItem[] = [
    {
      stepNumber: 1,
      title: 'Decompose Piecewise Function into Individual Branches',
      latex: origEq,
      explanation: 'Analyze each domain interval separately and check for continuous monotonicity.',
      badge: 'Step 1: Decompose',
    },
    ...pieces.flatMap((p, idx) => [
      {
        stepNumber: idx + 2,
        title: `Invert Branch ${idx + 1}: for ${p.condition}`,
        latex: `f_${idx + 1}(x) = ${p.parsed.originalEquation.replace('f(x) = ', '')} \\implies f_${idx + 1}^{-1}(x) = ${p.parsed.inverseEquation.replace('f^{-1}(x) = ', '')}`,
        explanation: `Solve for the inverse of branch ${idx + 1} and map its output range into the inverse domain.`,
        badge: `Branch ${idx + 1}`,
      },
    ]),
    {
      stepNumber: pieces.length + 2,
      title: 'Assemble the Inverted Piecewise Function',
      latex: invEq,
      explanation: 'Combine the inverted branches with their corresponding domain restrictions.',
      badge: 'Step Final: Assemble',
    },
  ];

  return {
    originalEquation: origEq,
    inverseEquation: invEq,
    functionType: 'piecewise',
    domainOriginal: 'Piecewise domain',
    rangeOriginal: 'Piecewise range',
    domainInverse: 'Piecewise inverse domain',
    rangeInverse: 'Piecewise inverse range',
    isOneToOne: true,
    horizontalLineTest: hlt,
    steps,
    piecewiseBranches: branches,
    verificationSteps: {
      composition1: 'f(f^{-1}(x)) = x \\text{ (on each branch)}',
      composition2: 'f^{-1}(f(x)) = x \\text{ (on each branch)}',
      explanation: 'Each piecewise branch inverts its corresponding interval identically.',
    },
    evaluateOriginal: (xVal: number) => {
      for (const p of pieces) {
        const val = p.parsed.evaluateOriginal(xVal);
        if (val !== null) return val;
      }
      return null;
    },
    evaluateInverse: (xVal: number) => {
      for (const p of pieces) {
        const val = p.parsed.evaluateInverse(xVal);
        if (val !== null) return val;
      }
      return null;
    },
  };
}
