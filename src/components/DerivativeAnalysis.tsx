import React from 'react';
import { MathView } from './MathView';
import { TrendingUp, Split } from 'lucide-react';
import { InverseSolution } from '../types/math';
import { TranslationDictionary } from '../i18n/translations';

interface DerivativeAnalysisProps {
  solution: InverseSolution;
  t: TranslationDictionary['calculus'];
}

export const DerivativeAnalysis: React.FC<DerivativeAnalysisProps> = ({ solution, t }) => {
  // Analytical analysis for monotonicity
  const analysis = React.useMemo(() => {
    if (solution.functionType === 'quadratic') {
      const detail = solution.completingSquareDetail;
      if (!detail) return null;
      const vertexX = detail.h;
      return {
        derivativeLatex: `f'(x) = ${detail.a === 1 ? '2' : detail.a === -1 ? '-2' : `${2 * detail.a}`}x ${detail.b !== 0 ? (detail.b > 0 ? `+ ${detail.b}` : `- ${Math.abs(detail.b)}`) : ''}`,
        criticalPoint: `x = -\\frac{b}{2a} = ${Number(vertexX.toFixed(3))}`,
        isOneToOneGlobally: false,
        explanation: `The derivative changes sign at vertex x = ${Number(vertexX.toFixed(3))}. Because the function switches from decreasing to increasing (or vice versa), horizontal lines intersect the parabola TWICE. Therefore, f(x) is NOT one-to-one on (-∞, ∞).`,
        restrictionAdvice: `Domain restriction: right branch [${Number(vertexX.toFixed(3))}, ∞) or left branch (-∞, ${Number(vertexX.toFixed(3))}].`,
      };
    } else if (solution.functionType === 'linear') {
      return {
        derivativeLatex: "f'(x) = m \\neq 0",
        criticalPoint: 'No critical points (slope is constant)',
        isOneToOneGlobally: true,
        explanation: 'The slope is constant and non-zero everywhere. The function is strictly monotonic across all real numbers and passes the Horizontal Line Test without any domain restrictions.',
        restrictionAdvice: 'No domain restrictions needed: Domain = (-∞, ∞).',
      };
    } else if (solution.functionType === 'rational') {
      return {
        derivativeLatex: "f'(x) = \\frac{ad - bc}{(cx + d)^2}",
        criticalPoint: 'Undefined at vertical asymptote',
        isOneToOneGlobally: true,
        explanation: 'Because the denominator squared is always positive, the sign of the derivative never flips! Thus f(x) is strictly monotonic on each continuous interval of its domain.',
        restrictionAdvice: 'The only restriction is the vertical asymptote where denominator is 0.',
      };
    } else if (solution.functionType === 'radical') {
      return {
        derivativeLatex: "f'(x) = \\frac{ab}{2\\sqrt{bx + c}}",
        criticalPoint: 'Endpoint of the domain',
        isOneToOneGlobally: true,
        explanation: 'The radical branch is strictly increasing or strictly decreasing across its entire natural domain [min x, ∞). It passes the Horizontal Line Test.',
        restrictionAdvice: 'Domain is naturally restricted by the radicand ≥ 0.',
      };
    }
    return null;
  }, [solution]);

  if (!analysis) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm sm:text-base">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          <span>{t.hltTitle}</span>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded ${
            analysis.isOneToOneGlobally
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          {analysis.isOneToOneGlobally ? t.oneToOne : t.requiresDomainCut}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
          <span className="text-slate-500 font-medium block">{t.derivativeLabel}</span>
          <div className="font-bold text-slate-900 text-sm sm:text-base">
            <MathView math={analysis.derivativeLatex} />
          </div>
          <span className="text-slate-500 font-medium block pt-1">{t.criticalPointLabel}</span>
          <div className="font-bold text-indigo-700">
            <MathView math={analysis.criticalPoint} />
          </div>
        </div>

        <div className="space-y-2.5">
          <p className="text-slate-600 leading-relaxed">
            {analysis.explanation}
          </p>
          <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-indigo-900 font-medium flex items-start gap-2">
            <Split className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <span>{analysis.restrictionAdvice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
