/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Calculator,
  Layers,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Share2,
  Copy,
  Printer,
  RotateCcw,
  Zap,
  Search,
  Check,
  BookMarked,
  ArrowLeftRight,
  TrendingUp,
  Table,
  Globe
} from 'lucide-react';
import { MathView } from './components/MathView';
import { GraphCanvas } from './components/GraphCanvas';
import { CompletingTheSquareExplainer } from './components/CompletingTheSquareExplainer';
import { PracticeMode } from './components/PracticeMode';
import { AITutorModal } from './components/AITutorModal';
import { SEOContentHub } from './components/SEOContentHub';
import { ValuesTable } from './components/ValuesTable';
import { ValueEvaluator } from './components/ValueEvaluator';
import { WorkedExamplesLibrary, WorkedExampleItem } from './components/WorkedExamplesLibrary';
import { DerivativeAnalysis } from './components/DerivativeAnalysis';
import { RelatedCalculators } from './components/RelatedCalculators';
import { LanguageSelector } from './components/LanguageSelector';
import { EmbedModal } from './components/EmbedModal';
import { SupportedLocale, TRANSLATIONS } from './i18n/translations';
import {
  solveQuadratic,
  solveRational,
  solveLinear,
  solveRadical,
  solveExponential,
  solveCubic,
} from './utils/inverseSolver';
import { parseMathExpression } from './utils/expressionParser';
import { FunctionType, InverseSolution } from './types/math';
import { Code, History } from 'lucide-react';

