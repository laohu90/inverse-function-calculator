import React, { useState } from 'react';
import { MathView } from './MathView';
import { Calculator, CheckCircle2, AlertTriangle } from 'lucide-react';
import { InverseSolution } from '../types/math';
import { TranslationDictionary } from '../i18n/translations';

interface ValueEvaluatorProps {
  solution: InverseSolution;
  t: TranslationDictionary['evaluator'];
}

export const ValueEvaluator: React.FC<ValueEvaluatorProps> = ({ solution, t }) => {
  const [evalX, setEvalX] = useState<number>(5);

  const result = React.useMemo(() => {
    const val = solution.evaluateInverse(evalX);
    return val;
  }, [solution, evalX]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>{t.title}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t.subtitle}
          </p>
        </div>
        <span className="text-xs sm:text-sm text-slate-500 font-mono">
          {t.inputDomain} <MathView math={solution.domainInverse} />
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap">{t.evaluateFor}</span>
          <input
            type="number"
            step="0.5"
            value={evalX}
            onChange={(e) => setEvalX(parseFloat(e.target.value) || 0)}
            className="w-24 px-3 py-1.5 border border-slate-300 rounded-xl text-sm sm:text-base font-bold font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Quick evaluation shortcuts */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs sm:text-sm">
          <span className="text-slate-400 text-xs">{t.quickTry}</span>
          {[-1, 0, 1, 2, 5, 10].map((v) => (
            <button
              key={v}
              onClick={() => setEvalX(v)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-mono transition text-xs font-semibold"
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Result Box */}
      {result !== null && isFinite(result) ? (
        <div className="p-4 sm:p-5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1.5">
            <span className="text-xs sm:text-sm font-bold text-emerald-800 uppercase tracking-wider block">
              {t.calculatedValue}
            </span>
            <div className="text-lg sm:text-xl font-bold text-emerald-900 font-mono">
              <MathView math={`f^{-1}(${evalX}) = ${Number(result.toFixed(4))}`} />
            </div>
            <div className="text-xs sm:text-sm text-emerald-700 font-mono">
              <MathView math={solution.inverseEquation.replace('f^{-1}(x) = ', '').replace(/x/g, `${evalX}`)} />
            </div>
          </div>
          <div className="text-xs sm:text-sm text-emerald-800 bg-white/90 p-3 rounded-lg border border-emerald-200 self-start sm:self-center font-medium shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 inline mr-1.5" />
            Check: <MathView math={`f(${Number(result.toFixed(2))}) \\approx ${evalX}`} />
          </div>
        </div>
      ) : (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">{t.outsideDomain}</strong>
            <span className="text-xs sm:text-sm">
              {t.outsideDomainDesc} (<MathView math={solution.domainInverse} />).
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
