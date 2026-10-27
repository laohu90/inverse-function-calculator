export type SupportedLocale = 'en' | 'es' | 'fr' | 'pt' | 'zh';

export interface TranslationDictionary {
  localeName: string;
  flag: string;
  seoTitle: string;
  seoDesc: string;
  appTitle: string;
  appSubtitle: string;
  tagline: string;
  resetBtn: string;
  printBtn: string;
  shareBtn: string;
  copiedNotice: string;
  recent: string;
  tabs: {
    solver: string;
    completingSquare: string;
    completingSquareBadge: string;
    examples: string;
    practice: string;
    guide: string;
  };
  input: {
    placeholder: string;
    coefficientsTitle: string;
    coefficientsSubtitle: string;
    presetsLabel: string;
    selectFamily: string;
    quadBranchRight: string;
    quadBranchLeft: string;
    parabolaBranch: string;
  };
  functionFamilies: Record<string, { label: string; desc: string; badge: string }>;
  coefficients: {
    coefA: string;
    coefB: string;
    coefC: string;
    coefD: string;
    coefM: string;
    shiftH: string;
    shiftK: string;
    numerator: string;
    denominator: string;
  };
  subviews: {
    steps: string;
    table: string;
    evaluator: string;
    calculus: string;
  };
  subviewStatuses: {
    steps: string;
    table: string;
    evaluator: string;
    calculus: string;
  };
  result: {
    title: string;
    originalFunction: string;
    inverseFunction: string;
    domain: string;
    range: string;
    warningTitle: string;
    warningDesc: string;
    explainBtn: string;
    copyBtn: string;
    copyStepsBtn: string;
    shareBtn: string;
    exportBtn: string;
    deepDiveBtn: string;
    deepDivePrompt: string;
    explicitDomainBadge: string;
    domainOfF: string;
    rangeOfF: string;
    domainOfInv: string;
    rangeOfInv: string;
    copyAllSteps: string;
    compositionProofTitle: string;
  };
  hltText: {
    passedTitle: string;
    passedDesc: string;
    principalBranchTitle: string;
    principalBranchDesc: string;
  };
  nav: {
    regressionBtn: string;
    aboutBtn: string;
    privacyBtn: string;
    contactBtn: string;
    authorLabel: string;
  };
  stepsTitle: string;
  stepsSubtitle: string;
  verificationTitle: string;
  verificationDesc: string;
  evaluator: {
    title: string;
    subtitle: string;
    inputDomain: string;
    evaluateFor: string;
    quickTry: string;
    calculatedValue: string;
    outsideDomain: string;
    outsideDomainDesc: string;
  };
  table: {
    title: string;
    subtitle: string;
    colInputX: string;
    colOutputY: string;
    colPointF: string;
    colPointInv: string;
    colCheck: string;
    takeaway: string;
  };
  calculus: {
    hltTitle: string;
    derivativeLabel: string;
    criticalPointLabel: string;
    oneToOne: string;
    requiresDomainCut: string;
  };
  graph: {
    zoomIn: string;
    zoomOut: string;
    resetView: string;
    download: string;
    probeToggle: string;
    probeLabel: string;
    probeNote: string;
  };
  footerText: string;
}

