export type SupportedLocale = 'en' | 'es' | 'fr' | 'pt' | 'zh';

export interface TranslationDictionary {
  localeName: string;
  flag: string;
  seoTitle: string;
  seoDesc: string;
  appTitle: string;
  appSubtitle: string;
  tagline: string;
  aiTutorBtn: string;
  printBtn: string;
  shareBtn: string;
  copiedNotice: string;
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
  subviews: {
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
    deepDiveBtn: string;
    deepDivePrompt: string;
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
    aiTutorBtn: 'Ask AI Tutor',
    printBtn: 'Print Worksheet',
    shareBtn: 'Share',
    copiedNotice: 'Copied!',
    tabs: {
      solver: 'Inverse Solver & Steps',
      completingSquare: 'Completing the Square Breakdown',
      completingSquareBadge: 'Deep Dive',
      examples: 'Worked Examples (12+)',
      practice: 'Practice Quiz',
      guide: 'Curriculum Guide & FAQ',
    },
    input: {
      placeholder: 'Type equation: e.g. x^2 + 4x + 1 or (2x+3)/(x-5) or 3x - 7',
      coefficientsTitle: 'Input Function Coefficients',
      coefficientsSubtitle: '(Adjust sliders or numbers to solve in real time)',
      presetsLabel: 'Presets:',
      selectFamily: 'Select Function Family:',
      quadBranchRight: 'Right Branch (+ root, x ≥ h)',
      quadBranchLeft: 'Left Branch (- root, x ≤ h)',
      parabolaBranch: 'Parabola Branch',
    },
    subviews: {
      steps: '4-Step Derivation',
      table: 'Values Table (x↔y)',
      evaluator: 'Point Evaluator f⁻¹(a)',
      calculus: 'HLT & Calculus f\'(x)',
    },
    result: {
      title: 'Inverse Function Result',
      originalFunction: 'Original Function:',
      inverseFunction: 'Inverse Function:',
      domain: 'Domain:',
      range: 'Range:',
      warningTitle: 'CRITICAL WARNING FOR EXAMS:',
      warningDesc: 'The superscript -1 is an inverse function operator, NOT an algebraic exponent.',
      explainBtn: 'Explain',
      copyBtn: 'Copy',
      deepDiveBtn: 'Deep Dive',
      deepDivePrompt: 'Inspect the dedicated geometric area model and (b/2a)² derivation.',
    },
    stepsTitle: 'Step-by-Step Algebraic Breakdown (The 4-Step Method)',
    stepsSubtitle: 'Standard procedure: Rewrite → Swap Variables → Solve for y → Formal Notation & Domain',
    verificationTitle: 'Algebraic Verification Proof: f(f⁻¹(x)) = x and f⁻¹(f(x)) = x',
    verificationDesc: 'To formally prove that two functions are inverses, compose them together. Both compositions must simplify directly to the identity function x:',
    evaluator: {
      title: 'Evaluate Inverse at a Specific Point: f⁻¹(a)',
      subtitle: 'Common exam question: "Given f(x), evaluate f⁻¹(c)".',
      inputDomain: 'Input Domain:',
      evaluateFor: 'Evaluate for x =',
      quickTry: 'Quick try:',
      calculatedValue: 'Calculated Value:',
      outsideDomain: 'Outside Legal Domain!',
      outsideDomainDesc: 'The value is outside the domain of f⁻¹(x). In the real number system, negative radicals or dividing by zero is undefined.',
    },
    table: {
      title: 'Side-by-Side Table of Values & Coordinate Swap Proof',
      subtitle: 'See how every point (x, y) on f(x) reverses into (y, x) on f⁻¹(x).',
      colInputX: 'Input x',
      colOutputY: 'Output y = f(x)',
      colPointF: 'Point on f(x)',
      colPointInv: 'Reversed Point on f⁻¹(x)',
      colCheck: 'Verification: f⁻¹(y)',
      takeaway: 'Key takeaway for exams: If an exam gives you a table of values for f(x), simply switch the two columns to find f⁻¹(x)!',
    },
    calculus: {
      hltTitle: 'Horizontal Line Test (HLT) & Invertibility Criterion',
      derivativeLabel: 'First Derivative f\'(x):',
      criticalPointLabel: 'Critical Point / Vertex:',
      oneToOne: 'Strictly One-to-One',
      requiresDomainCut: 'Requires Domain Cut',
    },
    footerText: 'Inverse Function Calculator & Completing the Square Solver • High School Algebra & Precalculus',
  },

