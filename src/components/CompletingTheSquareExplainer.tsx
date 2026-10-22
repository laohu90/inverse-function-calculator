import React, { useState } from 'react';
import { CompletingTheSquareDetail } from '../types/math';
import { MathView } from './MathView';
import { CheckCircle2, AlertTriangle, ArrowRight, Lightbulb, Split, Layers } from 'lucide-react';

interface CompletingTheSquareExplainerProps {
  detail: CompletingTheSquareDetail;
}

export const CompletingTheSquareExplainer: React.FC<CompletingTheSquareExplainerProps> = ({
  detail,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedBranch, setSelectedBranch] = useState<'+' | '-'>(detail.chosenBranch);

  const bOver2a = detail.b / (2 * detail.a);
  const squarePiece = bOver2a * bOver2a;

  return (
    <div className="bg-white border border-indigo-100 rounded-2xl p-6 shadow-sm">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Deep-Dive Algebra Breakdown
            </span>
            <span className="text-xs text-slate-500 font-medium">Core Pain Point in High School Functions</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mt-1">
            Completing the Square: Step-by-Step Anatomy
          </h3>
          <p className="text-sm text-slate-600">
            Why do we complete the square? Because <span className="font-semibold text-slate-800">y</span> appears twice (as <code className="text-indigo-600 bg-indigo-50 px-1 rounded">y²</code> and <code className="text-indigo-600 bg-indigo-50 px-1 rounded">y</code>). 
            We must condense it into a single binomial <code className="text-indigo-600 bg-indigo-50 px-1 rounded">(y - h)²</code> before taking the square root!
          </p>
        </div>

        {/* Step Navigation Pill */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start md:self-center">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              onClick={() => setActiveStep(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeStep === s
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Step {s}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        {/* Left 7 Columns: Step Detail & Equation Breakdown */}
        <div className="lg:col-span-7 space-y-4">
          {activeStep === 1 && (
            <div className="space-y-3 bg-slate-50/70 p-5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm">
                <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs">1</span>
                <span>Isolate the Quadratic and Linear y-Terms</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                After swapping <MathView math="x" /> and <MathView math="y" />, our equation is:
              </p>
              <div className="bg-white p-3 rounded-lg border border-slate-200 text-center shadow-xs">
                <MathView math={`x = ${detail.a === 1 ? '' : detail.a}y^2 + ${detail.b}y + ${detail.c}`} block />
              </div>
              <p className="text-sm text-slate-700">
                Move constant <MathView math={`${detail.c}`} /> to the x-side by subtracting it from both sides:
              </p>
              <div className="bg-white p-3 rounded-lg border border-indigo-200 text-center font-semibold text-indigo-900 shadow-xs">
                <MathView math={detail.step1_isolate} block />
              </div>
              <div className="text-xs text-slate-500 bg-amber-50 border border-amber-200 p-2.5 rounded-lg flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Goal: Keep all terms with variable <strong>y</strong> together on one side so we can manipulate them.</span>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-3 bg-slate-50/70 p-5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm">
                <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs">2</span>
                <span>Find the "Magic Term" to Complete the Square</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                To turn the expression into a perfect square binomial <MathView math="(y + d)^2 = y^2 + 2dy + d^2" />,
                the linear coefficient equals <MathView math="2d" />.
              </p>
              <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-2 text-sm">
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-600">Coefficient of y:</span>
                  <MathView math={`B = ${Number((detail.b / detail.a).toFixed(3))}`} />
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-600">Half of coefficient:</span>
                  <MathView math={`d = \\frac{B}{2} = ${Number(bOver2a.toFixed(3))}`} />
                </div>
                <div className="flex justify-between items-center py-1 text-indigo-700 font-bold">
                  <span>Magic Term to Add to Both Sides (d²):</span>
                  <MathView math={`d^2 = \\left(${Number(bOver2a.toFixed(3))}\\right)^2 = ${Number(squarePiece.toFixed(3))}`} />
                </div>
              </div>
              <div className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 p-2.5 rounded-lg flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Notice that <MathView math={`d = ${Number(bOver2a.toFixed(3))}`} /> gives the exact horizontal shift of the vertex!</span>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-3 bg-slate-50/70 p-5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm">
                <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs">3</span>
                <span>Add the Magic Term to BOTH Sides of the Equation</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                By Golden Rule of Algebra, whatever you add to the right side must also be added to the left side:
              </p>
              <div className="bg-white p-3 rounded-lg border border-slate-200 text-center shadow-xs">
                <MathView
                  math={`\\frac{x ${detail.c >= 0 ? `- ${detail.c}` : `+ ${Math.abs(detail.c)}`}}{${detail.a}} + \\mathbf{${Number(squarePiece.toFixed(3))}} = y^2 + ${Number((detail.b / detail.a).toFixed(3))}y + \\mathbf{${Number(squarePiece.toFixed(3))}}`}
                  block
                />
              </div>
              <p className="text-sm text-slate-700">
                Notice the right side is now guaranteed to factor cleanly into a binomial squared!
              </p>
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex items-center gap-2 text-emerald-800 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Right side trinomial becomes: <MathView math={`\\left(y + ${Number(bOver2a.toFixed(3))}\\right)^2`} /></span>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className="space-y-3 bg-slate-50/70 p-5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm">
                <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs">4</span>
                <span>Factor the Trinomial into a Single Squared Binomial</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                We have achieved our main objective: <span className="font-semibold text-slate-900">y only appears once now!</span>
              </p>
              <div className="bg-white p-3 rounded-lg border border-indigo-200 text-center shadow-xs">
                <MathView math={detail.step4_factor_perfect_square} block />
              </div>
              <p className="text-sm text-slate-700">
                Now we can simply apply the square root property to both sides.
              </p>
            </div>
          )}

          {activeStep === 5 && (
            <div className="space-y-3 bg-slate-50/70 p-5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm">
                <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs">5</span>
                <span>Square Root & Branch Selection (Domain Restriction)</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                Taking the square root gives a <MathView math="\pm" /> sign:
              </p>
              <div className="bg-white p-3 rounded-lg border border-slate-200 text-center shadow-xs">
                <MathView math={`y + ${Number(bOver2a.toFixed(3))} = \\pm \\sqrt{\\frac{x - (${Number(detail.k.toFixed(3))})}{${detail.a}}}`} block />
              </div>
              
              {/* Branch Selector */}
              <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Crucial AP / High School Concept: Why does a parabola need a restricted domain?</span>
                </div>
                <p className="text-xs text-amber-800">
                  A full parabola fails the <strong>Horizontal Line Test</strong> (two inputs share the same output). To make it invertible (one-to-one), we choose either the right arm or the left arm from the vertex:
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setSelectedBranch('+')}
                    className={`p-2 rounded-lg border text-left text-xs transition ${
                      selectedBranch === '+'
                        ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 text-indigo-900 font-semibold'
                        : 'bg-white/60 border-slate-200 text-slate-700 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Right Arm (+) [Standard]</span>
                      {selectedBranch === '+' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Original Domain: <MathView math={`x \\ge ${Number(detail.h.toFixed(3))}`} />
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedBranch('-')}
                    className={`p-2 rounded-lg border text-left text-xs transition ${
                      selectedBranch === '-'
                        ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 text-indigo-900 font-semibold'
                        : 'bg-white/60 border-slate-200 text-slate-700 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Left Arm (-)</span>
                      {selectedBranch === '-' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Original Domain: <MathView math={`x \\le ${Number(detail.h.toFixed(3))}`} />
                    </div>
                  </button>
                </div>
              </div>

              {/* Final Inverse Expression */}
              <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-lg text-center">
                <span className="text-xs font-semibold text-indigo-800 uppercase tracking-wider block mb-1">
                  Final Inverse Function f⁻¹(x)
                </span>
                <MathView
                  math={`f^{-1}(x) = ${Number(detail.h.toFixed(3))} ${selectedBranch === '+' ? '+' : '-'} \\sqrt{\\frac{x - (${Number(detail.k.toFixed(3))})}{${detail.a}}}`}
                  block
                />
              </div>
            </div>
          )}

          {/* Step Progress Controller */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setActiveStep((s) => Math.max(s - 1, 1))}
              disabled={activeStep === 1}
              className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition"
            >
              Previous Step
            </button>
            <span className="text-xs text-slate-500 font-medium">
              Step {activeStep} of 5
            </span>
            <button
              onClick={() => setActiveStep((s) => Math.min(s + 1, 5))}
              disabled={activeStep === 5}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:pointer-events-none transition flex items-center gap-1"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right 5 Columns: Geometric Visual Area Model */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 to-indigo-50/30 p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Geometric "Area" Model
              </h4>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              "Completing the square" was originally invented by ancient geometers as literally adding the missing corner piece to a square of side <MathView math="y" />:
            </p>

            {/* SVG Visual Representation of the Square */}
            <div className="w-full flex justify-center py-2">
              <svg width="220" height="220" viewBox="0 0 220 220" className="drop-shadow-sm select-none">
                {/* Large y by y square */}
                <rect x="20" y="20" width="120" height="120" fill="#3b82f6" rx="4" opacity="0.85" />
                <text x="80" y="85" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">
                  y²
                </text>
                <text x="80" y="15" fill="#475569" fontSize="12" textAnchor="middle">y</text>
                <text x="10" y="85" fill="#475569" fontSize="12" textAnchor="middle">y</text>

                {/* Right rectangle: d by y */}
                <rect x="145" y="20" width="50" height="120" fill="#60a5fa" rx="4" opacity="0.75" />
                <text x="170" y="85" fill="#ffffff" fontSize="11" textAnchor="middle">
                  d · y
                </text>
                <text x="170" y="15" fill="#475569" fontSize="11" textAnchor="middle">d</text>

                {/* Bottom rectangle: y by d */}
                <rect x="20" y="145" width="120" height="50" fill="#60a5fa" rx="4" opacity="0.75" />
                <text x="80" y="175" fill="#ffffff" fontSize="11" textAnchor="middle">
                  d · y
                </text>
                <text x="10" y="175" fill="#475569" fontSize="11" textAnchor="middle">d</text>

                {/* Missing Corner: d by d square (highlighted) */}
                <rect
                  x="145"
                  y="145"
                  width="50"
                  height="50"
                  fill={activeStep >= 3 ? '#10b981' : '#f59e0b'}
                  stroke="#ffffff"
                  strokeWidth="2"
                  rx="4"
                  strokeDasharray={activeStep < 3 ? '4,4' : 'none'}
                />
                <text
                  x="170"
                  y="174"
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  d²
                </text>
              </svg>
            </div>

            <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-700">
                <span>Original area:</span>
                <span className="font-mono font-medium">y² + 2(dy)</span>
              </div>
              <div className="flex items-center justify-between text-emerald-700 font-semibold">
                <span>Missing corner added:</span>
                <span className="font-mono">+ d² ({Number(squarePiece.toFixed(3))})</span>
              </div>
              <div className="flex items-center justify-between text-indigo-700 font-bold pt-1 border-t border-slate-100">
                <span>Completed square:</span>
                <span className="font-mono">(y + d)²</span>
              </div>
            </div>
          </div>

          <div className="mt-4 text-[11px] text-slate-500 text-center">
            Vertex Coordinates: <span className="font-semibold text-slate-700">({detail.h.toFixed(2)}, {detail.k.toFixed(2)})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
