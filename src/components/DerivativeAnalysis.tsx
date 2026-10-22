import React from 'react';
import { MathView } from './MathView';
import { TrendingUp, AlertCircle, CheckCircle2, Split } from 'lucide-react';
import { InverseSolution } from '../types/math';

interface DerivativeAnalysisProps {
  solution: InverseSolution;
}

export const DerivativeAnalysis: React.FC<DerivativeAnalysisProps> = ({ solution }) => {
  // Analytical analysis for monotonicity
  const analysis = React.useMemo(() => {
    if (solution.functionType === 'quadratic') {
      const detail = solution.completingSquareDetail;
      if (!detail) return null;
      const vertexX = detail.h;
      return {
        title: 'Horizontal Line Test (HLT) & Invertibility Criterion',
        derivativeLatex: `f'(x) = ${detail.a === 1 ? '2' : detail.a === -1 ? '-2' : `${2 * detail.a}`}x ${detail.b !== 0 ? (detail.b > 0 ? `+ ${detail.b}` : `- ${Math.abs(detail.b)}`) : ''}`,
        criticalPoint: `x = -\\frac{b}{2a} = ${Number(vertexX.toFixed(3))}`,
        isOneToOneGlobally: false,
        explanation: `The derivative changes sign at vertex x = ${Number(vertexX.toFixed(3))}. Because the function switches from decreasing to increasing (or vice versa), horizontal lines intersect the parabola TWICE. Therefore, f(x) is NOT one-to-one on (-∞, ∞).`,
        restrictionAdvice: `To construct an invertible function, we must restrict the domain to either the right branch [${Number(vertexX.toFixed(3))}, ∞) where f is strictly monotonic, or the left branch (-∞, ${Number(vertexX.toFixed(3))}].`,
      };
    } else if (solution.functionType === 'linear') {
      return {
        title: 'Strict Monotonicity & Universal Invertibility',
        derivativeLatex: "f'(x) = m \\neq 0",
        criticalPoint: 'No critical points (slope is constant)',
        isOneToOneGlobally: true,
        explanation: 'The slope is constant and non-zero everywhere. The function is strictly monotonic across all real numbers and passes the Horizontal Line Test without any domain restrictions.',
        restrictionAdvice: 'No domain restrictions needed: Domain = (-∞, ∞).',
      };
    } else if (solution.functionType === 'rational') {
      return {
        title: 'Rational Monotonicity & Asymptotic Invertibility',
        derivativeLatex: "f'(x) = \\frac{ad - bc}{(cx + d)^2}",
        criticalPoint: 'Undefined at vertical asymptote',
        isOneToOneGlobally: true,
        explanation: 'Because the denominator squared is always positive, the sign of the derivative never flips! Thus f(x) is strictly monotonic on each continuous interval of its domain.',
        restrictionAdvice: 'The only restriction is the vertical asymptote where denominator is 0.',
      };
    } else if (solution.functionType === 'radical') {
      return {
        title: 'Square Root Monotonicity',
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
        <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          <span>{analysis.title}</span>
        </div>
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
            analysis.isOneToOneGlobally
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          {analysis.isOneToOneGlobally ? 'Strictly One-to-One' : 'Requires Domain Cut'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
          <span className="text-slate-500 font-medium block">First Derivative f'(x):</span>
          <div className="font-bold text-slate-900 text-sm">
            <MathView math={analysis.derivativeLatex} />
          </div>
          <span className="text-slate-500 font-medium block pt-1">Critical Point / Vertex:</span>
          <div className="font-bold text-indigo-700">
            <MathView math={analysis.criticalPoint} />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-slate-600 leading-relaxed">
            {analysis.explanation}
          </p>
          <div className="p-2.5 bg-indigo-50/70 border border-indigo-200 rounded-lg text-indigo-900 font-medium flex items-start gap-2">
            <Split className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
            <span>{analysis.restrictionAdvice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