  es: {
    localeName: 'Español',
    flag: '🇪🇸',
    seoTitle: 'Calculadora de Función Inversa – Pasos Detallados y Completar el Cuadrado',
    seoDesc: 'Calcula la función inversa f⁻¹(x) paso a paso: completar el cuadrado, intercambio de x e y, restricciones de dominio, gráfico simétrico y verificación.',
    appTitle: 'Calculadora de Función Inversa',
    appSubtitle: 'Resolución Paso a Paso y Completar el Cuadrado',
    tagline: 'Intercambiar x e y • Despejar y • Dominio y Rango • Reflejo en y = x',
    aiTutorBtn: 'Tutor IA',
    printBtn: 'Imprimir Hoja',
    shareBtn: 'Compartir',
    copiedNotice: '¡Copiado!',
    tabs: {
      solver: 'Calculadora y Pasos',
      completingSquare: 'Desglose: Completar el Cuadrado',
      completingSquareBadge: 'Punto Clave',
      examples: 'Ejemplos Resueltos (12+)',
      practice: 'Cuestionario de Práctica',
      guide: 'Guía y Preguntas Frecuentes',
    },
    input: {
      placeholder: 'Escribe la función: ej. x^2 + 4x + 1 o (2x+3)/(x-5) o 3x - 7',
      coefficientsTitle: 'Coeficientes de la Función',
      coefficientsSubtitle: '(Ajusta los deslizadores o números para resolver en tiempo real)',
      presetsLabel: 'Preajustes:',
      selectFamily: 'Familia de Funciones:',
      quadBranchRight: 'Rama derecha (+ raíz, x ≥ h)',
      quadBranchLeft: 'Rama izquierda (- raíz, x ≤ h)',
      parabolaBranch: 'Rama de la Parábola',
    },
    subviews: {
      steps: 'Derivación en 4 Pasos',
      table: 'Tabla de Valores (x↔y)',
      evaluator: 'Evaluar Punto f⁻¹(a)',
      calculus: 'Prueba Recta Horizontal y f\'(x)',
    },
    result: {
      title: 'Resultado de la Función Inversa',
      originalFunction: 'Función Original:',
      inverseFunction: 'Función Inversa:',
      domain: 'Dominio:',
      range: 'Rango:',
      warningTitle: '¡ADVERTENCIA CRUCIAL PARA EXÁMENES!',
      warningDesc: 'El superíndice -1 indica la función inversa, NO un exponente algebraico recíproco.',
      explainBtn: 'Explicar',
      copyBtn: 'Copiar',
      deepDiveBtn: 'Profundizar',
      deepDivePrompt: 'Revisa el modelo geométrico de áreas y la derivación de (b/2a)²',
    },
    stepsTitle: 'Desglose Algebraico Paso a Paso (Método de los 4 Pasos)',
    stepsSubtitle: 'Procedimiento estándar: Reescribir → Intercambiar Variables → Despejar y → Notación Formal y Dominio',
    verificationTitle: 'Demostración de Verificación: f(f⁻¹(x)) = x y f⁻¹(f(x)) = x',
    verificationDesc: 'Para demostrar formalmente que dos funciones son inversas, compón una con la otra. Ambas composiciones deben simplificarse a x:',
    evaluator: {
      title: 'Evaluar Inversa en un Punto Específico: f⁻¹(a)',
      subtitle: 'Pregunta típica de examen: "Dada f(x), calcula f⁻¹(c)".',
      inputDomain: 'Dominio de Entrada:',
      evaluateFor: 'Evaluar para x =',
      quickTry: 'Probar:',
      calculatedValue: 'Valor Calculado:',
      outsideDomain: '¡Fuera del Dominio Válido!',
      outsideDomainDesc: 'El valor está fuera del dominio de f⁻¹(x). En los números reales, no se permiten radicales negativos ni división por cero.',
    },
    table: {
      title: 'Tabla Comparativa de Valores y Prueba de Inversión',
      subtitle: 'Observa cómo cada punto (x, y) en f(x) se convierte en (y, x) en f⁻¹(x).',
      colInputX: 'Entrada x',
      colOutputY: 'Salida y = f(x)',
      colPointF: 'Punto en f(x)',
      colPointInv: 'Punto Reflejado en f⁻¹(x)',
      colCheck: 'Verificación: f⁻¹(y)',
      takeaway: 'Truco para exámenes: ¡Si te dan una tabla de valores de f(x), solo intercambia las dos columnas para obtener f⁻¹(x)!',
    },
    calculus: {
      hltTitle: 'Criterio de la Recta Horizontal (HLT) e Invertibilidad',
      derivativeLabel: 'Primera Derivada f\'(x):',
      criticalPointLabel: 'Punto Crítico / Vértice:',
      oneToOne: 'Estrictamente Biyectiva',
      requiresDomainCut: 'Requiere Restricción de Dominio',
    },
    footerText: 'Calculadora de Función Inversa y Completar el Cuadrado • Álgebra y Precálculo',
  },

