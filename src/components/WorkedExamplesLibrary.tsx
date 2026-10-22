import React from 'react';
import { MathView } from './MathView';
import { BookMarked, ArrowUpRight, Sparkles, Filter } from 'lucide-react';

export interface WorkedExampleItem {
  id: string;
  category: 'Quadratic' | 'Rational' | 'Linear' | 'Radical' | 'Exponential';
  difficulty: 'Basic' | 'Intermediate' | 'Advanced' | 'AP Precalc';
  equation: string;
  latexPreview: string;
  domainNote: string;
  whySpecial: string;
  onSelect: () => void;
}

interface WorkedExamplesLibraryProps {
  onLoadExample: (example: WorkedExampleItem) => void;
}

export const WORKED_EXAMPLES: Omit<WorkedExampleItem, 'onSelect'>[] = [
  {
    id: 'quad-1',
    category: 'Quadratic',
    difficulty: 'Basic',
    equation: 'x^2 + 4x + 1',
    latexPreview: 'f(x) = x^2 + 4x + 1, \\quad x \\ge -2',
    domainNote: 'Standard form completing the square with a = 1.',
    whySpecial: 'Classic textbook question. Magic term added is (4/2)² = 4.',
  },
  {
    id: 'quad-2',
    category: 'Quadratic',
    difficulty: 'Advanced',
    equation: '2x^2 - 12x + 11',
    latexPreview: 'f(x) = 2x^2 - 12x + 11, \\quad x \\ge 3',
    domainNote: 'Completing the square when leading coefficient a ≠ 1.',
    whySpecial: 'Common AP exam trap: Must divide or factor out 2 before completing the square!',
  },
  {
    id: 'quad-3',
    category: 'Quadratic',
    difficulty: 'Intermediate',
    equation: 'x^2 - 6x + 8',
    latexPreview: 'f(x) = x^2 - 6x + 8, \\quad x \\ge 3',
    domainNote: 'Negative linear coefficient with integer roots.',
    whySpecial: 'Shows how vertex at (3, -1) determines the inverse domain x ≥ -1.',
  },
  {
    id: 'rat-1',
    category: 'Rational',
    difficulty: 'Basic',
    equation: '(2x + 3) / (x - 5)',
    latexPreview: 'f(x) = \\frac{2x + 3}{x - 5}, \\quad x \\neq 5',
    domainNote: 'Standard linear rational fraction.',
    whySpecial: 'Cross multiply, collect y terms: xy - 5x = 2y + 3, factor y(x - 2).',
  },
  {
    id: 'rat-2',
    category: 'Rational',
    difficulty: 'Intermediate',
    equation: '(4x + 1) / (3x + 2)',
    latexPreview: 'f(x) = \\frac{4x + 1}{3x + 2}, \\quad x \\neq -\\frac{2}{3}',
    domainNote: 'Rational with non-unitary leading coefficients.',
    whySpecial: 'Illustrates the diagonal swap shortcut: f⁻¹(x) = (-2x + 1)/(3x - 4).',
  },
  {
    id: 'lin-1',
    category: 'Linear',
    difficulty: 'Basic',
    equation: '3x - 7',
    latexPreview: 'f(x) = 3x - 7',
    domainNote: 'Linear equation with positive slope.',
    whySpecial: 'Demonstrates reciprocal slope rule: m = 3 → m⁻¹ = 1/3.',
  },
  {
    id: 'lin-2',
    category: 'Linear',
    difficulty: 'Intermediate',
    equation: '-5x + 10',
    latexPreview: 'f(x) = -5x + 10',
    domainNote: 'Negative slope linear function.',
    whySpecial: 'Careful with negative sign division: y = (x - 10) / (-5) = -x/5 + 2.',
  },
  {
    id: 'rad-1',
    category: 'Radical',
    difficulty: 'Intermediate',
    equation: 'sqrt(2x - 5) + 3',
    latexPreview: 'f(x) = \\sqrt{2x - 5} + 3, \\quad x \\ge 2.5',
    domainNote: 'Square root with horizontal & vertical shifts.',
    whySpecial: 'The range [3, ∞) restricts the inverse domain to x ≥ 3!',
  },
  {
    id: 'exp-1',
    category: 'Exponential',
    difficulty: 'Intermediate',
    equation: 'e^x - 2',
    latexPreview: 'f(x) = e^x - 2, \\quad x \\in \\mathbb{R}',
    domainNote: 'Natural exponential function shifted down.',
    whySpecial: 'Requires natural log: ln(x + 2) with vertical asymptote at x = -2.',
  },
];

export const WorkedExamplesLibrary: React.FC<WorkedExamplesLibraryProps> = ({ onLoadExample }) => {
  const [filterCat, setFilterCat] = React.useState<string>('All');

  const filtered = React.useMemo(() => {
    if (filterCat === 'All') return WORKED_EXAMPLES;
    return WORKED_EXAMPLES.filter((ex) => ex.category === filterCat);
  }, [filterCat]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
            Curated Problem Library
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-0.5 flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-indigo-600" />
            <span>US Textbook & Exam Worked Examples</span>
          </h3>
          <p className="text-xs text-slate-500">
            Click any problem to immediately load its full step-by-step solution, completing the square breakdown, and reflection graph.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {['All', 'Quadratic', 'Rational', 'Linear', 'Radical', 'Exponential'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-1 rounded-lg font-semibold transition shrink-0 ${
                filterCat === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-xs transition bg-slate-50/50 flex flex-col justify-between space-y-3 group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                  {item.category}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    item.difficulty === 'Basic'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.difficulty === 'Intermediate'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {item.difficulty}
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 text-center my-2 group-hover:border-indigo-200 transition">
                <MathView math={item.latexPreview} block />
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                {item.whySpecial}
              </p>
            </div>

            <button
              onClick={() => onLoadExample({ ...item, onSelect: () => {} })}
              className="w-full mt-2 py-2 px-3 bg-white hover:bg-indigo-600 hover:text-white border border-slate-300 hover:border-indigo-600 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition shadow-xs"
            >
              <span>Load Full Steps & Graph</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
