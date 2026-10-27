import React, { useState } from 'react';
import { MathView } from './MathView';
import { ChevronDown, ChevronUp, AlertCircle, Bookmark, GraduationCap, Table } from 'lucide-react';

export const SEOContentHub: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How does the Horizontal Line Test determine if an inverse function exists?',
      a: (
        <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
          <p>
            A function <MathView math="f(x)" /> possesses a true inverse function <MathView math="f^{-1}(x)" /> if and only if it is <strong>strictly one-to-one (injective)</strong>.
          </p>
          <p>
            Geometrically, this is verified by the <strong>Horizontal Line Test</strong>: if any horizontal line <MathView math="y = c" /> intersects the graph at more than one point, different inputs yield the same output (e.g. for <MathView math="f(x) = x^2" />, <MathView math="f(2) = f(-2) = 4" />). Reversing this would map the single input 4 to two different outputs (±2), violating the fundamental definition of a function.
          </p>
          <p className="font-semibold text-indigo-700">
            For functions that fail the global test (such as quadratics and even polynomials), we restrict the domain to a monotonic interval (e.g. <MathView math="x \ge h" />) before inverting.
          </p>
        </div>
      ),
    },
    {
      q: 'Why is f⁻¹(x) NOT equal to 1 / f(x)?',
      a: (
        <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
          <p>
            In mathematical notation, the superscript <MathView math="-1" /> denotes an <strong>inverse mapping operator</strong>, not an arithmetic power or exponent.
          </p>
          <p>
            For example, if <MathView math="f(x) = 2x" />, the inverse function is <MathView math="f^{-1}(x) = \frac{x}{2}" /> (the operation that undoes multiplying by 2). In contrast, the reciprocal is <MathView math="\frac{1}{f(x)} = [f(x)]^{-1} = \frac{1}{2x}" />.
          </p>
        </div>
      ),
    },
    {
      q: 'How do you determine the domain and range of the inverse function?',
      a: (
        <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
          <p>
            Because finding an inverse swaps every input <MathView math="x" /> coordinate with output <MathView math="y" />:
          </p>
          <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-900 font-medium text-center space-y-1">
            <div><MathView math="\operatorname{Domain}(f^{-1}) = \operatorname{Range}(f)" /></div>
            <div><MathView math="\operatorname{Range}(f^{-1}) = \operatorname{Domain}(f)" /></div>
          </div>
          <p>
            Whenever taking square roots or even roots during algebraic inversion, the legal domain of <MathView math="f^{-1}(x)" /> must explicitly match the output range of the original restricted branch.
          </p>
        </div>
      ),
    },
    {
      q: 'What is the matrix swap shortcut for rational functions?',
      a: (
        <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
          <p>
            For any linear fractional rational function <MathView math="f(x) = \frac{ax + b}{cx + d}" />:
          </p>
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-center font-bold">
            <MathView math="f^{-1}(x) = \frac{-dx + b}{cx - a}" />
          </div>
          <p>
            The main diagonal coefficients <MathView math="a" /> and <MathView math="d" /> swap positions and negate signs, while <MathView math="b" /> and <MathView math="c" /> remain unchanged.
          </p>
        </div>
      ),
    },
  ];

  return (
    <section className="mt-8 pt-8 border-t border-slate-200 space-y-8 text-slate-800">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-1.5">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
          Algebra Study Reference
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Inverse Functions: Core Methods & Invertibility Rules
        </h2>
        <p className="text-xs text-slate-500">
          A concise pedagogical reference for high school Algebra 2, Precalculus, and Calculus students.
        </p>
      </div>

      {/* Guide Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        {/* Universal 4-Step Method */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <h3>The 4-Step Master Method</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-indigo-900">Step 1: Replace f(x) with y</strong>
              <p className="text-slate-600 mt-0.5">Write the equation in coordinate form and verify one-to-one monotonicity.</p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-indigo-900">Step 2: Swap x and y</strong>
              <p className="text-slate-600 mt-0.5">Reflect all coordinates across the line y = x.</p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-indigo-900">Step 3: Solve for y</strong>
              <p className="text-slate-600 mt-0.5">Isolate y using algebraic operations, factoring, or completing the square.</p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-indigo-900">Step 4: State Domain & f⁻¹(x)</strong>
              <p className="text-slate-600 mt-0.5">Replace y with f⁻¹(x) and state the legal domain derived from Range(f).</p>
            </div>
          </div>
        </div>

        {/* Invertibility & Horizontal Line Test */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
            <Bookmark className="w-5 h-5 text-indigo-600" />
            <h3>Horizontal Line Test & Domain Restricting</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Not all functions have inverses across their entire natural domain. A function must be one-to-one to be invertible:
          </p>
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
            <strong className="block font-bold">Why Quadratics Require a Domain Restriction:</strong>
            <p>
              Parabolas are symmetric. To invert <MathView math="f(x) = x^2 + 4x + 1" />, we restrict to the right branch <MathView math="x \ge -2" /> or left branch <MathView math="x \le -2" /> so each horizontal line intersects only once.
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-600">Linear (m ≠ 0):</span>
              <span className="font-semibold text-emerald-700">Strictly 1-to-1 on (-∞, ∞)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Odd Powers (x³):</span>
              <span className="font-semibold text-emerald-700">Strictly 1-to-1 on (-∞, ∞)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Even Powers (x², x⁴):</span>
              <span className="font-semibold text-amber-700">Requires x ≥ h or x ≤ h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Domain & Range Summary Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
          <Table className="w-5 h-5 text-indigo-600" />
          <h3>Function Families & Standard Inverses</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                <th className="py-2 px-3">Family</th>
                <th className="py-2 px-3">Original f(x)</th>
                <th className="py-2 px-3">Inverse f⁻¹(x)</th>
                <th className="py-2 px-3">Domain Restriction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-2 px-3 font-semibold text-indigo-900">Linear</td>
                <td className="py-2 px-3"><MathView math="mx + b" /></td>
                <td className="py-2 px-3"><MathView math="\frac{x - b}{m}" /></td>
                <td className="py-2 px-3"><MathView math="(-\infty, \infty)" /></td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-indigo-900">Quadratic</td>
                <td className="py-2 px-3"><MathView math="a(x-h)^2 + k" /></td>
                <td className="py-2 px-3"><MathView math="h \pm \sqrt{\frac{x - k}{a}}" /></td>
                <td className="py-2 px-3 font-medium text-amber-700"><MathView math="x \ge k \text{ (or } \le k)" /></td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-indigo-900">Cubic</td>
                <td className="py-2 px-3"><MathView math="a(x-h)^3 + k" /></td>
                <td className="py-2 px-3"><MathView math="h + \sqrt[3]{\frac{x - k}{a}}" /></td>
                <td className="py-2 px-3"><MathView math="(-\infty, \infty)" /></td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-indigo-900">Rational</td>
                <td className="py-2 px-3"><MathView math="\frac{ax + b}{cx + d}" /></td>
                <td className="py-2 px-3"><MathView math="\frac{-dx + b}{cx - a}" /></td>
                <td className="py-2 px-3"><MathView math="x \neq \frac{a}{c}" /></td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-indigo-900">Radical</td>
                <td className="py-2 px-3"><MathView math="\sqrt{x - h} + k" /></td>
                <td className="py-2 px-3"><MathView math="(x - k)^2 + h" /></td>
                <td className="py-2 px-3 font-medium text-amber-700"><MathView math="x \ge k" /></td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-indigo-900">Exponential</td>
                <td className="py-2 px-3"><MathView math="b^x" /></td>
                <td className="py-2 px-3"><MathView math="\log_b(x)" /></td>
                <td className="py-2 px-3 font-medium text-amber-700"><MathView math="x > 0" /></td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-indigo-900">Logarithmic</td>
                <td className="py-2 px-3"><MathView math="\ln(x)" /></td>
                <td className="py-2 px-3"><MathView math="e^x" /></td>
                <td className="py-2 px-3"><MathView math="(-\infty, \infty)" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <h3 className="text-base font-bold text-slate-900">
          Frequently Asked Questions
        </h3>
        <div className="divide-y divide-slate-100">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-2.5">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-slate-800 hover:text-indigo-600 transition"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && <div className="mt-2.5 pl-1">{faq.a}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