  fr: {
    localeName: 'Français',
    flag: '🇫🇷',
    seoTitle: 'Calculateur de Fonction Inverse – Résolution Étape par Étape et Forme Canonique',
    seoDesc: 'Trouvez la fonction réciproque f⁻¹(x) étape par étape: complétion du carré, échange de x et y, restriction du domaine, symétrie graphique y=x.',
    appTitle: 'Calculateur de Fonction Inverse',
    appSubtitle: 'Résolution Étape par Étape & Complétion du Carré',
    tagline: 'Échanger x et y • Isoler y • Domaine et Image • Symétrie par rapport à y = x',
    aiTutorBtn: 'Tuteur IA',
    printBtn: 'Imprimer',
    shareBtn: 'Partager',
    copiedNotice: 'Copié !',
    tabs: {
      solver: 'Résolveur & Étapes',
      completingSquare: 'Complétion du Carré',
      completingSquareBadge: 'Essentiel',
      examples: 'Exemples Résolus (12+)',
      practice: 'Quiz d\'Entraînement',
      guide: 'Guide du Cours & FAQ',
    },
    input: {
      placeholder: 'Tapez l\'équation: ex. x^2 + 4x + 1 ou (2x+3)/(x-5) ou 3x - 7',
      coefficientsTitle: 'Coefficients de la Fonction',
      coefficientsSubtitle: '(Ajustez les curseurs ou les nombres pour résoudre en temps réel)',
      presetsLabel: 'Exemples:',
      selectFamily: 'Type de Fonction:',
      quadBranchRight: 'Branche droite (+ racine, x ≥ h)',
      quadBranchLeft: 'Branche gauche (- racine, x ≤ h)',
      parabolaBranch: 'Branche de la Parabole',
    },
    subviews: {
      steps: 'Dérivation en 4 Étapes',
      table: 'Tableau de Valeurs (x↔y)',
      evaluator: 'Évaluer un Point f⁻¹(a)',
      calculus: 'Test de la Droite Horizontale & f\'(x)',
    },
    result: {
      title: 'Résultat de la Fonction Réciproque',
      originalFunction: 'Fonction Initiale:',
      inverseFunction: 'Fonction Réciproque:',
      domain: 'Domaine:',
      range: 'Ensemble Image:',
      warningTitle: 'AVERTISSEMENT EXAMEN IMPORTANT:',
      warningDesc: 'L\'exposant -1 désigne la réciproque, PAS l\'inverse multiplicatif 1/f(x).',
      explainBtn: 'Expliquer',
      copyBtn: 'Copier',
      deepDiveBtn: 'Détails',
      deepDivePrompt: 'Inspectez le modèle d\'aire géométrique et la formule (b/2a)²',
    },
    stepsTitle: 'Résolution Algébrique Étape par Étape (Méthode en 4 Étapes)',
    stepsSubtitle: 'Méthode standard: Réécriture → Échange des Variables → Isoler y → Notation Formelle & Domaine',
    verificationTitle: 'Vérification par Composition: f(f⁻¹(x)) = x et f⁻¹(f(x)) = x',
    verificationDesc: 'Pour prouver que deux fonctions sont réciproques, composez-les ensemble:',
    evaluator: {
      title: 'Évaluer la Réciproque en un Point: f⁻¹(a)',
      subtitle: 'Question classique: "Étant donné f(x), calculer f⁻¹(c)".',
      inputDomain: 'Domaine de Définition:',
      evaluateFor: 'Évaluer pour x =',
      quickTry: 'Tester:',
      calculatedValue: 'Valeur Calculée:',
      outsideDomain: 'Hors du Domaine Légal !',
      outsideDomainDesc: 'La valeur est en dehors du domaine de f⁻¹(x). Dans les réels, racine négative ou division par zéro impossible.',
    },
    table: {
      title: 'Tableau Comparatif & Inversion des Coordonnées',
      subtitle: 'Voyez comment chaque point (x, y) de f(x) s\'inverse en (y, x) sur f⁻¹(x).',
      colInputX: 'Entrée x',
      colOutputY: 'Sortie y = f(x)',
      colPointF: 'Point sur f(x)',
      colPointInv: 'Point Réciproque sur f⁻¹(x)',
      colCheck: 'Vérification: f⁻¹(y)',
      takeaway: 'Astuce pour examens: Échangez simplement les deux colonnes pour trouver le tableau de f⁻¹(x) !',
    },
    calculus: {
      hltTitle: 'Test de la Droite Horizontale & Bijectivité',
      derivativeLabel: 'Dérivée Première f\'(x):',
      criticalPointLabel: 'Point Critique / Sommet:',
      oneToOne: 'Strictement Monotone / Bijective',
      requiresDomainCut: 'Restriction de Domaine Requise',
    },
    footerText: 'Calculateur de Fonction Inverse & Forme Canonique • Algèbre & Analyse',
  },