export default function App() {
  // Intelligent locale detection
  const [locale, setLocale] = useState<SupportedLocale>(() => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.language) {
      const userLang = window.navigator.language.toLowerCase();
      if (userLang.startsWith('es')) return 'es';
      if (userLang.startsWith('fr')) return 'fr';
      if (userLang.startsWith('pt')) return 'pt';
      if (userLang.startsWith('zh')) return 'zh';
    }
    return 'en';
  });

  const t = useMemo(() => TRANSLATIONS[locale], [locale]);

  // Synchronize document title, meta description, and HTML lang tag with active locale
  useEffect(() => {
    document.title = t.seoTitle;
    document.documentElement.lang = locale;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', t.seoDesc);
    }
  }, [t, locale]);

  const [activeTab, setActiveTab] = useState<'solver' | 'completing_square' | 'examples' | 'practice' | 'guide'>('solver');
  const [functionType, setFunctionType] = useState<FunctionType>('quadratic');

  // Unified Text Input Search
  const [typedFormula, setTypedFormula] = useState<string>('x^2 + 4x + 1');
  const [parseNotice, setParseNotice] = useState<string | null>(null);

  // Recent formula history from localStorage
  const [recentFormulas, setRecentFormulas] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('inv_recent_formulas');
      return saved ? JSON.parse(saved) : ['x^2 + 4x + 1', '(2x+3)/(x-5)', '3x - 7'];
    } catch {
      return ['x^2 + 4x + 1', '(2x+3)/(x-5)', '3x - 7'];
    }
  });

  // Modal states
  const [isEmbedOpen, setIsEmbedOpen] = useState<boolean>(false);
  const [isAITutorOpen, setIsAITutorOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedSteps, setCopiedSteps] = useState<boolean>(false);

  // Sub-view toggle in solver: 'steps' | 'table' | 'evaluator' | 'calculus'
  const [solverSubView, setSolverSubView] = useState<'steps' | 'table' | 'evaluator' | 'calculus'>('steps');

  // Quadratic parameters: f(x) = a x^2 + b x + c
  const [quadA, setQuadA] = useState<number>(1);
  const [quadB, setQuadB] = useState<number>(4);
  const [quadC, setQuadC] = useState<number>(1);
  const [quadBranch, setQuadBranch] = useState<'+' | '-'>('+');

  // Rational parameters: f(x) = (ax + b) / (cx + d)
  const [ratA, setRatA] = useState<number>(2);
  const [ratB, setRatB] = useState<number>(3);
  const [ratC, setRatC] = useState<number>(1);
  const [ratD, setRatD] = useState<number>(-5);

  // Linear parameters: f(x) = mx + b
  const [linM, setLinM] = useState<number>(3);
  const [linB, setLinB] = useState<number>(-7);

  // Radical parameters: f(x) = a \sqrt{bx + c} + d
  const [radA, setRadA] = useState<number>(1);
  const [radB, setRadB] = useState<number>(2);
  const [radC, setRadC] = useState<number>(-5);
  const [radD, setRadD] = useState<number>(3);

  // Exponential parameters: f(x) = a e^x + d
  const [expA, setExpA] = useState<number>(1);
  const [expD, setExpD] = useState<number>(-2);

  // Cubic parameters: f(x) = a(x - h)^3 + k
  const [cubA, setCubA] = useState<number>(1);
  const [cubH, setCubH] = useState<number>(2);
  const [cubK, setCubK] = useState<number>(-1);

  // Read URL query parameter ?f= on startup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const fParam = params.get('f');
      if (fParam) {
        handleParseFormula(decodeURIComponent(fParam));
      }
    }
  }, []);

  // Calculate current solution
  const solution: InverseSolution = useMemo(() => {
    switch (functionType) {
      case 'quadratic':
        return solveQuadratic(quadA || 1, quadB, quadC, quadBranch);
      case 'rational':
        return solveRational(ratA, ratB, ratC || 1, ratD);
      case 'linear':
        return solveLinear(linM || 1, linB);
      case 'radical':
        return solveRadical(radA || 1, radB || 1, radC, radD);
      case 'exponential':
        return solveExponential(expA || 1, Math.E, expD);
      case 'cubic':
        return solveCubic(cubA || 1, cubH, cubK);
      default:
        return solveQuadratic(1, 4, 1, '+');
    }
  }, [
    functionType,
    quadA,
    quadB,
    quadC,
    quadBranch,
    ratA,
    ratB,
    ratC,
    ratD,
    linM,
    linB,
    radA,
    radB,
    radC,
    radD,
    expA,
    expD,
    cubA,
    cubH,
    cubK,
  ]);

  // Handle formula parse
  const handleParseFormula = (text: string) => {
    setTypedFormula(text);
    const parsed = parseMathExpression(text);
    if (parsed && parsed.success) {
      setFunctionType(parsed.type);
      if (parsed.type === 'quadratic') {
        setQuadA(parsed.params.a as number);
        setQuadB(parsed.params.b as number);
        setQuadC(parsed.params.c as number);
      } else if (parsed.type === 'rational') {
        setRatA(parsed.params.a as number);
        setRatB(parsed.params.b as number);
        setRatC(parsed.params.c as number);
        setRatD(parsed.params.d as number);
      } else if (parsed.type === 'linear') {
        setLinM(parsed.params.m as number);
        setLinB(parsed.params.b as number);
      } else if (parsed.type === 'radical') {
        setRadA(parsed.params.a as number);
        setRadB(parsed.params.b as number);
        setRadC(parsed.params.c as number);
        setRadD(parsed.params.d as number);
      } else if (parsed.type === 'exponential') {
        setExpA(parsed.params.a as number);
        setExpD(parsed.params.d as number);
      }
      setParseNotice(`Loaded ${parsed.type} function: ${parsed.canonical}`);
      setTimeout(() => setParseNotice(null), 3000);

      // Persist to recent formulas history
      setRecentFormulas((prev) => {
        const next = [text, ...prev.filter((item) => item !== text)].slice(0, 5);
        try {
          localStorage.setItem('inv_recent_formulas', JSON.stringify(next));
        } catch {}
        return next;
      });

      // Synchronize URL query parameter without page reload
      if (typeof window !== 'undefined' && text) {
        const newUrl = `${window.location.pathname}?f=${encodeURIComponent(text)}`;
        window.history.replaceState(null, '', newUrl);
      }
    }
  };

  // Presets
  const applyPreset = (presetName: string) => {
    if (presetName === 'quad1') {
      setFunctionType('quadratic');
      setQuadA(1);
      setQuadB(4);
      setQuadC(1);
      setQuadBranch('+');
      handleParseFormula('x^2 + 4x + 1');
    } else if (presetName === 'quad2') {
      setFunctionType('quadratic');
      setQuadA(2);
      setQuadB(-12);
      setQuadC(11);
      setQuadBranch('+');
      handleParseFormula('2x^2 - 12x + 11');
    } else if (presetName === 'rat1') {
      setFunctionType('rational');
      setRatA(2);
      setRatB(3);
      setRatC(1);
      setRatD(-5);
      handleParseFormula('(2x + 3) / (x - 5)');
    } else if (presetName === 'rat2') {
      setFunctionType('rational');
      setRatA(4);
      setRatB(1);
      setRatC(3);
      setRatD(2);
      handleParseFormula('(4x + 1) / (3x + 2)');
    } else if (presetName === 'lin1') {
      setFunctionType('linear');
      setLinM(3);
      setLinB(-7);
      handleParseFormula('3x - 7');
    } else if (presetName === 'rad1') {
      setFunctionType('radical');
      setRadA(1);
      setRadB(2);
      setRadC(-5);
      setRadD(3);
      handleParseFormula('sqrt(2x - 5) + 3');
    } else if (presetName === 'exp1') {
      setFunctionType('exponential');
      setExpA(1);
      setExpD(-2);
      handleParseFormula('e^x - 2');
    }
  };

  const handleLoadWorkedExample = (item: WorkedExampleItem) => {
    handleParseFormula(item.equation);
    setActiveTab('solver');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyShareLink = () => {
    const shareUrl = typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?f=${encodeURIComponent(typedFormula)}`
      : '';
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyFullSolution = () => {
    const text = `Inverse Function Solution:
Original Function: ${solution.originalEquation}
Domain: ${solution.domainOriginal}
Range: ${solution.rangeOriginal}

Inverse Function: ${solution.inverseEquation}
Domain: ${solution.domainInverse}
Range: ${solution.rangeInverse}

Steps:
${solution.steps.map((s) => `${s.stepNumber}. ${s.title}: ${s.latex} (${s.explanation})`).join('\n')}

Verification:
${solution.verificationSteps.composition1}
`;
    navigator.clipboard.writeText(text);
    setCopiedSteps(true);
    setTimeout(() => setCopiedSteps(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans antialiased text-base selection:bg-indigo-100 selection:text-indigo-900 print:bg-white print:text-black">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-slate-900 text-lg sm:text-xl leading-tight tracking-tight">
                  {t.appTitle}
                </h1>
                <span className="hidden md:inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {t.appSubtitle}
                </span>
              </div>
              <p className="text-sm text-slate-500 hidden sm:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Action buttons + Language Selector */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language Selector Dropdown */}
            <LanguageSelector currentLocale={locale} onSelectLocale={setLocale} />

            <button
              onClick={() => setIsAITutorOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-semibold hover:opacity-95 transition shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">{t.aiTutorBtn}</span>
              <span className="sm:hidden">AI</span>
            </button>
            <button
              onClick={handlePrint}
              title={t.printBtn}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition text-sm flex items-center gap-1"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden lg:inline">{t.printBtn}</span>
            </button>
            <button
              onClick={() => setIsEmbedOpen(true)}
              title="Embed this calculator"
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition text-sm flex items-center gap-1"
            >
              <Code className="w-4 h-4" />
              <span className="hidden lg:inline">Embed</span>
            </button>
            <button
              onClick={copyShareLink}
              title={t.shareBtn}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition text-sm flex items-center gap-1"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden lg:inline">{copiedLink ? t.copiedNotice : t.shareBtn}</span>
            </button>
          </div>
        </div>

        {/* Tab Sub-Header with Comfortable Font */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-2 sm:space-x-6 border-t border-slate-100 overflow-x-auto text-sm font-semibold">
          <button
            onClick={() => setActiveTab('solver')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'solver'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>{t.tabs.solver}</span>
          </button>

          <button
            onClick={() => {
              setFunctionType('quadratic');
              setActiveTab('completing_square');
            }}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'completing_square'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>{t.tabs.completingSquare}</span>
            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-bold">
              {t.tabs.completingSquareBadge}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('examples')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'examples'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>{t.tabs.examples}</span>
          </button>

          <button
            onClick={() => setActiveTab('practice')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'practice'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.tabs.practice}</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'guide'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.tabs.guide}</span>
          </button>
        </div>
      </header>

      {/* Printable Header for School Worksheets */}
      <div className="hidden print:block p-6 border-b border-slate-300">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{t.appTitle} – Worksheet</h1>
          <div className="text-base">
            <span>Name: ______________________ </span>
            <span className="ml-8">Date: ____________</span>
          </div>
        </div>
        <p className="text-sm text-slate-600">{t.footerText}</p>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        {/* Universal Text Formula Bar */}
        <div className="mb-6 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs print:hidden">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-mono font-bold text-base">
                f(x) =
              </span>
              <input
                type="text"
                value={typedFormula}
                onChange={(e) => handleParseFormula(e.target.value)}
                placeholder={t.input.placeholder}
                className="w-full pl-18 pr-4 py-3 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-xl text-base font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-inner"
              />
            </div>
            
            {/* Quick Math Pad Symbols */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {[
                { label: 'x²', val: 'x^2' },
                { label: '√x', val: 'sqrt(x)' },
                { label: 'a/b', val: '(x+1)/(x-1)' },
                { label: 'eˣ', val: 'e^x' },
                { label: '+', val: ' + ' },
                { label: '-', val: ' - ' },
              ].map((sym) => (
                <button
                  key={sym.label}
                  onClick={() => handleParseFormula(typedFormula + sym.val)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-mono font-bold rounded-lg border border-slate-200 transition shrink-0"
                >
                  {sym.label}
                </button>
              ))}
            </div>
          </div>

          {parseNotice && (
            <div className="mt-2 text-sm text-indigo-700 flex items-center gap-1.5 font-medium">
              <Check className="w-4 h-4 text-indigo-600" />
              <span>{parseNotice}</span>
            </div>
          )}

          {/* Recent History Quick Jump */}
          {recentFormulas && recentFormulas.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs text-slate-500">
              <span className="font-semibold flex items-center gap-1 shrink-0 text-slate-600">
                <History className="w-3.5 h-3.5 text-indigo-600" /> Recent:
              </span>
              {recentFormulas.map((f, i) => (
                <button
                  key={i}
                  onClick={() => handleParseFormula(f)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg text-slate-700 font-mono transition shrink-0 border border-slate-200 text-xs"
                >
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* TAB 1: SOLVER */}
        {activeTab === 'solver' && (
          <div className="space-y-8">
            {/* Function Type Selector Cards */}
            <div className="space-y-3 print:hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t.input.selectFamily}
                </span>
                <span className="text-sm text-slate-500 hidden sm:inline">
                  Algebra 2 / Precalculus / AP Precalculus
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { id: 'quadratic', label: 'Quadratic (x²)', desc: 'Completing Square', badge: 'Popular' },
                  { id: 'rational', label: 'Rational Fraction', desc: 'Cross-Multiply & Factor', badge: 'Key Skill' },
                  { id: 'linear', label: 'Linear (mx + b)', desc: 'Slope reciprocal', badge: '' },
                  { id: 'radical', label: 'Square Root (√x)', desc: 'Domain restriction', badge: '' },
                  { id: 'exponential', label: 'Exponential (eˣ)', desc: 'Logarithm ln(x)', badge: '' },
                  { id: 'cubic', label: 'Cubic (x³)', desc: 'Cube root (∛x)', badge: '' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setFunctionType(item.id as FunctionType);
                      if (item.id === 'quadratic') setTypedFormula('x^2 + 4x + 1');
                      if (item.id === 'rational') setTypedFormula('(2x + 3) / (x - 5)');
                      if (item.id === 'linear') setTypedFormula('3x - 7');
                      if (item.id === 'radical') setTypedFormula('sqrt(2x - 5) + 3');
                      if (item.id === 'exponential') setTypedFormula('e^x - 2');
                    }}
                    className={`p-3.5 rounded-xl border text-left transition relative ${
                      functionType === item.id
                        ? 'bg-indigo-50/70 border-indigo-600 ring-2 ring-indigo-500/20 text-indigo-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.badge && (
                      <span className="absolute top-2.5 right-2.5 text-[11px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                        {item.badge}
                      </span>
                    )}
                    <span className="font-bold text-sm block">{item.label}</span>
                    <span className="text-xs text-slate-500">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Parameter Controls & Presets */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 shadow-xs print:hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>{t.input.coefficientsTitle}</span>
                    <span className="text-sm font-normal text-slate-500">
                      {t.input.coefficientsSubtitle}
                    </span>
                  </h3>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center flex-wrap gap-2 text-sm">
                  <span className="font-semibold text-slate-600 flex items-center gap-1">
                    <Zap className="w-4 h-4 text-amber-500" /> {t.input.presetsLabel}
                  </span>
                  <button
                    onClick={() => applyPreset('quad1')}
                    className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-800 font-mono transition"
                  >
                    x² + 4x + 1
                  </button>
                  <button
                    onClick={() => applyPreset('quad2')}
                    className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-800 font-mono transition"
                  >
                    2x² - 12x + 11
                  </button>
                  <button
                    onClick={() => applyPreset('rat1')}
                    className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-800 font-mono transition"
                  >
                    (2x+3)/(x-5)
                  </button>
                  <button
                    onClick={() => applyPreset('lin1')}
                    className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-800 font-mono transition"
                  >
                    3x - 7
                  </button>
                  <button
                    onClick={() => applyPreset('rad1')}
                    className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-800 font-mono transition"
                  >
                    √(2x - 5) + 3
                  </button>
                </div>
              </div>

              {/* Dynamic Coefficient Fields */}
              <div className="pt-4">
                {/* QUADRATIC CONTROLS */}
                {functionType === 'quadratic' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-slate-600 mb-1">
                      <span>Standard Form: <MathView math="f(x) = ax^2 + bx + c" /></span>
                      <span className="text-indigo-600 font-medium">Domain restriction enforces Horizontal Line Test</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Coefficient a (x²)</label>
                        <input
                          type="number"
                          step="1"
                          value={quadA}
                          onChange={(e) => setQuadA(parseFloat(e.target.value) || 1)}
                          className="w-full text-lg font-bold font-mono px-3 py-1.5 border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Coefficient b (x)</label>
                        <input
                          type="number"
                          step="1"
                          value={quadB}
                          onChange={(e) => setQuadB(parseFloat(e.target.value) || 0)}
                          className="w-full text-lg font-bold font-mono px-3 py-1.5 border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Constant c</label>
                        <input
                          type="number"
                          step="1"
                          value={quadC}
                          onChange={(e) => setQuadC(parseFloat(e.target.value) || 0)}
                          className="w-full text-lg font-bold font-mono px-3 py-1.5 border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                        <label className="text-xs font-semibold text-slate-600 block mb-1">{t.input.parabolaBranch}</label>
                        <select
                          value={quadBranch}
                          onChange={(e) => setQuadBranch(e.target.value as '+' | '-')}
                          className="w-full text-sm font-semibold px-3 py-2 border border-slate-300 rounded-lg bg-white"
                        >
                          <option value="+">{t.input.quadBranchRight}</option>
                          <option value="-">{t.input.quadBranchLeft}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* RATIONAL CONTROLS */}
                {functionType === 'rational' && (
                  <div className="space-y-4">
                    <div className="text-sm text-slate-600 mb-1">
                      Rational Form: <MathView math="f(x) = \frac{ax + b}{cx + d}" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Numerator a</label>
                        <input
                          type="number"
                          value={ratA}
                          onChange={(e) => setRatA(parseFloat(e.target.value) || 0)}
                          className="w-full text-lg font-bold font-mono px-3 py-1.5 border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Numerator b</label>
                        <input
                          type="number"
                          value={ratB}
                          onChange={(e) => setRatB(parseFloat(e.target.value) || 0)}
                          className="w-full text-lg font-bold font-mono px-3 py-1.5 border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Denominator c</label>
                        <input
                          type="number"
                          value={ratC}
                          onChange={(e) => setRatC(parseFloat(e.target.value) || 1)}
                          className="w-full text-lg font-bold font-mono px-3 py-1.5 border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Denominator d</label>
                        <input
                          type="number"
                          value={ratD}
                          onChange={(e) => setRatD(parseFloat(e.target.value) || 0)}
                          className="w-full text-lg font-bold font-mono px-3 py-1.5 border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* LINEAR CONTROLS */}
                {functionType === 'linear' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Slope m</label>
                      <input
                        type="number"
                        value={linM}
                        onChange={(e) => setLinM(parseFloat(e.target.value) || 1)}
                        className="w-full text-lg font-bold font-mono px-3 py-1.5 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Y-Intercept b</label>
                      <input
                        type="number"
                        value={linB}
                        onChange={(e) => setLinB(parseFloat(e.target.value) || 0)}
                        className="w-full text-lg font-bold font-mono px-3 py-1.5 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {/* RADICAL CONTROLS */}
                {functionType === 'radical' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Multiplier a</label>
                      <input
                        type="number"
                        value={radA}
                        onChange={(e) => setRadA(parseFloat(e.target.value) || 1)}
                        className="w-full text-lg font-bold font-mono px-3 py-1.5 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Inside b</label>
                      <input
                        type="number"
                        value={radB}
                        onChange={(e) => setRadB(parseFloat(e.target.value) || 1)}
                        className="w-full text-lg font-bold font-mono px-3 py-1.5 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Inside c</label>
                      <input
                        type="number"
                        value={radC}
                        onChange={(e) => setRadC(parseFloat(e.target.value) || 0)}
                        className="w-full text-lg font-bold font-mono px-3 py-1.5 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Vertical Shift d</label>
                      <input
                        type="number"
                        value={radD}
                        onChange={(e) => setRadD(parseFloat(e.target.value) || 0)}
                        className="w-full text-lg font-bold font-mono px-3 py-1.5 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {/* EXPONENTIAL CONTROLS */}
                {functionType === 'exponential' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Multiplier a (a · eˣ)</label>
                      <input
                        type="number"
                        value={expA}
                        onChange={(e) => setExpA(parseFloat(e.target.value) || 1)}
                        className="w-full text-lg font-bold font-mono px-3 py-1.5 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Vertical Shift d</label>
                      <input
                        type="number"
                        value={expD}
                        onChange={(e) => setExpD(parseFloat(e.target.value) || 0)}
                        className="w-full text-lg font-bold font-mono px-3 py-1.5 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {/* CUBIC CONTROLS */}
                {functionType === 'cubic' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Coefficient a</label>
                      <input
                        type="number"
                        value={cubA}
                        onChange={(e) => setCubA(parseFloat(e.target.value) || 1)}
                        className="w-full text-lg font-bold font-mono px-3 py-1.5 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Horizontal Shift h</label>
                      <input
                        type="number"
                        value={cubH}
                        onChange={(e) => setCubH(parseFloat(e.target.value) || 0)}
                        className="w-full text-lg font-bold font-mono px-3 py-1.5 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Vertical Shift k</label>
                      <input
                        type="number"
                        value={cubK}
                        onChange={(e) => setCubK(parseFloat(e.target.value) || 0)}
                        className="w-full text-lg font-bold font-mono px-3 py-1.5 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Results Showcase Header */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left 6 Columns: Equation Cards */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
                <div className="bg-white border-2 border-indigo-600 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide bg-indigo-50 text-indigo-700">
                      {t.result.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={copyFullSolution}
                        className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedSteps ? t.copiedNotice : t.result.copyBtn}</span>
                      </button>
                      <button
                        onClick={() => setIsAITutorOpen(true)}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> {t.result.explainBtn}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Original Function */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-xs font-semibold text-slate-500 mb-1">{t.result.originalFunction}</div>
                      <div className="text-lg sm:text-xl font-bold text-blue-700">
                        <MathView math={solution.originalEquation} copyable />
                      </div>
                      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-600 mt-2">
                        <span><strong>{t.result.domain}</strong> <MathView math={solution.domainOriginal} /></span>
                        <span><strong>{t.result.range}</strong> <MathView math={solution.rangeOriginal} /></span>
                      </div>
                    </div>

                    {/* Inverse Function */}
                    <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-300 ring-1 ring-emerald-500/20">
                      <div className="text-xs font-semibold text-emerald-800 mb-1 flex items-center justify-between">
                        <span>{t.result.inverseFunction}</span>
                        <span className="bg-emerald-200/60 text-emerald-900 text-xs px-2 py-0.5 rounded font-bold">
                          f⁻¹(x)
                        </span>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-emerald-900">
                        <MathView math={solution.inverseEquation} copyable />
                      </div>
                      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-emerald-800 mt-2">
                        <span><strong>{t.result.domain}</strong> <MathView math={solution.domainInverse} /></span>
                        <span><strong>{t.result.range}</strong> <MathView math={solution.rangeInverse} /></span>
                      </div>
                    </div>
                  </div>

                  {/* Common Misconception Pill */}
                  <div className="mt-4 p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-sm text-amber-900 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-xs uppercase tracking-wide">{t.result.warningTitle}</span>
                      <div className="mt-0.5">
                        <MathView math="f^{-1}(x) \neq \frac{1}{f(x)}" />. {t.result.warningDesc}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Link to Completing the Square Tab if quadratic */}
                {functionType === 'quadratic' && (
                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl flex items-center justify-between print:hidden">
                    <div>
                      <span className="font-bold text-sm text-indigo-900 block">
                        {t.tabs.completingSquare}
                      </span>
                      <span className="text-xs text-slate-600">
                        {t.result.deepDivePrompt}
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveTab('completing_square')}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shrink-0"
                    >
                      <span>{t.result.deepDiveBtn}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Right 6 Columns: Interactive Graph */}
              <div className="lg:col-span-6 print:hidden">
                <GraphCanvas solution={solution} />
              </div>
            </div>

            {/* Utility Sub-Nav Pill */}
            <div className="border-b border-slate-200 pb-3 flex flex-wrap items-center justify-between gap-3 print:hidden">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-sm font-semibold">
                <button
                  onClick={() => setSolverSubView('steps')}
                  className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 ${
                    solverSubView === 'steps'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Calculator className="w-4 h-4" />
                  <span>{t.subviews.steps}</span>
                </button>
                <button
                  onClick={() => setSolverSubView('table')}
                  className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 ${
                    solverSubView === 'table'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Table className="w-4 h-4" />
                  <span>{t.subviews.table}</span>
                </button>
                <button
                  onClick={() => setSolverSubView('evaluator')}
                  className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 ${
                    solverSubView === 'evaluator'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.subviews.evaluator}</span>
                </button>
                <button
                  onClick={() => setSolverSubView('calculus')}
                  className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 ${
                    solverSubView === 'calculus'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>{t.subviews.calculus}</span>
                </button>
              </div>

              <span className="text-sm text-slate-500 font-medium">
                {solverSubView === 'steps' && `${solution.steps.length} Steps Generated`}
                {solverSubView === 'table' && 'Coordinate Reflection Verification'}
                {solverSubView === 'evaluator' && 'Real-time Point Substitution'}
                {solverSubView === 'calculus' && 'Horizontal Line Test Proof'}
              </span>
            </div>

            {/* SUB-VIEW 1: 4-STEP MASTER BREAKDOWN */}
            {solverSubView === 'steps' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    {t.stepsTitle}
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {t.stepsSubtitle}
                  </p>
                </div>

                {/* Steps List */}
                <div className="space-y-4">
                  {solution.steps.map((st, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-xl border border-slate-200 hover:border-indigo-300 transition bg-slate-50/40 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                            {st.stepNumber}
                          </span>
                          <h4 className="font-bold text-base text-slate-900">{st.title}</h4>
                        </div>
                        {st.badge && (
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 hidden sm:inline">
                            {st.badge}
                          </span>
                        )}
                      </div>

                      <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-center my-2 shadow-xs overflow-x-auto text-base">
                        <MathView math={st.latex} block copyable />
                      </div>

                      <p className="text-sm text-slate-700 leading-relaxed">{st.explanation}</p>

                      {st.tip && (
                        <div className="text-xs sm:text-sm bg-indigo-50 border border-indigo-200 rounded-lg p-2.5 text-indigo-900 flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                          <span><strong>Tip:</strong> {st.tip}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Verification & Algebraic Check */}
                <div className="mt-6 p-5 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-base">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{t.verificationTitle}</span>
                  </div>
                  <p className="text-sm text-emerald-800 leading-relaxed">
                    {t.verificationDesc}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="bg-white p-3.5 rounded-lg border border-emerald-200 text-center overflow-x-auto">
                      <span className="text-slate-500 font-semibold block mb-1">Check 1: Composition f(f⁻¹(x))</span>
                      <MathView math={solution.verificationSteps.composition1} />
                    </div>
                    <div className="bg-white p-3.5 rounded-lg border border-emerald-200 text-center overflow-x-auto">
                      <span className="text-slate-500 font-semibold block mb-1">Check 2: Composition f⁻¹(f(x))</span>
                      <MathView math={solution.verificationSteps.composition2} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: TABLE OF VALUES */}
            {solverSubView === 'table' && <ValuesTable solution={solution} />}

            {/* SUB-VIEW 3: POINT EVALUATOR */}
            {solverSubView === 'evaluator' && <ValueEvaluator solution={solution} />}

            {/* SUB-VIEW 4: MONOTONICITY & DERIVATIVE */}
            {solverSubView === 'calculus' && <DerivativeAnalysis solution={solution} />}

            {/* Worked Examples Carousel */}
            <div className="print:hidden">
              <WorkedExamplesLibrary onLoadExample={handleLoadWorkedExample} />
            </div>

            {/* Related Tools Suite */}
            <div className="print:hidden">
              <RelatedCalculators onSwitchType={(tType, p) => {
                setFunctionType(tType);
                if (p) applyPreset(p);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} />
            </div>

            {/* SEO Content Hub for Ranking & Traffic */}
            <div className="print:hidden">
              <SEOContentHub />
            </div>
          </div>
        )}

        {/* TAB 2: COMPLETING THE SQUARE DEEP DIVE */}
        {activeTab === 'completing_square' && (
          <div className="space-y-6">
            {solution.completingSquareDetail ? (
              <CompletingTheSquareExplainer detail={solution.completingSquareDetail} />
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-4">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className="font-bold text-slate-800 text-base">Select a Quadratic Function</h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Completing the square is exclusively used for quadratic equations where <MathView math="y" /> appears in both quadratic and linear terms.
                </p>
                <button
                  onClick={() => {
                    setFunctionType('quadratic');
                    setQuadA(1);
                    setQuadB(4);
                    setQuadC(1);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
                >
                  Load Example: f(x) = x² + 4x + 1
                </button>
              </div>
            )}
            <div className="print:hidden">
              <SEOContentHub />
            </div>
          </div>
        )}

        {/* TAB 3: WORKED EXAMPLES LIBRARY */}
        {activeTab === 'examples' && (
          <div className="space-y-6">
            <WorkedExamplesLibrary onLoadExample={handleLoadWorkedExample} />
            <div className="print:hidden">
              <SEOContentHub />
            </div>
          </div>
        )}

        {/* TAB 4: PRACTICE QUIZ */}
        {activeTab === 'practice' && (
          <div className="space-y-6">
            <PracticeMode />
            <div className="print:hidden">
              <SEOContentHub />
            </div>
          </div>
        )}

        {/* TAB 5: US HIGH SCHOOL REFERENCE GUIDE */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            <SEOContentHub />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>{t.footerText}</p>
          <div className="flex items-center space-x-4">
            <button onClick={() => setActiveTab('solver')} className="hover:text-indigo-600 transition">
              {t.tabs.solver}
            </button>
            <button onClick={() => setActiveTab('completing_square')} className="hover:text-indigo-600 transition">
              {t.tabs.completingSquare}
            </button>
            <button onClick={() => setActiveTab('examples')} className="hover:text-indigo-600 transition">
              {t.tabs.examples}
            </button>
            <button onClick={() => setActiveTab('practice')} className="hover:text-indigo-600 transition">
              {t.tabs.practice}
            </button>
            <button onClick={() => setActiveTab('guide')} className="hover:text-indigo-600 transition">
              {t.tabs.guide}
            </button>
          </div>
        </div>
      </footer>

      {/* AI Tutor Modal */}
      <AITutorModal
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
        solution={solution}
      />

      {/* Embed Generator Modal */}
      <EmbedModal
        isOpen={isEmbedOpen}
        onClose={() => setIsEmbedOpen(false)}
        currentFormula={typedFormula}
      />
    </div>
  );
}
