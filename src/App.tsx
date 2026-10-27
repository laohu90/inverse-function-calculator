/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Calculator,
  Layers,
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
  Check,
  BookMarked,
  TrendingUp,
  Table,
  Info,
  ShieldCheck,
  Mail,
  Github,
  Download,
  AlertTriangle,
  FlaskConical,
} from 'lucide-react';
import { MathView } from './components/MathView';
import { GraphCanvas } from './components/GraphCanvas';
import { CompletingTheSquareExplainer } from './components/CompletingTheSquareExplainer';
import { PracticeMode } from './components/PracticeMode';
import { SEOContentHub } from './components/SEOContentHub';
import { ValuesTable } from './components/ValuesTable';
import { ValueEvaluator } from './components/ValueEvaluator';
import { WorkedExamplesLibrary, WorkedExampleItem } from './components/WorkedExamplesLibrary';
import { DerivativeAnalysis } from './components/DerivativeAnalysis';
import { RelatedCalculators } from './components/RelatedCalculators';
import { LanguageSelector } from './components/LanguageSelector';
import { EmbedModal } from './components/EmbedModal';
import { AboutModal } from './components/AboutModal';
import { ExportModal } from './components/ExportModal';
import { RegressionModal } from './components/RegressionModal';
import { SupportedLocale, TRANSLATIONS } from './i18n/translations';
import {
  solveQuadratic,
  solveRational,
  solveLinear,
  solveRadical,
  solveExponential,
  solvePolynomialPower,
  solveLogarithmic,
  solveTrigonometric,
  solveInverseTrig,
} from './utils/inverseSolver';
import { parseMathExpression } from './utils/expressionParser';
import { FunctionType, InverseSolution } from './types/math';