  pt: {
    localeName: 'Português',
    flag: '🇧🇷',
    seoTitle: 'Calculadora de Função Inversa – Passo a Passo e Completar Quadrados',
    seoDesc: 'Calcule a função inversa f⁻¹(x) passo a passo: completar quadrados, troca de x e y, restrições de domínio, gráfico de reflexão e verificação.',
    appTitle: 'Calculadora de Função Inversa',
    appSubtitle: 'Passo a Passo e Método de Completar Quadrados',
    tagline: 'Trocar x por y • Isolar y • Domínio e Imagem • Reflexão em y = x',
    aiTutorBtn: 'Tutor IA',
    printBtn: 'Imprimir Folha',
    shareBtn: 'Compartilhar',
    copiedNotice: 'Copiado!',
    tabs: {
      solver: 'Calculadora e Passos',
      completingSquare: 'Completar Quadrados',
      completingSquareBadge: 'Essencial',
      examples: 'Exemplos Resolvidos (12+)',
      practice: 'Quiz de Prática',
      guide: 'Guia de Conteúdo & FAQ',
    },
    input: {
      placeholder: 'Digite a equação: ex. x^2 + 4x + 1 ou (2x+3)/(x-5) ou 3x - 7',
      coefficientsTitle: 'Coeficientes da Função',
      coefficientsSubtitle: '(Ajuste os controles ou digite números para resolver em tempo real)',
      presetsLabel: 'Exemplos:',
      selectFamily: 'Família da Função:',
      quadBranchRight: 'Ramo direito (+ raiz, x ≥ h)',
      quadBranchLeft: 'Ramo esquerdo (- raiz, x ≤ h)',
      parabolaBranch: 'Ramo da Parábola',
    },
    subviews: {
      steps: 'Derivação em 4 Passos',
      table: 'Tabela de Valores (x↔y)',
      evaluator: 'Calcular Ponto f⁻¹(a)',
      calculus: 'Teste da Reta Horizontal e f\'(x)',
    },
    result: {
      title: 'Resultado da Função Inversa',
      originalFunction: 'Função Original:',
      inverseFunction: 'Função Inversa:',
      domain: 'Domínio:',
      range: 'Imagem:',
      warningTitle: 'AVISO IMPORTANTE PARA PROVAS:',
      warningDesc: 'O expoente -1 representa a função inversa, e NÃO o recíproco 1/f(x).',
      explainBtn: 'Explicar',
      copyBtn: 'Copiar',
      deepDiveBtn: 'Aprofundar',
      deepDivePrompt: 'Inspecione o modelo geométrico de áreas e a fórmula (b/2a)²',
    },
    stepsTitle: 'Demonstração Algébrica Passo a Passo (Método dos 4 Passos)',
    stepsSubtitle: 'Procedimento padrão: Reescrever → Trocar Variáveis → Isolar y → Notação Formal e Domínio',
    verificationTitle: 'Verificação por Composição: f(f⁻¹(x)) = x e f⁻¹(f(x)) = x',
    verificationDesc: 'Para provar que duas funções são inversas, faça a composição de ambas:',
    evaluator: {
      title: 'Calcular a Inversa em um Ponto Específico: f⁻¹(a)',
      subtitle: 'Questão comum de prova: "Dada f(x), determine f⁻¹(c)".',
      inputDomain: 'Domínio de Entrada:',
      evaluateFor: 'Calcular para x =',
      quickTry: 'Testar:',
      calculatedValue: 'Valor Calculado:',
      outsideDomain: 'Fora do Domínio Válido!',
      outsideDomainDesc: 'O valor está fora do domínio de f⁻¹(x). Nos números reais, não é permitido raiz negativa ou divisão por zero.',
    },
    table: {
      title: 'Tabela Comparativa de Valores e Troca de Coordenadas',
      subtitle: 'Veja como cada ponto (x, y) de f(x) se inverte em (y, x) em f⁻¹(x).',
      colInputX: 'Entrada x',
      colOutputY: 'Saída y = f(x)',
      colPointF: 'Ponto em f(x)',
      colPointInv: 'Ponto Invertido em f⁻¹(x)',
      colCheck: 'Verificação: f⁻¹(y)',
      takeaway: 'Dica para provas: Se tiver uma tabela de valores de f(x), basta inverter as duas colunas para achar f⁻¹(x)!',
    },
    calculus: {
      hltTitle: 'Teste da Reta Horizontal (HLT) e Injetividade',
      derivativeLabel: 'Primeira Derivada f\'(x):',
      criticalPointLabel: 'Ponto Crítico / Vértice:',
      oneToOne: 'Estritamente Injetora',
      requiresDomainCut: 'Requer Restrição de Domínio',
    },
    footerText: 'Calculadora de Função Inversa e Completar Quadrados • Álgebra e Pré-Cálculo',
  },

