import { CompletingTheSquareDetail, FunctionType, InverseSolution, StepItem } from '../types/math';

// Helper to format numbers cleanly (e.g. 2 instead of 2.0, or fraction string)
export function formatNum(n: number): string {
  if (Math.abs(n - Math.round(n)) < 1e-6) {
    return Math.round(n).toString();
  }
  // Try simple fractions up to denominator 16
  for (let d = 2; d <= 16; d++) {
    const num = Math.round(n * d);
    if (Math.abs(n - num / d) < 1e-5) {
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

// 1. QUADRATIC SOLVER WITH COMPLETING THE SQUARE (配方法)
export function solveQuadratic(
  a: number,
  b: number,
  c: number,
  branch: '+' | '-' = '+'
): InverseSolution {
  // f(x) = a x^2 + b x + c
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

  // Completing the square calculations
  // Equation after swap: x = a y^2 + b y + c
  // Step 3a: x - c = a(y^2 + (b/a)y)
  const bOverA = b / a;
  const halfBOverA = bOverA / 2;
  const squareTerm = halfBOverA * halfBOverA;

  // Let's build the completing the square object
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

  // Inverse equation:
  // f^{-1}(x) = h +/- \sqrt{(x - k)/a}
  const hTerm = h !== 0 ? formatNum(h) : '';
  const sign = branch === '+' ? '+' : '-';
  const insideRoot = a === 1 ? `x ${formatSignedNum(-k)}` : `\\frac{x ${formatSignedNum(-k)}}{${formatNum(a)}}`;
  const invEq = h !== 0 
    ? `f^{-1}(x) = ${hTerm} ${sign} \\sqrt{${insideRoot}}`
    : `f^{-1}(x) = ${branch === '-' ? '-' : ''}\\sqrt{${insideRoot}}`;

  const steps: StepItem[] = [
    {
      stepNumber: 1,
      title: 'Replace f(x) with y',
      latex: `y = ${aStr}x^2 ${bTerm} ${cTerm}`,
      explanation: 'Rewrite the function using coordinate variable y. This sets up the relationship between inputs and outputs.',
      badge: 'Step 1: Setup',
    },
    {
      stepNumber: 2,
      title: 'Swap x and y (The Inverse Step)',
      latex: `x = ${aStr}y^2 ${b !== 0 ? (b > 0 ? `+ ${formatNum(b)}y` : `- ${formatNum(Math.abs(b))}y`) : ''} ${cTerm}`,
      explanation: 'Interchange the roles of x and y. Geometrically, this reflects every point (x, y) across the identity line y = x.',
      tip: 'This is the defining operation of finding an inverse function.',
      badge: 'Step 2: Core Swap',
    },
    {
      stepNumber: 3,
      title: 'Isolate Variable Terms (Completing the Square Prep)',
      latex: `x ${formatSignedNum(-c)} = ${a === 1 ? '' : a === -1 ? '-' : formatNum(a)}y^2 ${b !== 0 ? (b > 0 ? `+ ${formatNum(b)}y` : `- ${formatNum(Math.abs(b))}y`) : ''}`,
      explanation: `Subtract the constant ${formatNum(c)} from both sides so all y terms remain together.`,
      badge: 'Step 3A: Isolate',
    },
  ];

  if (a !== 1) {
    steps.push({
      stepNumber: 4,
      title: 'Divide by Leading Coefficient (a)',
      latex: `\\frac{x ${formatSignedNum(-c)}}{${formatNum(a)}} = y^2 ${formatSignedNum(bOverA)}y`,
      explanation: `Divide the entire equation by ${formatNum(a)} to ensure the coefficient of y² is 1 before completing the square.`,
      badge: 'Step 3B: Normalize',
    });
  }

  steps.push(
    {
      stepNumber: steps.length + 1,
      title: 'Find the Magic Term to Complete the Square',
      latex: `\\left(\\frac{\\text{coefficient of } y}{2}\\right)^2 = \\left(\\frac{${formatNum(bOverA)}}{2}\\right)^2 = \\left(${formatNum(halfBOverA)}\\right)^2 = ${formatNum(squareTerm)}`,
      explanation: `Take half of the linear coefficient (${formatNum(bOverA)}), which is ${formatNum(halfBOverA)}, and square it to get ${formatNum(squareTerm)}. Add this to BOTH sides!`,
      tip: 'Adding this creates a perfect square trinomial (y + d)² on the right side.',
      badge: 'Step 3C: Completing the Square',
    },
    {
      stepNumber: steps.length + 1,
      title: 'Add to Both Sides and Factor into a Perfect Square',
      latex: `\\frac{x ${formatSignedNum(-k)}}{${formatNum(a)}} = \\left(y ${formatSignedNum(halfBOverA)}\\right)^2`,
      explanation: `Combine the constants on the left side and factor the right side into the binomial square (y ${formatSignedNum(halfBOverA)})².`,
      badge: 'Step 3D: Factor Trinomial',
    },
    {
      stepNumber: steps.length + 1,
      title: 'Take the Square Root of Both Sides & Branch Selection',
      latex: `y ${formatSignedNum(halfBOverA)} = \\pm \\sqrt{${insideRoot}}`,
      explanation: `Take the square root of both sides. Because the original function required a restricted domain of ${domainOrig} to pass the Horizontal Line Test (one-to-one function), we choose the ${branch === '+' ? 'positive (+' : 'negative (-'} branch.`,
      tip: `Since x ≥ ${formatNum(h)} originally, the inverse output y must satisfy y ≥ ${formatNum(h)}, meaning we pick the positive root.`,
      badge: 'Step 3E: Square Root & Domain',
    },
    {
      stepNumber: steps.length + 1,
      title: 'Isolate y to Form the Inverse Function',
      latex: invEq,
      explanation: `Subtract ${formatNum(halfBOverA)} from both sides and replace y with the formal inverse notation f⁻¹(x).`,
      badge: 'Step 4: Final Inverse',
    }
  );

  return {
    originalEquation: origEq,
    inverseEquation: invEq,
    functionType: 'quadratic',
    domainOriginal: domainOrig,
    rangeOriginal: rangeOrig,
    domainInverse: domainInv,
    rangeInverse: rangeInv,
    isOneToOne: false, // Originally not 1-to-1 without restriction
    restrictionNote: `Requires domain restriction x ${branch === '+' ? '\\ge' : '\\le'} ${formatNum(h)} to pass the Horizontal Line Test and be invertible.`,
    steps,
    completingSquareDetail: completingSquare,
    verificationSteps: {
      composition1: `f(f^{-1}(x)) = ${a === 1 ? '' : formatNum(a)}\\left(${invEq.replace('f^{-1}(x) = ', '')}\\right)^2 + \\dots = x`,
      composition2: `f^{-1}(f(x)) = ${invEq.replace('f^{-1}(x) = ', '').replace(/x/g, `(${origEq.replace('f(x) = ', '')})`)} = x`,
      explanation: 'Substituting f⁻¹(x) into f(x) algebraically simplifies directly to x for all values in the restricted domain.',
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

// 2. RATIONAL SOLVER: f(x) = (ax + b) / (cx + d)
export function solveRational(a: number, b: number, c: number, d: number): InverseSolution {
  // f(x) = (ax + b)/(cx + d)
  // Inverse: x = (ay + b)/(cy + d)
  // x(cy + d) = ay + b => cxy + dx = ay + b => cxy - ay = b - dx => y(cx - a) = -dx + b => y = (-dx + b)/(cx - a)
  // Notice the beautiful determinant swap rule! Swap a and d with signs negated!
  const aStr = a === 1 ? 'x' : a === -1 ? '-x' : `${formatNum(a)}x`;
  const bTerm = b !== 0 ? formatSignedNum(b) : '';
  const numOrig = `${a !== 0 ? aStr : ''} ${bTerm}`.trim();

  const cStr = c === 1 ? 'x' : c === -1 ? '-x' : `${formatNum(c)}x`;
  const dTerm = d !== 0 ? formatSignedNum(d) : '';
  const denOrig = `${c !== 0 ? cStr : ''} ${dTerm}`.trim();

  const origEq = `f(x) = \\frac{${numOrig}}{${denOrig}}`;

  const invNum = `${-d !== 0 ? ( -d === 1 ? 'x' : -d === -1 ? '-x' : `${formatNum(-d)}x` ) : ''} ${b !== 0 ? formatSignedNum(b) : ''}`.trim() || '0';
  const invDen = `${c !== 0 ? ( c === 1 ? 'x' : c === -1 ? '-x' : `${formatNum(c)}x` ) : ''} ${-a !== 0 ? formatSignedNum(-a) : ''}`.trim();

  const invEq = `f^{-1}(x) = \\frac{${invNum}}{${invDen}}`;

  const origAsymptoteX = -d / c;
  const origAsymptoteY = a / c;

  const domainOrig = `\\{x \\in \\mathbb{R} \\mid x \\neq ${formatNum(origAsymptoteX)}\\}`;
  const rangeOrig = `\\{y \\in \\mathbb{R} \\mid y \\neq ${formatNum(origAsymptoteY)}\\}`;
  const domainInv = `\\{x \\in \\mathbb{R} \\mid x \\neq ${formatNum(origAsymptoteY)}\\}`;
  const rangeInv = `\\{y \\in \\mathbb{R} \\mid y \\neq ${formatNum(origAsymptoteX)}\\}`;

  const steps: StepItem[] = [
    {
      stepNumber: 1,
      title: 'Replace f(x) with y',
      latex: `y = \\frac{${numOrig}}{${denOrig}}`,
      explanation: 'Convert the function notation into variable y to prepare for coordinate inversion.',
      badge: 'Step 1: Setup',
    },
    {
      stepNumber: 2,
      title: 'Swap x and y',
      latex: `x = \\frac{${a !== 0 ? `${formatNum(a)}y` : ''} ${bTerm}}{${c !== 0 ? `${formatNum(c)}y` : ''} ${dTerm}}`,
      explanation: 'Swap every instance of x with y, reflecting the graph across the identity line y = x.',
      tip: 'Notice that y now appears in both the numerator and the denominator.',
      badge: 'Step 2: Core Swap',
    },
    {
      stepNumber: 3,
      title: 'Clear the Denominator (Cross Multiply)',
      latex: `x(${denOrig.replace(/x/g, 'y')}) = ${numOrig.replace(/x/g, 'y')}`,
      explanation: `Multiply both sides by the denominator (${denOrig.replace(/x/g, 'y')}) to eliminate the fraction.`,
      badge: 'Step 3: Clear Fraction',
    },
    {
      stepNumber: 4,
      title: 'Distribute x into the Parentheses',
      latex: `${c !== 0 ? `${formatNum(c)}xy` : ''} ${d !== 0 ? `${formatSignedNum(d)}x` : ''} = ${a !== 0 ? `${formatNum(a)}y` : ''} ${bTerm}`,
      explanation: 'Expand the left-hand side so terms with y can be isolated.',
      badge: 'Step 4: Distribute',
    },
    {
      stepNumber: 5,
      title: 'Collect All Terms Containing y on One Side',
      latex: `${c !== 0 ? `${formatNum(c)}xy` : ''} ${-a !== 0 ? formatSignedNum(-a) : ''}y = ${-d !== 0 ? `${formatNum(-d)}x` : ''} ${bTerm}`,
      explanation: 'Move all terms with y to the left-hand side and all non-y terms to the right-hand side.',
      badge: 'Step 5: Collect y Terms',
    },
    {
      stepNumber: 6,
      title: 'Factor Out y as a Common Factor',
      latex: `y(${invDen}) = ${invNum}`,
      explanation: 'Factor y out of the left-hand terms so that y appears only once.',
      tip: 'This factoring step is the crucial algebraic technique for rational inverses!',
      badge: 'Step 6: Factor y',
    },
    {
      stepNumber: 7,
      title: 'Divide by the Factor to Isolate y and State f⁻¹(x)',
      latex: invEq,
      explanation: `Divide both sides by (${invDen}) to completely isolate y and write the final inverse function.`,
      badge: 'Step 7: Final Result',
    },
  ];

  return {
    originalEquation: origEq,
    inverseEquation: invEq,
    functionType: 'rational',
    domainOriginal: domainOrig,
    rangeOriginal: rangeOrig,
    domainInverse: domainInv,
    rangeInverse: rangeInv,
    isOneToOne: true,
    steps,
    verificationSteps: {
      composition1: `f(f^{-1}(x)) = \\frac{${formatNum(a)}\\left(${invEq.replace('f^{-1}(x) = ', '')}\\right) ${bTerm}}{${formatNum(c)}\\left(${invEq.replace('f^{-1}(x) = ', '')}\\right) ${dTerm}} = x`,
      composition2: `f^{-1}(f(x)) = x`,
      explanation: 'When composed, common binomial factors cancel out, confirming identity f(f⁻¹(x)) = x.',
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

// 3. LINEAR SOLVER: f(x) = mx + b
export function solveLinear(m: number, b: number): InverseSolution {
  const mStr = m === 1 ? 'x' : m === -1 ? '-x' : `${formatNum(m)}x`;
  const bTerm = b !== 0 ? formatSignedNum(b) : '';
  const origEq = `f(x) = ${mStr} ${bTerm}`.trim();

  const invEq = b !== 0 
    ? `f^{-1}(x) = \\frac{x ${formatSignedNum(-b)}}{${formatNum(m)}}` 
    : `f^{-1}(x) = \\frac{x}{${formatNum(m)}}`;

  const steps: StepItem[] = [
    {
      stepNumber: 1,
      title: 'Replace f(x) with y',
      latex: `y = ${mStr} ${bTerm}`,
      explanation: 'Set up coordinate variables for input and output.',
      badge: 'Step 1: Setup',
    },
    {
      stepNumber: 2,
      title: 'Swap x and y',
      latex: `x = ${m === 1 ? 'y' : m === -1 ? '-y' : `${formatNum(m)}y`} ${bTerm}`,
      explanation: 'Swap x and y to reflect across the line y = x.',
      badge: 'Step 2: Core Swap',
    },
    {
      stepNumber: 3,
      title: 'Isolate the y Term',
      latex: `x ${formatSignedNum(-b)} = ${m === 1 ? 'y' : m === -1 ? '-y' : `${formatNum(m)}y`}`,
      explanation: `Add or subtract ${formatNum(Math.abs(b))} to isolate the term with y.`,
      badge: 'Step 3: Isolate',
    },
    {
      stepNumber: 4,
      title: 'Divide by Slope m',
      latex: invEq,
      explanation: `Divide both sides by ${formatNum(m)} to solve for y. Notice the slope of the inverse is 1/m!`,
      tip: 'The slope of a linear inverse function is the reciprocal of the original slope.',
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
    steps,
    verificationSteps: {
      composition1: `f(f^{-1}(x)) = ${formatNum(m)}\\left(\\frac{x ${formatSignedNum(-b)}}{${formatNum(m)}}\\right) ${bTerm} = (x ${formatSignedNum(-b)}) ${bTerm} = x`,
      composition2: `f^{-1}(f(x)) = \\frac{(${mStr} ${bTerm}) ${formatSignedNum(-b)}}{${formatNum(m)}} = \\frac{${mStr}}{${formatNum(m)}} = x`,
      explanation: 'Multiplying by m and dividing by m cancels out, giving the identity x.',
    },
    evaluateOriginal: (xVal: number) => m * xVal + b,
    evaluateInverse: (xVal: number) => (xVal - b) / m,
  };
}

// 4. RADICAL (SQUARE ROOT) SOLVER: f(x) = a \sqrt{bx + c} + d
export function solveRadical(a: number, b: number, c: number, d: number): InverseSolution {
  const inside = `${b === 1 ? 'x' : `${formatNum(b)}x`} ${c !== 0 ? formatSignedNum(c) : ''}`.trim();
  const aPrefix = a === 1 ? '' : a === -1 ? '-' : `${formatNum(a)}`;
  const dTerm = d !== 0 ? formatSignedNum(d) : '';
  const origEq = `f(x) = ${aPrefix}\\sqrt{${inside}} ${dTerm}`.trim();

  const minX = -c / b;
  const domainOrig = b > 0 ? `[${formatNum(minX)}, \\infty)` : `(-\\infty, ${formatNum(minX)}]`;
  const rangeOrig = a > 0 ? `[${formatNum(d)}, \\infty)` : `(-\\infty, ${formatNum(d)}]`;

  const invNum = a === 1 ? `(x ${formatSignedNum(-d)})^2` : `\\left(\\frac{x ${formatSignedNum(-d)}}{${formatNum(a)}}\\right)^2`;
  const invEq = `f^{-1}(x) = \\frac{${invNum} ${formatSignedNum(-c)}}{${formatNum(b)}}`;

  const steps: StepItem[] = [
    {
      stepNumber: 1,
      title: 'Replace f(x) with y',
      latex: `y = ${aPrefix}\\sqrt{${inside}} ${dTerm}`,
      explanation: 'Rewrite with variable y.',
      badge: 'Step 1: Setup',
    },
    {
      stepNumber: 2,
      title: 'Swap x and y',
      latex: `x = ${aPrefix}\\sqrt{${inside.replace(/x/g, 'y')}} ${dTerm}`,
      explanation: 'Interchange x and y.',
      badge: 'Step 2: Core Swap',
    },
    {
      stepNumber: 3,
      title: 'Isolate the Radical on One Side',
      latex: a === 1 
        ? `x ${formatSignedNum(-d)} = \\sqrt{${inside.replace(/x/g, 'y')}}` 
        : `\\frac{x ${formatSignedNum(-d)}}{${formatNum(a)}} = \\sqrt{${inside.replace(/x/g, 'y')}}`,
      explanation: 'Move non-radical terms to the opposite side and divide by the outer coefficient.',
      badge: 'Step 3: Isolate Radical',
    },
    {
      stepNumber: 4,
      title: 'Square Both Sides to Eliminate the Radical',
      latex: `${invNum} = ${inside.replace(/x/g, 'y')}`,
      explanation: 'Squaring the square root removes the radical sign.',
      tip: 'Remember that squaring introduces domain restrictions on the inverse!',
      badge: 'Step 4: Square Both Sides',
    },
    {
      stepNumber: 5,
      title: 'Solve for y and Apply Domain Restriction',
      latex: `${invEq}, \\quad x ${a > 0 ? '\\ge' : '\\le'} ${formatNum(d)}`,
      explanation: `Isolate y. Note that because the range of the square root function is ${rangeOrig}, the inverse domain is restricted to x ${a > 0 ? '≥' : '≤'} ${formatNum(d)}.`,
      badge: 'Step 5: Final Inverse',
    },
  ];

  return {
    originalEquation: origEq,
    inverseEquation: `${invEq}, \\, x \\ge ${formatNum(d)}`,
    functionType: 'radical',
    domainOriginal: domainOrig,
    rangeOriginal: rangeOrig,
    domainInverse: rangeOrig,
    rangeInverse: domainOrig,
    isOneToOne: true,
    steps,
    verificationSteps: {
      composition1: `f(f^{-1}(x)) = \\sqrt{${b}\\left(${invEq.replace('f^{-1}(x) = ', '')}\\right) ${formatSignedNum(c)}} ${dTerm} = x`,
      composition2: `f^{-1}(f(x)) = x`,
      explanation: 'The radical and squaring operations invert each other on the defined domain.',
    },
    evaluateOriginal: (xVal: number) => {
      const under = b * xVal + c;
      if (under < 0) return null;
      return a * Math.sqrt(under) + d;
    },
    evaluateInverse: (xVal: number) => {
      if (a > 0 && xVal < d - 1e-4) return null;
      if (a < 0 && xVal > d + 1e-4) return null;
      const frac = (xVal - d) / a;
      return (frac * frac - c) / b;
    },
  };
}

// 5. EXPONENTIAL SOLVER: f(x) = a \cdot e^{bx + c} + d  or b^{x}
export function solveExponential(a: number, bVal: number, d: number): InverseSolution {
  // f(x) = a * e^x + d
  const aPrefix = a === 1 ? '' : a === -1 ? '-' : `${formatNum(a)}`;
  const dTerm = d !== 0 ? formatSignedNum(d) : '';
  const origEq = `f(x) = ${aPrefix}e^{x} ${dTerm}`.trim();

  const domainOrig = '(-\\infty, \\infty)';
  const rangeOrig = a > 0 ? `(${formatNum(d)}, \\infty)` : `(-\\infty, ${formatNum(d)})`;
  const domainInv = rangeOrig;
  const rangeInv = domainOrig;

  const invEq = a === 1 
    ? `f^{-1}(x) = \\ln(x ${formatSignedNum(-d)})`
    : `f^{-1}(x) = \\ln\\left(\\frac{x ${formatSignedNum(-d)}}{${formatNum(a)}}\\right)`;

  const steps: StepItem[] = [
    {
      stepNumber: 1,
      title: 'Replace f(x) with y',
      latex: `y = ${origEq.replace('f(x) = ', '')}`,
      explanation: 'Rewrite function with y.',
      badge: 'Step 1: Setup',
    },
    {
      stepNumber: 2,
      title: 'Swap x and y',
      latex: `x = ${aPrefix}e^{y} ${dTerm}`,
      explanation: 'Swap coordinates x and y.',
      badge: 'Step 2: Core Swap',
    },
    {
      stepNumber: 3,
      title: 'Isolate the Exponential Term eʸ',
      latex: a === 1 ? `x ${formatSignedNum(-d)} = e^y` : `\\frac{x ${formatSignedNum(-d)}}{${formatNum(a)}} = e^y`,
      explanation: 'Subtract the vertical shift and divide by the coefficient.',
      badge: 'Step 3: Isolate e^y',
    },
    {
      stepNumber: 4,
      title: 'Take the Natural Logarithm (ln) of Both Sides',
      latex: invEq,
      explanation: 'Applying ln undoes the exponential base e: ln(eʸ) = y.',
      tip: 'Logarithms are the inverses of exponentials by definition!',
      badge: 'Step 4: Take Logarithm',
    },
  ];

  return {
    originalEquation: origEq,
    inverseEquation: invEq,
    functionType: 'exponential',
    domainOriginal: domainOrig,
    rangeOriginal: rangeOrig,
    domainInverse: domainInv,
    rangeInverse: rangeInv,
    isOneToOne: true,
    steps,
    verificationSteps: {
      composition1: `f(f^{-1}(x)) = e^{\\ln(x ${formatSignedNum(-d)})} ${dTerm} = (x ${formatSignedNum(-d)}) ${dTerm} = x`,
      composition2: `f^{-1}(f(x)) = \\ln(e^x) = x`,
      explanation: 'e^(ln(u)) = u and ln(e^u) = u by logarithmic inversion.',
    },
    evaluateOriginal: (xVal: number) => a * Math.exp(xVal) + d,
    evaluateInverse: (xVal: number) => {
      const arg = (xVal - d) / a;
      if (arg <= 0) return null;
      return Math.log(arg);
    },
  };
}

// 6. CUBIC SOLVER: f(x) = a(x - h)^3 + k
export function solveCubic(a: number, h: number, k: number): InverseSolution {
  const aStr = a === 1 ? '' : a === -1 ? '-' : `${formatNum(a)}`;
  const hTerm = h !== 0 ? formatSignedNum(-h) : '';
  const kTerm = k !== 0 ? formatSignedNum(k) : '';
  const origEq = `f(x) = ${aStr}(x ${hTerm})^3 ${kTerm}`.trim();

  const insideCube = a === 1 ? `x ${formatSignedNum(-k)}` : `\\frac{x ${formatSignedNum(-k)}}{${formatNum(a)}}`;
  const hShift = h !== 0 ? formatSignedNum(h) : '';
  const invEq = `f^{-1}(x) = \\sqrt[3]{${insideCube}} ${hShift}`.trim();

  const steps: StepItem[] = [
    {
      stepNumber: 1,
      title: 'Replace f(x) with y',
      latex: `y = ${origEq.replace('f(x) = ', '')}`,
      explanation: 'Setup variable y.',
      badge: 'Step 1: Setup',
    },
    {
      stepNumber: 2,
      title: 'Swap x and y',
      latex: `x = ${aStr}(y ${hTerm})^3 ${kTerm}`,
      explanation: 'Swap coordinates x and y.',
      badge: 'Step 2: Core Swap',
    },
    {
      stepNumber: 3,
      title: 'Isolate the Cubed Term (y - h)³',
      latex: `${insideCube} = (y ${hTerm})^3`,
      explanation: 'Subtract k and divide by a.',
      badge: 'Step 3: Isolate Cube',
    },
    {
      stepNumber: 4,
      title: 'Take the Cube Root (∛) of Both Sides',
      latex: `\\sqrt[3]{${insideCube}} = y ${hTerm}`,
      explanation: 'Cube roots can accept both positive and negative values without domain restrictions!',
      tip: 'Unlike square roots, odd roots are naturally one-to-one across all real numbers.',
      badge: 'Step 4: Take Cube Root',
    },
    {
      stepNumber: 5,
      title: 'Isolate y',
      latex: invEq,
      explanation: `Add ${formatNum(h)} to both sides to solve for y.`,
      badge: 'Step 5: Final Result',
    },
  ];

  return {
    originalEquation: origEq,
    inverseEquation: invEq,
    functionType: 'cubic',
    domainOriginal: '(-\\infty, \\infty)',
    rangeOriginal: '(-\\infty, \\infty)',
    domainInverse: '(-\\infty, \\infty)',
    rangeInverse: '(-\\infty, \\infty)',
    isOneToOne: true,
    steps,
    verificationSteps: {
      composition1: `f(f^{-1}(x)) = \\left(\\left(\\sqrt[3]{${insideCube}}\\right)\\right)^3 = x`,
      composition2: `f^{-1}(f(x)) = x`,
      explanation: '(∛u)³ = u for all real numbers.',
    },
    evaluateOriginal: (xVal: number) => a * Math.pow(xVal - h, 3) + k,
    evaluateInverse: (xVal: number) => {
      const val = (xVal - k) / a;
      return Math.cbrt(val) + h;
    },
  };
}
