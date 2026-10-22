import React, { useState } from 'react';
import { MathView } from './MathView';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Bookmark, Lightbulb, GraduationCap, Table } from 'lucide-react';

export const SEOContentHub: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How do you find the inverse of a quadratic function using completing the square?',
      a: (
        <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
          <p>
            Because a quadratic function <MathView math="f(x) = ax^2 + bx + c" /> contains both <MathView math="x^2" /> and <MathView math="x" />, you cannot isolate the variable by standard linear algebra alone after swapping.
          </p>
          <ol className="list-decimal pl-4 space-y-1">
            <li><strong>Restrict the Domain:</strong> Restrict to <MathView math="x \ge -\frac{b}{2a}" /> (or <MathView math="x \le -\frac{b}{2a}" />) so the parabola passes the Horizontal Line Test and becomes one-to-one.</li>
            <li><strong>Swap x and y:</strong> <MathView math="x = ay^2 + by + c" />.</li>
            <li><strong>Isolate y-terms:</strong> Subtract <MathView math="c" /> and divide by <MathView math="a" /> to get <MathView math="\frac{x - c}{a} = y^2 + \frac{b}{a}y" />.</li>
            <li><strong>Complete the Square:</strong> Add <MathView math="\left(\frac{b}{2a}\right)^2" /> to BOTH sides to produce a perfect square trinomial.</li>
            <li><strong>Factor and Solve:</strong> Write the right side as <MathView math="\left(y + \frac{b}{2a}\right)^2" />, take the square root, and solve for <MathView math="y" />.</li>
          </ol>
        </div>
      ),
    },
    {
      q: 'Why is f⁻¹(x) NOT equal to 1/f(x)?',
      a: (
        <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
          <p>
            This is one of the most common pitfalls in High School Algebra 2 and Precalculus exams.
          </p>
          <p>
            In function notation, the superscript <MathView math="-1" /> denotes an <strong>inverse operator</strong>, not an arithmetic power. For example, if <MathView math="f(x) = 2x" />, the inverse is <MathView math="f^{-1}(x) = \frac{x}{2}" />, whereas the reciprocal is <MathView math="\frac{1}{f(x)} = \frac{1}{2x}" />.
          </p>
          <p className="font-semibold text-rose-700">
            Remember: <MathView math="f^{-1}(x)" /> undoes the function; <MathView math="[f(x)]^{-1} = \frac{1}{f(x)}" /> inverts the value numerically.
          </p>
        </div>
      ),
    },
    {
      q: 'What is the relationship between the domain and range of a function and its inverse?',
      a: (
        <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
          <p>
            Since the inverse operation swaps all input <MathView math="x" /> coordinates with output <MathView math="y" /> coordinates:
          </p>
          <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-900 font-medium">
            <MathView math="\operatorname{Domain}(f^{-1}) = \operatorname{Range}(f)" block />
            <MathView math="\operatorname{Range}(f^{-1}) = \operatorname{Domain}(f)" block />
          </div>
          <p>
            Whenever an inverse has a restricted domain (such as a square root), you determine that domain by calculating the range of the original function!
          </p>
        </div>
      ),
    },
    {
      q: 'What is the shortcut formula for the inverse of a rational fraction?',
      a: (
        <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
          <p>
            For any linear rational function of the form <MathView math="f(x) = \frac{ax + b}{cx + d}" />:
          </p>
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-center font-bold">
            <MathView math="f^{-1}(x) = \frac{-dx + b}{cx - a}" block />
          </div>
          <p>
            Notice that the diagonal entries <MathView math="a" /> and <MathView math="d" /> swap positions and switch signs, while <MathView math="b" /> and <MathView math="c" /> remain unchanged. This rule is verified by cross-multiplying and factoring <MathView math="y" />.
          </p>
        </div>
      ),
    },
    {
      q: 'Why do we reflect across the line y = x?',
      a: (
        <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
          <p>
            When you interchange the coordinates <MathView math="(a, b) \to (b, a)" />, the segment connecting <MathView math="(a, b)" /> and <MathView math="(b, a)" /> has slope <MathView math="\frac{a - b}{b - a} = -1" />.
          </p>
          <p>
            The mirror line <MathView math="y = x" /> has slope <MathView math="+1" />. Because their product is <MathView math="(-1) \times (1) = -1" />, the segment is perpendicular to <MathView math="y = x" />. Furthermore, their midpoint is <MathView math="\left(\frac{a+b}{2}, \frac{a+b}{2}\right)" />, which lies exactly on <MathView math="y = x" />.
          </p>
        </div>
      ),
    },
  ];

  return (
    <section className="mt-12 pt-8 border-t border-slate-200 space-y-10 text-slate-800">
      {/* Article Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
          Curriculum Reference & Study Guide
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          How to Find the Inverse of a Function: The Complete Guide
        </h2>
        <p className="text-sm text-slate-600">
          Grounded in the United States High School Algebra 2, Precalculus, and AP Precalculus standards.
        </p>
      </div>

      {/* Guide Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Method 1: The 4-Step Standard Method */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <h3>The 4-Step Master Method (Universal Recipe)</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every inverse problem follows this exact four-step recipe, regardless of whether the function is linear, rational, exponential, or quadratic:
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-indigo-800">Step 1: Replace f(x) with y</strong>
              <p className="text-slate-600 mt-0.5">Write the equation in standard Cartesian coordinate notation.</p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-indigo-800">Step 2: Swap x and y</strong>
              <p className="text-slate-600 mt-0.5">Every x becomes y, and every y becomes x. This reflects the graph across y = x.</p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-indigo-800">Step 3: Solve for y</strong>
              <p className="text-slate-600 mt-0.5">Isolate variable y using algebra, clearing denominators, or completing the square.</p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-indigo-800">Step 4: Formal Inverse Notation & Domain</strong>
              <p className="text-slate-600 mt-0.5">Replace y with f⁻¹(x) and state the legal domain derived from the original function's range.</p>
            </div>
          </div>
        </div>

        {/* Method 2: Completing the Square Deep Dive */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
            <Bookmark className="w-5 h-5 text-indigo-600" />
            <h3>Completing the Square: Why & How</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Why is completing the square necessary for quadratics like <MathView math="f(x) = x^2 + 4x + 1" />?
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 space-y-1">
            <strong className="flex items-center gap-1 font-bold">
              <Lightbulb className="w-4 h-4 text-amber-600" /> The Core Algebraic Barrier:
            </strong>
            <p>
              After swapping to <MathView math="x = y^2 + 4y + 1" />, variable <MathView math="y" /> appears twice with different exponents. You cannot isolate <MathView math="y" /> until you combine both terms into a single binomial <MathView math="(y + 2)^2" />!
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-600">The Magic Term:</span>
              <MathView math="\left(\frac{b}{2a}\right)^2" />
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Vertex Coordinates:</span>
              <MathView math="(h, k) = \left(-\frac{b}{2a}, c - \frac{b^2}{4a}\right)" />
            </div>
            <div className="flex justify-between text-indigo-700 font-bold">
              <span>Vertex Form Inversion:</span>
              <MathView math="f^{-1}(x) = h \pm \sqrt{\frac{x - k}{a}}" />
            </div>
          </div>
        </div>
      </div>

      {/* Domain & Range Matrix Summary Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
          <Table className="w-5 h-5 text-indigo-600" />
          <h3>Inverse Function Families: Formulas & Domain Restrictions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-semibold">
                <th className="py-2.5 px-3">Function Family</th>
                <th className="py-2.5 px-3">Standard Form f(x)</th>
                <th className="py-2.5 px-3">Inverse Formula f⁻¹(x)</th>
                <th className="py-2.5 px-3">Original Domain / Restricted</th>
                <th className="py-2.5 px-3">Key Technique</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="hover:bg-slate-50/50">
                <td className="py-2.5 px-3 font-semibold text-indigo-900">Linear</td>
                <td className="py-2.5 px-3"><MathView math="mx + b" /></td>
                <td className="py-2.5 px-3"><MathView math="\frac{x - b}{m}" /></td>
                <td className="py-2.5 px-3"><MathView math="(-\infty, \infty)" /></td>
                <td className="py-2.5 px-3">Subtract b, divide by m</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-2.5 px-3 font-semibold text-indigo-900">Quadratic</td>
                <td className="py-2.5 px-3"><MathView math="ax^2 + bx + c" /></td>
                <td className="py-2.5 px-3"><MathView math="h + \sqrt{\frac{x - k}{a}}" /></td>
                <td className="py-2.5 px-3"><MathView math="[h, \infty) \text{ or } (-\infty, h]" /></td>
                <td className="py-2.5 px-3 font-medium text-indigo-700">Completing the square</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-2.5 px-3 font-semibold text-indigo-900">Rational</td>
                <td className="py-2.5 px-3"><MathView math="\frac{ax + b}{cx + d}" /></td>
                <td className="py-2.5 px-3"><MathView math="\frac{-dx + b}{cx - a}" /></td>
                <td className="py-2.5 px-3"><MathView math="x \neq -\frac{d}{c}" /></td>
                <td className="py-2.5 px-3">Cross-multiply, factor y</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-2.5 px-3 font-semibold text-indigo-900">Square Root</td>
                <td className="py-2.5 px-3"><MathView math="\sqrt{bx + c} + d" /></td>
                <td className="py-2.5 px-3"><MathView math="\frac{(x - d)^2 - c}{b}" /></td>
                <td className="py-2.5 px-3"><MathView math="x \ge -\frac{c}{b}" /></td>
                <td className="py-2.5 px-3">Isolate radical, square</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-2.5 px-3 font-semibold text-indigo-900">Exponential</td>
                <td className="py-2.5 px-3"><MathView math="e^x + d" /></td>
                <td className="py-2.5 px-3"><MathView math="\ln(x - d)" /></td>
                <td className="py-2.5 px-3"><MathView math="(-\infty, \infty)" /></td>
                <td className="py-2.5 px-3">Take natural logarithm</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Top 5 Common Student Mistakes on Tests */}
      <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-rose-900 font-bold text-base">
          <AlertCircle className="w-5 h-5 text-rose-600" />
          <h3>Top 5 Pitfalls to Avoid on US High School & AP Exams</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3 rounded-xl border border-rose-200 space-y-1">
            <span className="font-bold text-rose-700">1. Confusing Inverse with Reciprocal</span>
            <p className="text-slate-600">
              Never write <MathView math="f^{-1}(x) = \frac{1}{f(x)}" />! That loses all points immediately.
            </p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-rose-200 space-y-1">
            <span className="font-bold text-rose-700">2. Omitting the Domain Restriction</span>
            <p className="text-slate-600">
              For quadratics and radicals, teachers require explicit domain bounds (e.g., <MathView math="x \ge k" />).
            </p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-rose-200 space-y-1">
            <span className="font-bold text-rose-700">3. Forgetting to Add to BOTH Sides</span>
            <p className="text-slate-600">
              When completing the square, remember to balance the equation by adding <MathView math="(b/2a)^2" /> to the left side too.
            </p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-rose-200 space-y-1">
            <span className="font-bold text-rose-700">4. Mismanaging Signs in Rational Fractions</span>
            <p className="text-slate-600">
              When collecting <MathView math="y" /> terms <MathView math="cxy - ay = -dx + b" />, be meticulous with negative signs.
            </p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-rose-200 space-y-1">
            <span className="font-bold text-rose-700">5. Neglecting Composition Verification</span>
            <p className="text-slate-600">
              AP test questions often award 2 points for verifying <MathView math="f(f^{-1}(x)) = x" />. Always show both checks.
            </p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-rose-200 space-y-1">
            <span className="font-bold text-rose-700">6. Horizontal Line Test Ignored</span>
            <p className="text-slate-600">
              If a function is not one-to-one across its entire domain, specify which branch is being inverted.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          Frequently Asked Questions (FAQ)
        </h3>
        <div className="divide-y divide-slate-100">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-3">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-sm font-semibold text-slate-800 hover:text-indigo-600 transition"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && <div className="mt-3 pl-1">{faq.a}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