  zh: {
    localeName: '中文 (简体)',
    flag: '🇨🇳',
    seoTitle: '反函数求解计算器 – 详细解题步骤、配方法拆解与坐标互换图像',
    seoDesc: '高一与高中函数核心解题工具：在线求反函数 f⁻¹(x)，包含完整的配方法拆解过程、互换x和y并解方程、定义域值域反转、y=x对称镜像与复合检验。',
    appTitle: '反函数求解计算器',
    appSubtitle: '详细解题步骤与配方法拆解',
    tagline: '互换 x 与 y • 解方程求 y • 定义域与值域映射 • 关于 y = x 轴对称镜像',
    aiTutorBtn: 'AI 数学助教',
    printBtn: '打印解题卷',
    shareBtn: '分享',
    copiedNotice: '已复制！',
    tabs: {
      solver: '求反函数与详细推导',
      completingSquare: '配方法拆解深度剖析',
      completingSquareBadge: '核心痛点',
      examples: '高中经典考题库 (12+)',
      practice: '交互式自测题',
      guide: '考点公式指南与常见疑问',
    },
    input: {
      placeholder: '输入函数表达式：例如 x^2 + 4x + 1 或 (2x+3)/(x-5) 或 3x - 7',
      coefficientsTitle: '输入函数系数参数',
      coefficientsSubtitle: '(支持实时拖动滑块或修改数值进行即时求解)',
      presetsLabel: '经典题预设:',
      selectFamily: '选择函数类型:',
      quadBranchRight: '右分支 (+ 根号, x ≥ h)',
      quadBranchLeft: '左分支 (- 根号, x ≤ h)',
      parabolaBranch: '抛物线单调分支选择',
    },
    subviews: {
      steps: '标准四步推导',
      table: '对照数值表 (x↔y)',
      evaluator: '特定点求值 f⁻¹(a)',
      calculus: '单调性与水平线检验 f\'(x)',
    },
    result: {
      title: '反函数计算结果',
      originalFunction: '原函数表达式:',
      inverseFunction: '反函数表达式:',
      domain: '定义域:',
      range: '值域:',
      warningTitle: '高中考试核心易错警示:',
      warningDesc: '符号 -1 代表反函数运算，绝对不能等同于倒数 1/f(x)！',
      explainBtn: 'AI 讲解',
      copyBtn: '复制',
      deepDiveBtn: '配方法深度剖析',
      deepDivePrompt: '查看配方法几何面积填补模型与 (b/2a)² 推导过程。',
    },
    stepsTitle: '标准代数四步推导过程 (互换 x 和 y 并解方程)',
    stepsSubtitle: '高中规范解题标准：换元写成 y → 核心互换 x 与 y → 代数配方/移项解出 y → 写出 f⁻¹(x) 并注明定义域',
    verificationTitle: '代数复合函数检验验证: f(f⁻¹(x)) = x 且 f⁻¹(f(x)) = x',
    verificationDesc: '数学上要严格证明两函数互为反函数，必须验证二者相互复合直接化简为恒等函数 x：',
    evaluator: {
      title: '反函数特定数值点求值: f⁻¹(a)',
      subtitle: '高考与美高典型题：“已知 f(x)，求 f⁻¹(c) 的值”。',
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
      requiresDomainCut: '必须截取单调分支',
    },
    footerText: '反函数求解计算器与配方法拆解在线工具 • 高一与预备微积分核心考点',
  },
};