export default function App() {
  // Locale State: Defaults to English
  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang') || urlParams.get('hl');
      if (urlLang && ['en', 'es', 'fr', 'pt', 'zh'].includes(urlLang.toLowerCase())) {
        return urlLang.toLowerCase() as SupportedLocale;
      }
      try {
        const saved = localStorage.getItem('inv_preferred_locale');
        if (saved && ['en', 'es', 'fr', 'pt', 'zh'].includes(saved)) {
          return saved as SupportedLocale;
        }
      } catch {
        // ignore
      }
    }
    return 'en';
  });

  const handleSelectLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('inv_preferred_locale', newLocale);
    } catch {
      // ignore
    }
    if (typeof window !== 'undefined' && window.history) {
      const url = new URL(window.location.href);
      if (newLocale === 'en') {
        url.searchParams.delete('lang');
      } else {
        url.searchParams.set('lang', newLocale);
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  const t = useMemo(() => TRANSLATIONS[locale], [locale]);

  // Synchronize document title and meta description
  useEffect(() => {
    document.title = t.seoTitle;
    document.documentElement.lang = locale;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', t.seoDesc);
    }
  }, [t, locale]);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'solver' | 'completing_square' | 'examples' | 'practice' | 'guide'>('solver');
  const [functionType, setFunctionType] = useState<FunctionType>('quadratic');

  // Input & Parse state
  const [typedFormula, setTypedFormula] = useState<string>('x^2 + 4x + 1');
  const [parseNotice, setParseNotice] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  // Modals state
  const [isEmbedOpen, setIsEmbedOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [aboutSubTab, setAboutSubTab] = useState<'about' | 'privacy' | 'contact'>('about');
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isRegressionOpen, setIsRegressionOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedSteps, setCopiedSteps] = useState<boolean>(false);

  // Sub-view toggle in solver: 'steps' | 'table' | 'evaluator' | 'calculus'
  const [solverSubView, setSolverSubView] = useState<'steps' | 'table' | 'evaluator' | 'calculus'>('steps');

  // Parameters for manual family adjustments
  const [quadA, setQuadA] = useState<number>(1);
  const [quadB, setQuadB] = useState<number>(4);
  const [quadC, setQuadC] = useState<number>(1);
  const [quadBranch, setQuadBranch] = useState<'+' | '-'>('+');

  const [ratA, setRatA] = useState<number>(2);
  const [ratB, setRatB] = useState<number>(3);
  const [ratC, setRatC] = useState<number>(1);
  const [ratD, setRatD] = useState<number>(-5);

  const [linM, setLinM] = useState<number>(3);
  const [linB, setLinB] = useState<number>(-7);

  const [radA, setRadA] = useState<number>(1);
  const [radB, setRadB] = useState<number>(2);
  const [radC, setRadC] = useState<number>(-5);
  const [radD, setRadD] = useState<number>(3);

  const [expA, setExpA] = useState<number>(1);
  const [expBase, setExpBase] = useState<number>(Math.E);
  const [expD, setExpD] = useState<number>(-2);

  const [cubA, setCubA] = useState<number>(1);
  const [cubH, setCubH] = useState<number>(2);
  const [cubK, setCubK] = useState<number>(-1);

  // Solution State (persisted valid solution; does NOT degrade on parse errors)
  const [customSolution, setCustomSolution] = useState<InverseSolution | null>(() => {
    return solveQuadratic(1, 4, 1, '+');
  });

  // Recent formula history
  const [recentFormulas, setRecentFormulas] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('inv_recent_formulas');
      return saved ? JSON.parse(saved) : ['x^2 + 4x + 1', 'x^3 + 1', '(2x+3)/(x-5)', '3x - 7', 'e^x', '√(x-1)'];
    } catch {
      return ['x^2 + 4x + 1', 'x^3 + 1', '(2x+3)/(x-5)', '3x - 7', 'e^x', '√(x-1)'];
    }
  });

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

  // Compute active solution
  const currentSolution: InverseSolution = useMemo(() => {
    if (customSolution) return customSolution;
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
        return solveExponential(expA || 1, expBase, 1, 0, expD);
      case 'cubic':
      case 'polynomial':
        return solvePolynomialPower(cubA || 1, 3, cubH, cubK);
      default:
        return solveQuadratic(1, 4, 1, '+');
    }
  }, [
    customSolution,
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
    expBase,
    expD,
    cubA,
    cubH,
    cubK,
  ]);

  // Robust Formula Parser Handler
  const handleParseFormula = (text: string) => {
    setTypedFormula(text);

    if (!text.trim()) {
      setParseError(null);
      setParseNotice(null);
      return;
    }

    const parseRes = parseMathExpression(text);

    if (parseRes.success) {
      setParseError(null);
      setFunctionType(parseRes.type);
      setCustomSolution(parseRes.solution);
      setParseNotice(`Recognized ${parseRes.type}: ${parseRes.solution.originalEquation}`);
      setTimeout(() => setParseNotice(null), 3500);

      // Persist to recent formulas history
      setRecentFormulas((prev) => {
        const next = [text, ...prev.filter((item) => item !== text)].slice(0, 7);
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
    } else {
      // REQUIREMENT 1: Explicitly report error, forbid downgrading to linear identity!
      setParseNotice(null);
      setParseError(`${parseRes.error} ${parseRes.suggestion || 'Use the Function Family buttons below to select the function type and enter parameters.'}`);
    }
  };

  // Presets
  const applyPreset = (presetName: string) => {
    setParseError(null);
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
    } else if (presetName === 'lin1') {
      setFunctionType('linear');
      setLinM(3);
      setLinB(-7);
      handleParseFormula('3x - 7');
    } else if (presetName === 'rad1') {
      setFunctionType('radical');
      setRadA(1);
      setRadB(1);
      setRadC(-1);
      setRadD(0);
      handleParseFormula('√(x - 1)');
    } else if (presetName === 'cub1') {
      setFunctionType('cubic');
      setCubA(1);
      setCubH(0);
      setCubK(1);
      handleParseFormula('x^3 + 1');
    } else if (presetName === 'exp1') {
      setFunctionType('exponential');
      setExpA(1);
      setExpBase(Math.E);
      setExpD(0);
      handleParseFormula('e^x');
    } else if (presetName === 'log1') {
      setFunctionType('logarithmic');
      handleParseFormula('ln(x)');
    }
  };

  const handleSelectFamilyCard = (fam: FunctionType) => {
    setFunctionType(fam);
    setParseError(null);
    if (fam === 'quadratic') {
      setQuadA(1);
      setQuadB(4);
      setQuadC(1);
      handleParseFormula('x^2 + 4x + 1');
    } else if (fam === 'rational') {
      setRatA(2);
      setRatB(3);
      setRatC(1);
      setRatD(-5);
      handleParseFormula('(2x + 3) / (x - 5)');
    } else if (fam === 'linear') {
      setLinM(3);
      setLinB(-7);
      handleParseFormula('3x - 7');
    } else if (fam === 'radical') {
      handleParseFormula('sqrt(x - 1)');
    } else if (fam === 'exponential') {
      handleParseFormula('e^x');
    } else if (fam === 'cubic' || fam === 'polynomial') {
      handleParseFormula('x^3 + 1');
    } else if (fam === 'logarithmic') {
      handleParseFormula('ln(x)');
    } else if (fam === 'trigonometric') {
      handleParseFormula('sin(x)');
    } else if (fam === 'inverse_trig') {
      handleParseFormula('arcsin(x)');
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
Original Function: ${currentSolution.originalEquation}
Domain: ${currentSolution.domainOriginal}
Range: ${currentSolution.rangeOriginal}

Inverse Function: ${currentSolution.inverseEquation}
Domain: ${currentSolution.domainInverse}
Range: ${currentSolution.rangeInverse}

Horizontal Line Test:
${currentSolution.horizontalLineTest.title} - ${currentSolution.horizontalLineTest.explanation}

Steps:
${currentSolution.steps.map((s) => `${s.stepNumber}. ${s.title}: ${s.latex} (${s.explanation})`).join('\n')}

Verification:
${currentSolution.verificationSteps.composition1}
`;
    navigator.clipboard.writeText(text);
    setCopiedSteps(true);
    setTimeout(() => setCopiedSteps(false), 2000);
  };

  const handleResetToDefault = () => {
    setFunctionType('quadratic');
    setQuadA(1);
    setQuadB(4);
    setQuadC(1);
    setQuadBranch('+');
    setTypedFormula('x^2 + 4x + 1');
    setParseNotice(null);
    setParseError(null);
    setCustomSolution(solveQuadratic(1, 4, 1, '+'));
    setSolverSubView('steps');
    setActiveTab('solver');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col font-sans antialiased text-base selection:bg-indigo-100 selection:text-indigo-900 print:bg-white print:text-black">
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
                <span className="hidden md:inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  By laohu90
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Rigorous algebraic solver with Horizontal Line Test & domain restriction
              </p>
            </div>
          </div>

          {/* Action buttons + Language Selector */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Regression Test Runner Button */}
            <button
              onClick={() => setIsRegressionOpen(true)}
              title="Run 10 Regression Tests"
              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition flex items-center gap-1.5"
            >
              <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">10 Regression Tests</span>
            </button>

            {/* Language Selector */}
            <LanguageSelector currentLocale={locale} onSelectLocale={handleSelectLocale} />

            {/* Export & Share */}
            <button
              onClick={() => setIsExportOpen(true)}
              title="Export solution"
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition flex items-center gap-1 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* About & Contact */}
            <button
              onClick={() => {
                setAboutSubTab('about');
                setIsAboutOpen(true);
              }}
              title="About & Author"
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition text-sm flex items-center gap-1"
            >
              <Info className="w-4 h-4" />
              <span className="hidden lg:inline">About</span>
            </button>

            <button
              onClick={handleResetToDefault}
              title={t.resetBtn}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition text-sm flex items-center gap-1"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Tab Sub-Header */}
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

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full space-y-6">
        {/* Universal Text Formula Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs print:hidden">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-mono font-bold text-base">
                f(x) =
              </span>
              <input
                type="text"
                value={typedFormula}
                onChange={(e) => handleParseFormula(e.target.value)}
                placeholder="e.g. 3x-7, x^2+4x+1, (2x+3)/(x-5), e^x, sqrt(x-1), x^3, x^3+1, ln(x), 1/(x+2), 2^x"
                className={`w-full pl-18 pr-4 py-3.5 bg-slate-50/70 hover:bg-white focus:bg-white border rounded-xl text-base font-mono text-slate-900 focus:outline-none focus:ring-2 transition shadow-inner ${
                  parseError
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/30'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
              />
            </div>
            
            {/* Quick Math Pad Symbols */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {[
                { label: 'x³+1', val: 'x^3 + 1' },
                { label: 'x²', val: 'x^2' },
                { label: '√x', val: 'sqrt(x)' },
                { label: 'eˣ', val: 'e^x' },
                { label: '2ˣ', val: '2^x' },
                { label: 'ln(x)', val: 'ln(x)' },
                { label: '1/(x+2)', val: '1/(x+2)' },
              ].map((sym) => (
                <button
                  key={sym.label}
                  onClick={() => handleParseFormula(sym.val)}
                  className="px-2.5 py-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-800 text-xs font-mono font-bold rounded-xl border border-slate-200 transition shrink-0"
                >
                  {sym.label}
                </button>
              ))}
            </div>
          </div>

          {/* REQUIREMENT 1: Explicit Error Banner when parsing fails */}
          {parseError && (
            <div className="mt-3.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-sm flex items-start gap-2.5 animate-in fade-in">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block text-rose-800">
                  Formula Parse Error (No Silent Fallback):
                </span>
                <p className="text-xs text-rose-700 leading-relaxed">
                  {parseError}
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <span className="text-xs text-rose-600 font-medium">Quick switch:</span>
                  {(['linear', 'quadratic', 'rational', 'radical', 'exponential', 'cubic', 'logarithmic'] as FunctionType[]).map((fam) => (
                    <button
                      key={fam}
                      onClick={() => handleSelectFamilyCard(fam)}
                      className="px-2 py-0.5 rounded bg-white hover:bg-rose-100 border border-rose-200 text-rose-800 text-[11px] font-semibold capitalize transition"
                    >
                      {fam}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Parse Success Notification */}
          {parseNotice && !parseError && (
            <div className="mt-3 text-sm text-indigo-700 flex items-center gap-1.5 font-medium bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100">
              <Check className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{parseNotice}</span>
            </div>
          )}

          {/* Recent History Quick Jump */}
          {recentFormulas && recentFormulas.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs text-slate-500">
              <span className="font-semibold flex items-center gap-1.5 shrink-0 text-slate-700">
                <RotateCcw className="w-3.5 h-3.5 text-indigo-600" /> Recent:
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
          <div className="space-y-6">
            {/* Function Type Selector Cards */}
            <div className="space-y-3 print:hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Function Family
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  Supports n-th polynomials, logs with base change, rationals, radicals, trig & piecewise
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
                {[
                  { fam: 'linear', label: 'Linear', desc: 'mx + b', badge: '1-to-1' },
                  { fam: 'quadratic', label: 'Quadratic', desc: 'ax² + bx + c', badge: 'HLT Restr.' },
                  { fam: 'cubic', label: 'Cubic / xⁿ', desc: 'x³, xⁿ', badge: 'Odd: 1-to-1' },
                  { fam: 'rational', label: 'Rational', desc: '(ax+b)/(cx+d)', badge: 'Hyperbola' },
                  { fam: 'radical', label: 'Radical', desc: '√(bx+c)', badge: 'x ≥ 0' },
                  { fam: 'exponential', label: 'Exponential', desc: 'eˣ, 2ˣ, bˣ', badge: 'x > 0' },
                  { fam: 'logarithmic', label: 'Logarithm', desc: 'ln(x), log_b(x)', badge: 'Change Base' },
                  { fam: 'trigonometric', label: 'Trig', desc: 'sin, cos, tan', badge: 'Principal' },
                ].map((item) => (
                  <button
                    key={item.fam}
                    onClick={() => handleSelectFamilyCard(item.fam as FunctionType)}
                    className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between ${
                      functionType === item.fam
                        ? 'bg-indigo-50/90 border-indigo-600 ring-2 ring-indigo-500/20 text-indigo-950 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs block mb-0.5">{item.label}</span>
                      <span className="text-[11px] text-slate-500 font-mono block">{item.desc}</span>
                    </div>
                    <span className="mt-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 inline-block w-fit">
                      {item.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Parameter Controls & Presets */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs print:hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>Coefficients & Parameters</span>
                    <span className="text-xs font-normal text-slate-500">
                      Fine-tune values or select quick presets
                    </span>
                  </h3>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center flex-wrap gap-1.5 text-xs">
                  <span className="font-semibold text-slate-600 flex items-center gap-1 mr-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> Presets:
                  </span>
                  <button onClick={() => applyPreset('quad1')} className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-800 font-mono transition">x²+4x+1</button>
                  <button onClick={() => applyPreset('cub1')} className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-800 font-mono transition">x³+1</button>
                  <button onClick={() => applyPreset('rat1')} className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-800 font-mono transition">(2x+3)/(x-5)</button>
                  <button onClick={() => applyPreset('lin1')} className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-800 font-mono transition">3x-7</button>
                  <button onClick={() => applyPreset('rad1')} className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-800 font-mono transition">√(x-1)</button>
                  <button onClick={() => applyPreset('exp1')} className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-800 font-mono transition">eˣ</button>
                  <button onClick={() => applyPreset('log1')} className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-800 font-mono transition">ln(x)</button>
                </div>
              </div>

              {/* Dynamic Coefficient Fields */}
              <div className="pt-3">
                {/* QUADRATIC CONTROLS */}
                {functionType === 'quadratic' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                      <span>Standard Form: <MathView math="f(x) = ax^2 + bx + c" /></span>
                      <span className="text-amber-700 font-medium">Domain restriction enforces Horizontal Line Test</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <label className="text-xs font-semibold text-slate-600 block mb-1">a (x²)</label>
                        <input
                          type="number"
                          step="1"
                          value={quadA}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 1;
                            setQuadA(val);
                            setCustomSolution(solveQuadratic(val, quadB, quadC, quadBranch));
                          }}
                          className="w-full text-base font-bold font-mono px-2 py-1 border border-slate-300 rounded"
                        />
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <label className="text-xs font-semibold text-slate-600 block mb-1">b (x)</label>
                        <input
                          type="number"
                          step="1"
                          value={quadB}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setQuadB(val);
                            setCustomSolution(solveQuadratic(quadA, val, quadC, quadBranch));
                          }}
                          className="w-full text-base font-bold font-mono px-2 py-1 border border-slate-300 rounded"
                        />
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <label className="text-xs font-semibold text-slate-600 block mb-1">c (const)</label>
                        <input
                          type="number"
                          step="1"
                          value={quadC}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setQuadC(val);
                            setCustomSolution(solveQuadratic(quadA, quadB, val, quadBranch));
                          }}
                          className="w-full text-base font-bold font-mono px-2 py-1 border border-slate-300 rounded"
                        />
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <label className="text-xs font-semibold text-slate-600 block mb-1">HLT Monotonic Branch</label>
                        <select
                          value={quadBranch}
                          onChange={(e) => {
                            const bVal = e.target.value as '+' | '-';
                            setQuadBranch(bVal);
                            setCustomSolution(solveQuadratic(quadA, quadB, quadC, bVal));
                          }}
                          className="w-full text-xs font-semibold px-2 py-2 border border-slate-300 rounded bg-white"
                        >
                          <option value="+">Right Branch: x ≥ -b/(2a)</option>
                          <option value="-">Left Branch: x ≤ -b/(2a)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* RATIONAL CONTROLS */}
                {functionType === 'rational' && (
                  <div className="space-y-3">
                    <div className="text-xs text-slate-600 mb-1">
                      Rational Form: <MathView math="f(x) = \frac{ax + b}{cx + d}" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Numerator a</label>
                        <input
                          type="number"
                          value={ratA}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setRatA(val);
                            setCustomSolution(solveRational(val, ratB, ratC, ratD));
                          }}
                          className="w-full text-base font-bold font-mono px-2 py-1 border border-slate-300 rounded"
                        />
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Numerator b</label>
                        <input
                          type="number"
                          value={ratB}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setRatB(val);
                            setCustomSolution(solveRational(ratA, val, ratC, ratD));
                          }}
                          className="w-full text-base font-bold font-mono px-2 py-1 border border-slate-300 rounded"
                        />
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Denominator c</label>
                        <input
                          type="number"
                          value={ratC}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 1;
                            setRatC(val);
                            setCustomSolution(solveRational(ratA, ratB, val, ratD));
                          }}
                          className="w-full text-base font-bold font-mono px-2 py-1 border border-slate-300 rounded"
                        />
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Denominator d</label>
                        <input
                          type="number"
                          value={ratD}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setRatD(val);
                            setCustomSolution(solveRational(ratA, ratB, ratC, val));
                          }}
                          className="w-full text-base font-bold font-mono px-2 py-1 border border-slate-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* LINEAR CONTROLS */}
                {functionType === 'linear' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Slope (m)</label>
                      <input
                        type="number"
                        value={linM}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 1;
                          setLinM(val);
                          setCustomSolution(solveLinear(val, linB));
                        }}
                        className="w-full text-base font-bold font-mono px-2 py-1 border border-slate-300 rounded"
                      />
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Y-Intercept (b)</label>
                      <input
                        type="number"
                        value={linB}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setLinB(val);
                          setCustomSolution(solveLinear(linM, val));
                        }}
                        className="w-full text-base font-bold font-mono px-2 py-1 border border-slate-300 rounded"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Results Showcase Header */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left 6 Columns: Equation & Verification Cards */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
                <div className="bg-white border-2 border-indigo-600 rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden space-y-4">
                  {/* Top Header of Card */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide bg-indigo-50 text-indigo-700">
                      Inverse Function Result
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={copyFullSolution}
                        className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedSteps ? 'Copied Steps!' : 'Copy Steps'}</span>
                      </button>
                      <button
                        onClick={() => setIsExportOpen(true)}
                        className="text-xs text-indigo-700 hover:text-indigo-900 font-semibold flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export</span>
                      </button>
                    </div>
                  </div>

                  {/* REQUIREMENT 3: Horizontal Line Test (HLT) Verification Pill */}
                  <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                    currentSolution.horizontalLineTest.passed
                      ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                      : 'bg-amber-50/90 border-amber-300 text-amber-950'
                  }`}>
                    {currentSolution.horizontalLineTest.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-0.5">
                      <span className="font-bold block">
                        {currentSolution.horizontalLineTest.title}
                      </span>
                      <p className="leading-relaxed text-slate-700">
                        {currentSolution.horizontalLineTest.explanation}
                      </p>
                      {currentSolution.restrictionNote && (
                        <div className="pt-1 font-semibold text-indigo-800">
                          {currentSolution.restrictionNote}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Equations List */}
                  <div className="space-y-3.5">
                    {/* Original Function */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-xs font-semibold text-slate-500 mb-1">Original Function f(x)</div>
                      <div className="text-lg sm:text-xl font-bold text-blue-700">
                        <MathView math={currentSolution.originalEquation} copyable />
                      </div>
                      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-600 mt-2">
                        <span><strong>Domain of f:</strong> <MathView math={currentSolution.domainOriginal} /></span>
                        <span><strong>Range of f:</strong> <MathView math={currentSolution.rangeOriginal} /></span>
                      </div>
                    </div>

                    {/* Inverse Function with EXPLICIT DOMAIN RESTRICTION */}
                    <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-300 ring-1 ring-emerald-500/20">
                      <div className="text-xs font-semibold text-emerald-800 mb-1 flex items-center justify-between">
                        <span>Inverse Function f⁻¹(x)</span>
                        <span className="bg-emerald-200/60 text-emerald-900 text-xs px-2 py-0.5 rounded font-bold">
                          Explicit Domain Enforced
                        </span>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-emerald-900">
                        <MathView math={currentSolution.inverseEquation} copyable />
                      </div>
                      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-emerald-800 mt-2">
                        <span><strong>Domain of f⁻¹:</strong> <MathView math={currentSolution.domainInverse} /></span>
                        <span><strong>Range of f⁻¹:</strong> <MathView math={currentSolution.rangeInverse} /></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Link to Completing the Square Tab if quadratic */}
                {functionType === 'quadratic' && (
                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl flex items-center justify-between print:hidden">
                    <div>
                      <span className="font-bold text-sm text-indigo-900 block">
                        Completing the Square Breakdown
                      </span>
                      <span className="text-xs text-slate-600">
                        Deep dive into vertex form & binomial factoring
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveTab('completing_square')}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shrink-0"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Right 6 Columns: Interactive Graph */}
              <div className="lg:col-span-6 print:hidden">
                <GraphCanvas solution={currentSolution} t={t.graph} />
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
                  <span>Derivation Steps</span>
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
                  <span>Values Table</span>
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
                  <span>Evaluator</span>
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
                  <span>Derivative Check</span>
                </button>
              </div>

              <span className="text-xs text-slate-500 font-medium">
                {solverSubView === 'steps' && `${currentSolution.steps.length} Algebraic Steps`}
              </span>
            </div>

            {/* REQUIREMENT 4: Derivation Steps Must strictly match answer */}
            {solverSubView === 'steps' && (
              <div id="derivation-steps-section" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Step-by-Step Algebraic Derivation
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Exact step transformations corresponding precisely to the inverse answer
                    </p>
                  </div>
                  <button
                    onClick={copyFullSolution}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy All Steps</span>
                  </button>
                </div>

                {/* Steps List */}
                <div className="space-y-4">
                  {currentSolution.steps.map((st, idx) => (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 rounded-xl border border-slate-200 hover:border-indigo-300 transition bg-slate-50/40 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                            {st.stepNumber}
                          </span>
                          <h4 className="font-bold text-sm sm:text-base text-slate-900">{st.title}</h4>
                        </div>
                        {st.badge && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 hidden sm:inline">
                            {st.badge}
                          </span>
                        )}
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-slate-200 text-center my-2 shadow-xs overflow-x-auto text-base">
                        <MathView math={st.latex} block copyable />
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{st.explanation}</p>

                      {st.tip && (
                        <div className="text-xs bg-indigo-50 border border-indigo-200 rounded-lg p-2 text-indigo-900 flex items-start gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                          <span><strong>Tip:</strong> {st.tip}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Verification & Identity Check */}
                <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2.5">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Composition Proof & Identity Check</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-lg border border-emerald-200 text-center overflow-x-auto">
                      <span className="text-slate-500 font-semibold block mb-1">Check 1: Composition f(f⁻¹(x))</span>
                      <MathView math={currentSolution.verificationSteps.composition1} />
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-emerald-200 text-center overflow-x-auto">
                      <span className="text-slate-500 font-semibold block mb-1">Check 2: Composition f⁻¹(f(x))</span>
                      <MathView math={currentSolution.verificationSteps.composition2} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: TABLE OF VALUES */}
            {solverSubView === 'table' && <ValuesTable solution={currentSolution} t={t.table} />}

            {/* SUB-VIEW 3: POINT EVALUATOR */}
            {solverSubView === 'evaluator' && <ValueEvaluator solution={currentSolution} t={t.evaluator} />}

            {/* SUB-VIEW 4: MONOTONICITY & DERIVATIVE */}
            {solverSubView === 'calculus' && <DerivativeAnalysis solution={currentSolution} t={t.calculus} />}

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
          </div>
        )}

        {/* TAB 2: COMPLETING THE SQUARE DEEP DIVE */}
        {activeTab === 'completing_square' && (
          <div className="space-y-6">
            {currentSolution.completingSquareDetail ? (
              <CompletingTheSquareExplainer detail={currentSolution.completingSquareDetail} />
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-4">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className="font-bold text-slate-800 text-base">Select a Quadratic Function</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Completing the square is exclusively used for quadratic equations where x appears in both quadratic and linear terms.
                </p>
                <button
                  onClick={() => {
                    setFunctionType('quadratic');
                    handleParseFormula('x^2 + 4x + 1');
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition"
                >
                  Load Example: f(x) = x² + 4x + 1
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: WORKED EXAMPLES LIBRARY */}
        {activeTab === 'examples' && (
          <div className="space-y-6">
            <WorkedExamplesLibrary onLoadExample={handleLoadWorkedExample} />
          </div>
        )}

        {/* TAB 4: PRACTICE QUIZ */}
        {activeTab === 'practice' && (
          <div className="space-y-6">
            <PracticeMode />
          </div>
        )}

        {/* TAB 5: STUDY & CURRICULUM GUIDE (Streamlined, Non-spammy) */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            <SEOContentHub />
          </div>
        )}
      </main>

      {/* Footer with REQUIREMENT 5: About / Privacy / Contact & Author laohu90 */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 print:hidden mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>Inverse Function Calculator</span>
            <span>•</span>
            <span>Author: <strong className="text-slate-800">laohu90</strong></span>
            <span>•</span>
            <a
              href="https://github.com/laohu90/inverse-function-calculator"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-0.5"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setAboutSubTab('about');
                setIsAboutOpen(true);
              }}
              className="hover:text-indigo-600 transition"
            >
              About
            </button>
            <button
              onClick={() => {
                setAboutSubTab('privacy');
                setIsAboutOpen(true);
              }}
              className="hover:text-indigo-600 transition"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => {
                setAboutSubTab('contact');
                setIsAboutOpen(true);
              }}
              className="hover:text-indigo-600 transition"
            >
              Contact
            </button>
            <button
              onClick={() => setIsRegressionOpen(true)}
              className="hover:text-indigo-600 transition font-medium"
            >
              Regression (10 Cases)
            </button>
            <button
              onClick={() => setIsExportOpen(true)}
              className="hover:text-indigo-600 transition"
            >
              Export
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        defaultTab={aboutSubTab}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        solution={currentSolution}
        currentFormula={typedFormula}
      />

      <RegressionModal
        isOpen={isRegressionOpen}
        onClose={() => setIsRegressionOpen(false)}
        onLoadFormula={(f) => handleParseFormula(f)}
      />

      <EmbedModal
        isOpen={isEmbedOpen}
        onClose={() => setIsEmbedOpen(false)}
        currentFormula={typedFormula}
      />
    </div>
  );
}
