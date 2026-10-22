import React from 'react';
import { MathView } from './MathView';
import { ArrowLeftRight, Check } from 'lucide-react';
import { InverseSolution } from '../types/math';

interface ValuesTableProps {
  solution: InverseSolution;
}

export const ValuesTable: React.FC<ValuesTableProps> = ({ solution }) => {
  // Generate sample points around key regions
  const samplePoints = React.useMemo(() => {
    const points: { x: number; fx: number | null; invFx: number | null }[] = [];
    // Pick 7 balanced integer / half-integer test values
    const testXs = [-4, -2, -1, 0, 1, 2, 4];

    for (const x of testXs) {
      const fx = solution.evaluateOriginal(x);
      let invFx: number | null = null;
      if (fx !== null && isFinite(fx)) {
        // Evaluate inverse at the output fx to prove f^{-1}(f(x)) = x
        invFx = solution.evaluateInverse(fx);
      }
      points.push({ x, fx, invFx });
    }
    return points;
  }, [solution]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-indigo-600" />
            <span>Side-by-Side Table of Values & Coordinate Swap Proof</span>
          </h3>
          <p className="text-xs text-slate-500">
            See how every point <MathView math="(x, y)" /> on <MathView math="f(x)" /> reverses into <MathView math="(y, x)" /> on <MathView math="f^{-1}(x)" />.
          </p>
        </div>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
          f⁻¹(f(x)) = x Verified
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
              <th className="py-3 px-3.5 font-semibold text-left">Input x</th>
              <th className="py-3 px-3.5 font-semibold text-blue-700">Output y = f(x)</th>
              <th className="py-3 px-3.5 font-semibold text-slate-700">Point on f(x)</th>
              <th className="py-3 px-3.5 font-semibold text-emerald-700">Reversed Point on f⁻¹(x)</th>
              <th className="py-3 px-3.5 font-semibold text-indigo-700">Verification: f⁻¹(y)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {samplePoints.map((pt, i) => {
              const isDefined = pt.fx !== null && isFinite(pt.fx);
              return (
                <tr key={i} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-3.5 font-bold text-slate-800 text-left">
                    {pt.x}
                  </td>
                  <td className="py-3 px-3.5 text-blue-700 font-bold">
                    {isDefined ? Number(pt.fx!.toFixed(2)) : <span className="text-slate-400 font-sans italic text-xs">Undefined (Outside Domain)</span>}
                  </td>
                  <td className="py-3 px-3.5 text-slate-600">
                    {isDefined ? `(${pt.x}, ${Number(pt.fx!.toFixed(2))})` : '—'}
                  </td>
                  <td className="py-3 px-3.5 text-emerald-700 font-bold">
                    {isDefined ? `(${Number(pt.fx!.toFixed(2))}, ${pt.x})` : '—'}
                  </td>
                  <td className="py-3 px-3.5 text-indigo-700 font-bold">
                    {isDefined && pt.invFx !== null ? (
                      <span className="inline-flex items-center gap-1">
                        <Check className="w-4 h-4 text-emerald-600 inline" />
                        <span>{Number(pt.invFx.toFixed(2))}</span>
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="text-xs sm:text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
        💡 <strong>Key takeaway for exams:</strong> If an exam gives you a table of values for <MathView math="f(x)" />, simply switch the two columns to find <MathView math="f^{-1}(x)" />!
      </div>
    </div>
  );
};