export const TRANSLATIONS: Record<SupportedLocale, TranslationDictionary> = {
  en: {
    localeName: 'English',
    flag: '🇺🇸',
    seoTitle: 'Inverse Function Calculator – Free Step-by-Step Solver with Completing the Square',
    seoDesc: 'Solve inverse functions step-by-step with completing the square breakdown, domain & range, horizontal line test, graph of y = x, and proof. Free & instant.',
    appTitle: 'Inverse Function Calculator',
    appSubtitle: 'Step-by-Step Solver & Completing the Square',
    tagline: 'Interchange x & y • Solve for y • Domain & Range • Reflection y = x',
    resetBtn: 'Reset',
    printBtn: 'Print Worksheet',
    shareBtn: 'Share',
    copiedNotice: 'Copied!',
    recent: 'Recent:',
    tabs: {
      solver: 'Inverse Solver & Steps',
      completingSquare: 'Completing the Square Breakdown',
      completingSquareBadge: 'Deep Dive',
      examples: 'Worked Examples (12+)',
      practice: 'Practice Quiz',
      guide: 'Curriculum Guide & FAQ',
    },
    input: {
      placeholder: 'Type equation: e.g. x^2 + 4x + 1, x^4, x^3 + 1, (2x+3)/(x-5), 3x - 7, e^x',
      coefficientsTitle: 'Input Function Coefficients',
      coefficientsSubtitle: '(Adjust sliders or numbers to solve in real time)',
      presetsLabel: 'Presets:',
      selectFamily: 'Select Function Family:',
      quadBranchRight: 'Right Branch (+ root, x ≥ h)',
      quadBranchLeft: 'Left Branch (- root, x ≤ h)',
      parabolaBranch: 'Parabola Branch',
    },
    functionFamilies: {
      quadratic: { label: 'Quadratic (x²)', desc: 'Completing Square', badge: 'Popular' },
      rational: { label: 'Rational Fraction', desc: 'Cross-Multiply & Factor', badge: 'Key Skill' },
      linear: { label: 'Linear (mx + b)', desc: 'Slope reciprocal', badge: '' },
      radical: { label: 'Square Root (√x)', desc: 'Domain restriction', badge: '' },
      exponential: { label: 'Exponential (eˣ, 2ˣ)', desc: 'Logarithm ln(x)', badge: '' },
      cubic: { label: 'Polynomial / xⁿ', desc: 'x³, x⁴, xⁿ', badge: '' },
      logarithmic: { label: 'Logarithm (ln, log)', desc: 'Change of base', badge: '' },
      trigonometric: { label: 'Trig (sin, cos)', desc: 'Principal branch', badge: '' },
    },
    coefficients: {
      coefA: 'Leading Coefficient a',
      coefB: 'Linear Coefficient b',
      coefC: 'Constant Term c',
      coefD: 'Vertical Shift d',
      coefM: 'Slope m',
      shiftH: 'Horizontal Shift h',
      shiftK: 'Vertical Shift k',
      numerator: 'Numerator (ax + b)',
      denominator: 'Denominator (cx + d)',
    },
    subviews: {
      steps: 'Algebraic Steps',
      table: 'Values Table',
      evaluator: 'Point Evaluator',
      calculus: 'Derivative & HLT',
    },
    subviewStatuses: {
      steps: 'Step-by-step breakdown ready',
      table: 'Symmetry reflection table',
      evaluator: 'Plug-in coordinate calculator',
      calculus: 'Monotonicity & HLT analysis',
    },
    result: {
      title: 'Inverse Function Result',
      originalFunction: 'Original Function f(x):',
      inverseFunction: 'Inverse Function f⁻¹(x):',
      domain: 'Domain:',
      range: 'Range:',
      warningTitle: 'Common Pitfall to Avoid:',
      warningDesc: 'f⁻¹(x) represents the inverse function, NOT the reciprocal 1/f(x)!',
      explainBtn: 'View Steps',
      copyBtn: 'Copy',
      copyStepsBtn: 'Copy Steps',
      shareBtn: 'Share',
      exportBtn: 'Export',
      deepDiveBtn: 'Explore',
      deepDivePrompt: 'Deep dive into vertex form and binomial completing the square.',
      explicitDomainBadge: 'Explicit Domain Enforced',
      domainOfF: 'Domain of f:',
      rangeOfF: 'Range of f:',
      domainOfInv: 'Domain of f⁻¹:',
      rangeOfInv: 'Range of f⁻¹:',
      copyAllSteps: 'Copy All Steps',
      compositionProofTitle: 'Composition Proof & Identity Check',
    },
    hltText: {
      passedTitle: 'Horizontal Line Test: PASSED (Global 1-to-1)',
      passedDesc: 'Strictly monotonic across the entire natural domain. A unique inverse function exists globally.',
      principalBranchTitle: 'Not one-to-one on the entire real domain; the following is the principal branch',
      principalBranchDesc: 'The function is not globally one-to-one. Domain is restricted to the monotonic branch to provide an invertible principal branch.',
    },
    nav: {
      regressionBtn: '10 Regression Tests',
      aboutBtn: 'About',
      privacyBtn: 'Privacy Policy',
      contactBtn: 'Contact',
      authorLabel: 'Author:',
    },
    stepsTitle: 'Step-by-Step Algebraic Derivation',
    stepsSubtitle: 'Exact step transformations corresponding precisely to the inverse answer',
    verificationTitle: 'Composition Verification: f(f⁻¹(x)) = x and f⁻¹(f(x)) = x',
    verificationDesc: 'Algebraic substitution confirms identity cancellation on the restricted domain:',
    evaluator: {
      title: 'Inverse Point Evaluator: f⁻¹(a)',
      subtitle: 'Evaluate output for a specific input: "Given f(x), find f⁻¹(c)".',
      inputDomain: 'Valid Input Domain:',
      evaluateFor: 'Calculate for x =',
      quickTry: 'Quick Try:',
      calculatedValue: 'Calculated f⁻¹(x):',
      outsideDomain: 'Outside Valid Domain!',
      outsideDomainDesc: 'The value is outside the domain of f⁻¹(x). In real numbers, negative square roots and division by zero are undefined.',
    },
    table: {
      title: 'Values Comparison Table & Symmetry Reflection',
      subtitle: 'See how each coordinate point (x, y) on f(x) reflects into (y, x) on f⁻¹(x).',
      colInputX: 'Input x',
      colOutputY: 'Output y = f(x)',
      colPointF: 'Point on f(x)',
      colPointInv: 'Point on f⁻¹(x)',
      colCheck: 'Check: f⁻¹(y)',
      takeaway: 'Exam takeaway: If you have a table of values for f(x), simply swap the columns to get f⁻¹(x)!',
    },
    calculus: {
      hltTitle: 'Horizontal Line Test (HLT) & Invertibility',
      derivativeLabel: 'First Derivative f\'(x):',
      criticalPointLabel: 'Critical Point / Vertex:',
      oneToOne: 'Strictly Injective (1-to-1)',
      requiresDomainCut: 'Requires Domain Restriction',
    },
    graph: {
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      resetView: 'Reset View',
      download: 'Download PNG',
      probeToggle: 'Coordinate Probe',
      probeLabel: 'Probe x-value:',
      probeNote: 'Observe how (a, b) reflects across the line y = x to become (b, a)!',
    },
    footerText: 'Inverse Function Calculator & Completing the Square • High School Algebra 2 & Precalculus',
  },

  zh: {
    localeName: '中文 (简体)',
    flag: '🇨🇳',
    seoTitle: '反函数求解计算器 – 详细解题步骤、配方法拆解与坐标互换图像',
    seoDesc: '高一与高中函数核心解题工具：在线求反函数 f⁻¹(x)，包含完整的配方法拆解过程、互换x和y并解方程、定义域值域反转、y=x对称镜像与复合检验。',
    appTitle: '反函数求解计算器',
    appSubtitle: '详细解题步骤与配方法拆解',
    tagline: '互换 x 与 y • 解方程求 y • 定义域与值域映射 • 关于 y = x 轴对称镜像',
    resetBtn: '重置默认',
    printBtn: '打印解题卷',
    shareBtn: '分享',
    copiedNotice: '已复制！',
    recent: '最近输入:',
    tabs: {
      solver: '求反函数与详细推导',
      completingSquare: '配方法拆解深度剖析',
      completingSquareBadge: '核心痛点',
      examples: '经典题型库 (12+)',
      practice: '交互自测题',
      guide: '考点公式指南与常见疑问',
    },
    input: {
      placeholder: '输入表达式：例如 3x-7, x^2+4x+1, x^4, x^3+1, (2x+3)/(x-5), e^x, sqrt(x-1), 2^x',
      coefficientsTitle: '输入函数系数参数',
      coefficientsSubtitle: '(支持实时拖动滑块或修改数值进行即时求解)',
      presetsLabel: '经典题预设:',
      selectFamily: '选择函数类型:',
      quadBranchRight: '右分支 (+ 根号, x ≥ h)',
      quadBranchLeft: '左分支 (- 根号, x ≤ h)',
      parabolaBranch: '抛物线单调分支选择',
    },
    functionFamilies: {
      quadratic: { label: '二次函数 (x²)', desc: '配方法核心拆解', badge: '最热门' },
      rational: { label: '分式函数 (ax+b)/(cx+d)', desc: '去分母移项因式分解', badge: '核心考点' },
      linear: { label: '一次函数 (mx + b)', desc: '斜率倒数关系', badge: '' },
      radical: { label: '根式函数 (√x)', desc: '被开方数非负限制', badge: '' },
      exponential: { label: '指数函数 (eˣ, 2ˣ)', desc: '自然对数 ln(x)', badge: '' },
      cubic: { label: '多项式 / 幂函数 (xⁿ)', desc: 'x³, x⁴, xⁿ', badge: '' },
      logarithmic: { label: '对数函数 (ln, log)', desc: '换底公式求解', badge: '' },
      trigonometric: { label: '三角与反三角', desc: '主值分支限制', badge: '' },
    },
    coefficients: {
      coefA: '二次项系数 a',
      coefB: '一次项系数 b',
      coefC: '常数项 c',
      coefD: '垂直平移常数 d',
      coefM: '斜率 m',
      shiftH: '水平位移 h',
      shiftK: '垂直位移 k',
      numerator: '分子项 (ax + b)',
      denominator: '分母项 (cx + d)',
    },
    subviews: {
      steps: '标准四步推导',
      table: '对照数值表 (x↔y)',
      evaluator: '特定点求值 f⁻¹(a)',
      calculus: '单调性与水平线检验 f\'(x)',
    },
    subviewStatuses: {
      steps: '详细步骤已生成',
      table: '坐标镜像对调验证',
      evaluator: '特定数值实时代入',
      calculus: '水平线检验与单调性分析',
    },
    result: {
      title: '反函数计算结果',
      originalFunction: '原函数表达式:',
      inverseFunction: '反函数表达式:',
      domain: '定义域:',
      range: '值域:',
      warningTitle: '核心易错警示:',
      warningDesc: '符号 -1 代表反函数运算，绝对不能等同于倒数 1/f(x)！',
      explainBtn: '查看步骤',
      copyBtn: '复制',
      copyStepsBtn: '复制推导步骤',
      shareBtn: '分享',
      exportBtn: '导出',
      deepDiveBtn: '配方法深度剖析',
      deepDivePrompt: '查看配方法几何面积填补模型与 (b/2a)² 推导过程。',
      explicitDomainBadge: '显式定义域限制',
      domainOfF: '原函数定义域:',
      rangeOfF: '原函数值域:',
      domainOfInv: '反函数定义域:',
      rangeOfInv: '反函数值域:',
      copyAllSteps: '复制全部步骤',
      compositionProofTitle: '代数复合函数检验验证: f(f⁻¹(x)) = x 且 f⁻¹(f(x)) = x',
    },
    hltText: {
      passedTitle: '水平线检验：通过（全实数域一一对应）',
      passedDesc: '原函数在自然定义域内严格单调，任意水平线与图像交点唯一，存在全域反函数。',
      principalBranchTitle: '在全实数域上不是一一对应，以下为主值分支',
      principalBranchDesc: '原函数在全域非单射。为求反函数，已将其定义域限制为主值单调区间，在此区间内存在一一对应的反函数。',
    },
    nav: {
      regressionBtn: '10 项回归测试',
      aboutBtn: '关于',
      privacyBtn: '隐私政策',
      contactBtn: '联系与反馈',
      authorLabel: '作者:',
    },
    stepsTitle: '标准代数推导过程 (与答案严格一致)',
    stepsSubtitle: '严格代数变形：设 y → 互换 x 与 y → 移项配方求解 y → 写出 f⁻¹(x) 并显式给出定义域限制',
    verificationTitle: '代数复合函数检验验证: f(f⁻¹(x)) = x 且 f⁻¹(f(x)) = x',
    verificationDesc: '数学上要严格证明两函数互为反函数，必须验证二者相互复合直接化简为恒等函数 x：',
    evaluator: {
      title: '反函数特定数值点求值: f⁻¹(a)',
      subtitle: '典型题：“已知 f(x)，求 f⁻¹(c) 的值”。',
      inputDomain: '反函数定义域:',
      evaluateFor: '计算自变量 x =',
      quickTry: '快捷测试:',
      calculatedValue: '计算所得反函数值:',
      outsideDomain: '超出合法定义域！',
      outsideDomainDesc: '该数值不在反函数 f⁻¹(x) 的合法定义域内。在实数范围内，负数不能开偶次方，分母不能为零。',
    },
    table: {
      title: '左右数值对照表与坐标对调几何证明',
      subtitle: '直观观察原函数上的点 (x, y) 是如何反转为反函数上的 (y, x)。',
      colInputX: '输入自变量 x',
      colOutputY: '输出 y = f(x)',
      colPointF: '原函数点 (x, y)',
      colPointInv: '反函数点 (y, x)',
      colCheck: '反向代入验证: f⁻¹(y)',
      takeaway: '考试做题秘籍：如果题目给出原函数的数值表格，只需将两列或两行直接对调，就能瞬间得到反函数对应表！',
    },
    calculus: {
      hltTitle: '水平线检验 (Horizontal Line Test) 与严格单调性判定',
      derivativeLabel: '一阶导数 f\'(x):',
      criticalPointLabel: '驻点 / 顶点坐标:',
      oneToOne: '全实数域严格一一对应',
      requiresDomainCut: '在全实数域上不是一一对应，以下为主值分支',
    },
    graph: {
      zoomIn: '放大图表',
      zoomOut: '缩小图表',
      resetView: '重置视角',
      download: '下载图像',
      probeToggle: '对称探测点',
      probeLabel: '测试 x 坐标:',
      probeNote: '直观观察点 (a, b) 是如何关于 y = x 对称翻转为 (b, a) 的！',
    },
    footerText: '反函数求解计算器与配方法拆解在线工具 • 高中与微积分核心考点',
  },

  es: {
    localeName: 'Español',
    flag: '🇪🇸',
    seoTitle: 'Calculadora de Función Inversa – Paso a Paso con Completar el Cuadrado',
    seoDesc: 'Calcula la función inversa f⁻¹(x) paso a paso: completar el cuadrado, dominio y rango, prueba de la línea horizontal y gráficas reflejadas sobre y = x.',
    appTitle: 'Calculadora de Función Inversa',
    appSubtitle: 'Paso a Paso con Método de Completar el Cuadrado',
    tagline: 'Intercambia x e y • Despeja y • Dominio y Rango • Reflexión y = x',
    resetBtn: 'Restablecer',
    printBtn: 'Imprimir',
    shareBtn: 'Compartir',
    copiedNotice: '¡Copiado!',
    recent: 'Reciente:',
    tabs: {
      solver: 'Solución Inversa y Pasos',
      completingSquare: 'Completar el Cuadrado a Fondo',
      completingSquareBadge: 'Explicación',
      examples: 'Ejemplos Resueltos (12+)',
      practice: 'Cuestionario de Práctica',
      guide: 'Guía y Preguntas Frecuentes',
    },
    input: {
      placeholder: 'Escribe: ej. x^2 + 4x + 1, x^4, x^3 + 1, (2x+3)/(x-5), 3x - 7, e^x',
      coefficientsTitle: 'Coeficientes de la Función',
      coefficientsSubtitle: '(Ajusta los números para calcular en tiempo real)',
      presetsLabel: 'Preajustes:',
      selectFamily: 'Familia de Funciones:',
      quadBranchRight: 'Rama derecha (+ raíz, x ≥ h)',
      quadBranchLeft: 'Rama izquierda (- raíz, x ≤ h)',
      parabolaBranch: 'Rama de la parábola',
    },
    functionFamilies: {
      quadratic: { label: 'Cuadrática (x²)', desc: 'Completar el cuadrado', badge: 'Popular' },
      rational: { label: 'Fracción Racional', desc: 'Multiplicar en cruz', badge: '' },
      linear: { label: 'Lineal (mx + b)', desc: 'Pendiente recíproca', badge: '' },
      radical: { label: 'Raíz Cuadrada (√x)', desc: 'Restricción de dominio', badge: '' },
      exponential: { label: 'Exponencial (eˣ)', desc: 'Logaritmo natural', badge: '' },
      cubic: { label: 'Polinómica (xⁿ)', desc: 'x³, x⁴, xⁿ', badge: '' },
    },
    coefficients: {
      coefA: 'Coeficiente a',
      coefB: 'Coeficiente b',
      coefC: 'Constante c',
      coefD: 'Desplazamiento d',
      coefM: 'Pendiente m',
      shiftH: 'Desplazamiento h',
      shiftK: 'Desplazamiento k',
      numerator: 'Numerador',
      denominator: 'Denominador',
    },
    subviews: {
      steps: 'Pasos Algebraicos',
      table: 'Tabla de Valores',
      evaluator: 'Evaluar Punto',
      calculus: 'Derivada y HLT',
    },
    subviewStatuses: {
      steps: 'Pasos detallados listos',
      table: 'Tabla simétrica (x↔y)',
      evaluator: 'Cálculo de puntos',
      calculus: 'Prueba de la recta horizontal',
    },
    result: {
      title: 'Resultado de la Función Inversa',
      originalFunction: 'Función Original f(x):',
      inverseFunction: 'Función Inversa f⁻¹(x):',
      domain: 'Dominio:',
      range: 'Rango:',
      warningTitle: 'Error Común:',
      warningDesc: 'f⁻¹(x) denota función inversa, ¡NO el recíproco 1/f(x)!',
      explainBtn: 'Ver Pasos',
      copyBtn: 'Copiar',
      copyStepsBtn: 'Copiar Pasos',
      shareBtn: 'Compartir',
      exportBtn: 'Exportar',
      deepDiveBtn: 'Explorar',
      deepDivePrompt: 'Profundiza en la forma de vértice.',
      explicitDomainBadge: 'Dominio Explícito Restringido',
      domainOfF: 'Dominio de f:',
      rangeOfF: 'Rango de f:',
      domainOfInv: 'Dominio de f⁻¹:',
      rangeOfInv: 'Rango de f⁻¹:',
      copyAllSteps: 'Copiar Todos los Pasos',
      compositionProofTitle: 'Verificación por Composición: f(f⁻¹(x)) = x',
    },
    hltText: {
      passedTitle: 'Prueba de la Recta Horizontal: PASADA',
      passedDesc: 'Estrictamente monótona en todo su dominio. Existe inversa global.',
      principalBranchTitle: 'No es biyectiva en todos los reales; la siguiente es la rama principal',
      principalBranchDesc: 'La función original no es inyectiva en todo R. El dominio se restringe a la rama monótona para definir la inversa principal.',
    },
    nav: {
      regressionBtn: '10 Pruebas de Regresión',
      aboutBtn: 'Acerca de',
      privacyBtn: 'Privacidad',
      contactBtn: 'Contacto',
      authorLabel: 'Autor:',
    },
    stepsTitle: 'Derivación Algebraica Paso a Paso',
    stepsSubtitle: 'Transformaciones exactas que corresponden a la respuesta inversa',
    verificationTitle: 'Comprobación de Composición: f(f⁻¹(x)) = x y f⁻¹(f(x)) = x',
    verificationDesc: 'La sustitución confirma la identidad:',
    evaluator: {
      title: 'Evaluador de Puntos: f⁻¹(a)',
      subtitle: 'Calcula f⁻¹(c) para un valor dado.',
      inputDomain: 'Dominio Válido:',
      evaluateFor: 'Calcular para x =',
      quickTry: 'Probar:',
      calculatedValue: 'Valor Calculado:',
      outsideDomain: '¡Fuera del Dominio!',
      outsideDomainDesc: 'El valor está fuera del dominio de f⁻¹(x).',
    },
    table: {
      title: 'Tabla Comparativa de Valores',
      subtitle: 'Comprueba cómo cada punto (x, y) se convierte en (y, x).',
      colInputX: 'Entrada x',
      colOutputY: 'Salida y = f(x)',
      colPointF: 'Punto f(x)',
      colPointInv: 'Punto f⁻¹(x)',
      colCheck: 'Comprobación',
      takeaway: 'Consejo: ¡Invierte las columnas de la tabla para hallar la inversa!',
    },
    calculus: {
      hltTitle: 'Prueba de la Línea Horizontal',
      derivativeLabel: 'Primera Derivada:',
      criticalPointLabel: 'Punto Crítico:',
      oneToOne: 'Estrictamente Inyectiva',
      requiresDomainCut: 'Requiere Restricción de Dominio',
    },
    graph: {
      zoomIn: 'Acercar',
      zoomOut: 'Alejar',
      resetView: 'Restablecer',
      download: 'Descargar',
      probeToggle: 'Sonda',
      probeLabel: 'Valor x:',
      probeNote: 'Reflexión sobre y = x',
    },
    footerText: 'Calculadora de Función Inversa • Álgebra y Precálculo',
  },

  fr: {
    localeName: 'Français',
    flag: '🇫🇷',
    seoTitle: 'Calculateur de Fonction Réciproque – Méthode Pas à Pas',
    seoDesc: 'Trouvez la fonction réciproque f⁻¹(x) étape par étape: forme canonique, domaine et image, test de la droite horizontale et symétrie y = x.',
    appTitle: 'Calculateur de Fonction Réciproque',
    appSubtitle: 'Résolution Pas à Pas et Forme Canonique',
    tagline: 'Échanger x et y • Isoler y • Domaine et Image • Symétrie y = x',
    resetBtn: 'Réinitialiser',
    printBtn: 'Imprimer',
    shareBtn: 'Partager',
    copiedNotice: 'Copié !',
    recent: 'Récent :',
    tabs: {
      solver: 'Résolution et Étapes',
      completingSquare: 'Forme Canonique Détaillée',
      completingSquareBadge: 'Détail',
      examples: 'Exemples Résolus (12+)',
      practice: 'Quiz d\'Entraînement',
      guide: 'Guide et FAQ',
    },
    input: {
      placeholder: 'Tapez une formule : ex. x^2 + 4x + 1, x^4, x^3 + 1, (2x+3)/(x-5), 3x - 7, e^x',
      coefficientsTitle: 'Coefficients de la Fonction',
      coefficientsSubtitle: '(Modifiez les valeurs en temps réel)',
      presetsLabel: 'Préréglages :',
      selectFamily: 'Famille de Fonctions :',
      quadBranchRight: 'Branche droite (+ racine, x ≥ h)',
      quadBranchLeft: 'Branche gauche (- racine, x ≤ h)',
      parabolaBranch: 'Branche de Parabole',
    },
    functionFamilies: {
      quadratic: { label: 'Quadratique (x²)', desc: 'Forme canonique', badge: 'Populaire' },
      rational: { label: 'Fraction Rationnelle', desc: 'Produit en croix', badge: '' },
      linear: { label: 'Linéaire (mx + b)', desc: 'Pente inverse', badge: '' },
      radical: { label: 'Racine Carrée (√x)', desc: 'Restriction de domaine', badge: '' },
      exponential: { label: 'Exponentielle (eˣ)', desc: 'Logarithme népérien', badge: '' },
      cubic: { label: 'Polynôme (xⁿ)', desc: 'x³, x⁴, xⁿ', badge: '' },
    },
    coefficients: {
      coefA: 'Coefficient a',
      coefB: 'Coefficient b',
      coefC: 'Constante c',
      coefD: 'Décalage d',
      coefM: 'Pente m',
      shiftH: 'Décalage h',
      shiftK: 'Décalage k',
      numerator: 'Numérateur',
      denominator: 'Dénominateur',
    },
    subviews: {
      steps: 'Étapes Algébriques',
      table: 'Tableau de Valeurs',
      evaluator: 'Évaluateur de Point',
      calculus: 'Dérivée et Test',
    },
    subviewStatuses: {
      steps: 'Étapes détaillées prêtes',
      table: 'Tableau de symétrie (x↔y)',
      evaluator: 'Calcul de points',
      calculus: 'Test de la droite horizontale',
    },
    result: {
      title: 'Résultat de la Fonction Réciproque',
      originalFunction: 'Fonction Originale f(x) :',
      inverseFunction: 'Fonction Réciproque f⁻¹(x) :',
      domain: 'Domaine :',
      range: 'Image :',
      warningTitle: 'Erreur Fréquente :',
      warningDesc: 'f⁻¹(x) est la fonction réciproque, PAS l\'inverse 1/f(x) !',
      explainBtn: 'Voir Étapes',
      copyBtn: 'Copier',
      copyStepsBtn: 'Copier Étapes',
      shareBtn: 'Partager',
      exportBtn: 'Exporter',
      deepDiveBtn: 'Explorer',
      deepDivePrompt: 'Approfondissez la forme canonique.',
      explicitDomainBadge: 'Domaine Explicite Restreint',
      domainOfF: 'Domaine de f :',
      rangeOfF: 'Image de f :',
      domainOfInv: 'Domaine de f⁻¹ :',
      rangeOfInv: 'Image de f⁻¹ :',
      copyAllSteps: 'Copier Toutes les Étapes',
      compositionProofTitle: 'Vérification par Composition : f(f⁻¹(x)) = x',
    },
    hltText: {
      passedTitle: 'Test de la Droite Horizontale : RÉUSSI',
      passedDesc: 'Strictement monotone sur tout son domaine.',
      principalBranchTitle: 'Pas injective sur tout R ; voici la branche principale',
      principalBranchDesc: 'La fonction d\'origine n\'est pas bijective sur R. Le domaine est restreint à la branche monotone.',
    },
    nav: {
      regressionBtn: '10 Tests de Régression',
      aboutBtn: 'À propos',
      privacyBtn: 'Confidentialité',
      contactBtn: 'Contact',
      authorLabel: 'Auteur :',
    },
    stepsTitle: 'Dérivation Algébrique Pas à Pas',
    stepsSubtitle: 'Transformations conformes au résultat final',
    verificationTitle: 'Vérification par Composition',
    verificationDesc: 'La composition confirme l\'identité :',
    evaluator: {
      title: 'Évaluateur de Point : f⁻¹(a)',
      subtitle: 'Calculer f⁻¹(c) pour une valeur donnée.',
      inputDomain: 'Domaine Valide :',
      evaluateFor: 'Calculer pour x =',
      quickTry: 'Essayer :',
      calculatedValue: 'Valeur Calculée :',
      outsideDomain: 'En dehors du Domaine !',
      outsideDomainDesc: 'La valeur n\'appartient pas au domaine.',
    },
    table: {
      title: 'Tableau Comparatif',
      subtitle: 'Les points (x, y) deviennent (y, x).',
      colInputX: 'x',
      colOutputY: 'y = f(x)',
      colPointF: 'Point f(x)',
      colPointInv: 'Point f⁻¹(x)',
      colCheck: 'Vérification',
      takeaway: 'Inversez simplement les colonnes !',
    },
    calculus: {
      hltTitle: 'Test de la Droite Horizontale',
      derivativeLabel: 'Dérivée Première :',
      criticalPointLabel: 'Point Critique :',
      oneToOne: 'Strictement Bijective',
      requiresDomainCut: 'Restriction Nécessaire',
    },
    graph: {
      zoomIn: 'Zoomer',
      zoomOut: 'Dézoomer',
      resetView: 'Réinitialiser',
      download: 'Télécharger',
      probeToggle: 'Sonde',
      probeLabel: 'Valeur x :',
      probeNote: 'Symétrie par rapport à y = x',
    },
    footerText: 'Calculateur de Fonction Réciproque • Algèbre et Analyse',
  },

  pt: {
    localeName: 'Português',
    flag: '🇧🇷',
    seoTitle: 'Calculadora de Função Inversa – Passo a Passo com Completar Quadrados',
    seoDesc: 'Calcule a função inversa f⁻¹(x) passo a passo: completar quadrados, domínio e contradomínio, teste da reta horizontal e gráficos em y = x.',
    appTitle: 'Calculadora de Função Inversa',
    appSubtitle: 'Passo a Passo com Completar Quadrados',
    tagline: 'Trocar x e y • Isolar y • Domínio e Imagem • Reflexão y = x',
    resetBtn: 'Redefinir',
    printBtn: 'Imprimir',
    shareBtn: 'Compartilhar',
    copiedNotice: 'Copiado!',
    recent: 'Recente:',
    tabs: {
      solver: 'Solução Inversa e Passos',
      completingSquare: 'Completar Quadrados a Fundo',
      completingSquareBadge: 'Destaque',
      examples: 'Exemplos Resolvidos (12+)',
      practice: 'Quiz de Prática',
      guide: 'Guia e Perguntas Frequentes',
    },
    input: {
      placeholder: 'Digite a fórmula: ex. x^2 + 4x + 1, x^4, x^3 + 1, (2x+3)/(x-5), 3x - 7, e^x',
      coefficientsTitle: 'Coeficientes da Função',
      coefficientsSubtitle: '(Ajuste os valores em tempo real)',
      presetsLabel: 'Predefinições:',
      selectFamily: 'Família de Funções:',
      quadBranchRight: 'Ramo direito (+ raiz, x ≥ h)',
      quadBranchLeft: 'Ramo esquerdo (- raiz, x ≤ h)',
      parabolaBranch: 'Ramo da Parábola',
    },
    functionFamilies: {
      quadratic: { label: 'Quadrática (x²)', desc: 'Completar quadrados', badge: 'Popular' },
      rational: { label: 'Fração Racional', desc: 'Multiplicação cruzada', badge: '' },
      linear: { label: 'Linear (mx + b)', desc: 'Declive recíproco', badge: '' },
      radical: { label: 'Raiz Quadrada (√x)', desc: 'Restrição de domínio', badge: '' },
      exponential: { label: 'Exponencial (eˣ)', desc: 'Logaritmo natural', badge: '' },
      cubic: { label: 'Polinomial (xⁿ)', desc: 'x³, x⁴, xⁿ', badge: '' },
    },
    coefficients: {
      coefA: 'Coeficiente a',
      coefB: 'Coeficiente b',
      coefC: 'Constante c',
      coefD: 'Deslocamento d',
      coefM: 'Declive m',
      shiftH: 'Deslocamento h',
      shiftK: 'Deslocamento k',
      numerator: 'Numerador',
      denominator: 'Denominador',
    },
    subviews: {
      steps: 'Passos Algébricos',
      table: 'Tabela de Valores',
      evaluator: 'Avaliar Ponto',
      calculus: 'Derivada e HLT',
    },
    subviewStatuses: {
      steps: 'Passos detalhados prontos',
      table: 'Tabela simétrica (x↔y)',
      evaluator: 'Cálculo de pontos',
      calculus: 'Teste da reta horizontal',
    },
    result: {
      title: 'Resultado da Função Inversa',
      originalFunction: 'Função Original f(x):',
      inverseFunction: 'Função Inversa f⁻¹(x):',
      domain: 'Domínio:',
      range: 'Imagem:',
      warningTitle: 'Erro Comum:',
      warningDesc: 'f⁻¹(x) representa a inversa, NÃO o inverso 1/f(x)!',
      explainBtn: 'Ver Passos',
      copyBtn: 'Copiar',
      copyStepsBtn: 'Copiar Passos',
      shareBtn: 'Compartilhar',
      exportBtn: 'Exportar',
      deepDiveBtn: 'Explorar',
      deepDivePrompt: 'Aprofunde-se na forma de vértice.',
      explicitDomainBadge: 'Domínio Explícito Restrito',
      domainOfF: 'Domínio de f:',
      rangeOfF: 'Imagem de f:',
      domainOfInv: 'Domínio de f⁻¹:',
      rangeOfInv: 'Imagem de f⁻¹:',
      copyAllSteps: 'Copiar Todos os Passos',
      compositionProofTitle: 'Verificação por Composição: f(f⁻¹(x)) = x',
    },
    hltText: {
      passedTitle: 'Teste da Reta Horizontal: APROVADO',
      passedDesc: 'Estritamente monótona em todo o domínio.',
      principalBranchTitle: 'Não é injetora em todo o domínio real; este é o ramo principal',
      principalBranchDesc: 'A função original não é injetora globalmente. O domínio foi restrito ao ramo monótono.',
    },
    nav: {
      regressionBtn: '10 Testes de Regressão',
      aboutBtn: 'Sobre',
      privacyBtn: 'Privacidade',
      contactBtn: 'Contato',
      authorLabel: 'Autor:',
    },
    stepsTitle: 'Derivação Algébrica Passo a Passo',
    stepsSubtitle: 'Transformações exatas que correspondem à inversa final',
    verificationTitle: 'Verificação por Composição: f(f⁻¹(x)) = x e f⁻¹(f(x)) = x',
    verificationDesc: 'A substituição confirma a identidade:',
    evaluator: {
      title: 'Avaliador de Pontos: f⁻¹(a)',
      subtitle: 'Calcule f⁻¹(c) para um valor específico.',
      inputDomain: 'Domínio Válido:',
      evaluateFor: 'Calcular para x =',
      quickTry: 'Testar:',
      calculatedValue: 'Valor Calculado:',
      outsideDomain: 'Fora do Domínio!',
      outsideDomainDesc: 'O valor está fora do domínio de f⁻¹(x).',
    },
    table: {
      title: 'Tabela Comparativa de Valores',
      subtitle: 'Cada ponto (x, y) reflete em (y, x).',
      colInputX: 'Entrada x',
      colOutputY: 'Saída y = f(x)',
      colPointF: 'Ponto f(x)',
      colPointInv: 'Ponto f⁻¹(x)',
      colCheck: 'Verificação',
      takeaway: 'Inverta as colunas da tabela para achar f⁻¹(x)!',
    },
    calculus: {
      hltTitle: 'Teste da Reta Horizontal',
      derivativeLabel: 'Primeira Derivada:',
      criticalPointLabel: 'Ponto Crítico:',
      oneToOne: 'Estritamente Injetora',
      requiresDomainCut: 'Requer Restrição de Domínio',
    },
    graph: {
      zoomIn: 'Aproximar',
      zoomOut: 'Afastar',
      resetView: 'Redefinir',
      download: 'Baixar',
      probeToggle: 'Sonda',
      probeLabel: 'Valor x:',
      probeNote: 'Reflexão em torno de y = x',
    },
    footerText: 'Calculadora de Função Inversa • Álgebra e Pré-Cálculo',
  },
};
