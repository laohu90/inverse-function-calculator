import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, RotateCcw, Award } from 'lucide-react';
import { MathView } from './MathView';

interface Question {
  id: number;
  category: string;
  problem: string;
  options: { id: string; latex: string; explanation: string }[];
  correctId: string;
  hint: string;
  fullStepLaTeX: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'Completing the Square',
    problem: 'Find the inverse of f(x) = x^2 + 6x + 2 for x \\ge -3.',
    options: [
      {
        id: 'A',
        latex: 'f^{-1}(x) = -3 + \\sqrt{x + 7}',
        explanation: 'Correct! Completing the square on x = y² + 6y + 2 gives x + 7 = (y + 3)², so y = -3 + √(x + 7).',
      },
      {
        id: 'B',
        latex: 'f^{-1}(x) = 3 + \\sqrt{x - 7}',
        explanation: 'Incorrect: Check the signs of the vertex (h = -b/2a = -3).',
      },
      {
        id: 'C',
        latex: 'f^{-1}(x) = -3 \\pm \\sqrt{x + 7}',
        explanation: 'Incorrect: A function cannot produce both ± outputs. The domain restriction x ≥ -3 forces the + branch!',
      },
      {
        id: 'D',
        latex: 'f^{-1}(x) = \\frac{1}{x^2 + 6x + 2}',
        explanation: 'Fatal misconception: The inverse function f⁻¹(x) is NEVER the reciprocal 1/f(x)!',
      },
    ],
    correctId: 'A',
    hint: 'Step 1: x = y² + 6y + 2. Step 2: Half of 6 is 3, 3² = 9. Add 9 to both sides: x - 2 + 9 = (y + 3)²',
    fullStepLaTeX: 'x = y^2 + 6y + 2 \\implies x - 2 + 9 = (y + 3)^2 \\implies x + 7 = (y + 3)^2 \\implies y = -3 + \\sqrt{x + 7}',
  },
  {
    id: 2,
    category: 'Rational Function',
    problem: 'Find the inverse of f(x) = \\frac{2x + 1}{x - 3} for x \\neq 3.',
    options: [
      {
        id: 'A',
        latex: 'f^{-1}(x) = \\frac{3x + 1}{x - 2}',
        explanation: 'Correct! Cross multiplying x(y - 3) = 2y + 1 gives xy - 3x = 2y + 1, so y(x - 2) = 3x + 1, giving y = (3x + 1)/(x - 2).',
      },
      {
        id: 'B',
        latex: 'f^{-1}(x) = \\frac{x - 3}{2x + 1}',
        explanation: 'Incorrect: You just flipped numerator and denominator (that is the reciprocal 1/f(x), not the inverse f⁻¹(x)!).',
      },
      {
        id: 'C',
        latex: 'f^{-1}(x) = \\frac{3x - 1}{x + 2}',
        explanation: 'Incorrect: Watch out for negative signs when gathering y terms on one side.',
      },
      {
        id: 'D',
        latex: 'f^{-1}(x) = \\frac{2x - 3}{x + 1}',
        explanation: 'Incorrect: Remember to factor out y from (xy - 2y).',
      },
    ],
    correctId: 'A',
    hint: 'Swap x and y: x = (2y + 1)/(y - 3). Multiply by (y - 3), distribute x, and collect all terms with y on one side!',
    fullStepLaTeX: 'x(y - 3) = 2y + 1 \\implies xy - 3x = 2y + 1 \\implies y(x - 2) = 3x + 1 \\implies f^{-1}(x) = \\frac{3x + 1}{x - 2}',
  },
  {
    id: 3,
    category: 'Linear & Slopes',
    problem: 'Find the inverse of f(x) = -4x + 12.',
    options: [
      {
        id: 'A',
        latex: 'f^{-1}(x) = -\\frac{1}{4}x + 3',
        explanation: 'Correct! x = -4y + 12 => 4y = 12 - x => y = -x/4 + 3. The slope of f⁻¹ is the reciprocal -1/4!',
      },
      {
        id: 'B',
        latex: 'f^{-1}(x) = 4x - 12',
        explanation: 'Incorrect: You negated the terms instead of solving for y.',
      },
      {
        id: 'C',
        latex: 'f^{-1}(x) = -4x - 12',
        explanation: 'Incorrect: You must divide by the slope m = -4.',
      },
      {
        id: 'D',
        latex: 'f^{-1}(x) = \\frac{1}{-4x + 12}',
        explanation: 'Incorrect: That is the reciprocal, not the inverse.',
      },
    ],
    correctId: 'A',
    hint: 'Swap to get x = -4y + 12. Subtract 12, then divide both sides by -4.',
    fullStepLaTeX: 'x = -4y + 12 \\implies x - 12 = -4y \\implies y = \\frac{x - 12}{-4} = -\\frac{1}{4}x + 3',
  },
  {
    id: 4,
    category: 'Radical Functions',
    problem: 'Find the inverse of f(x) = \\sqrt{3x - 6} + 5.',
    options: [
      {
        id: 'A',
        latex: 'f^{-1}(x) = \\frac{(x - 5)^2 + 6}{3}, \\quad x \\ge 5',
        explanation: 'Correct! The square root range is [5, ∞), which becomes the domain restriction for the inverse!',
      },
      {
        id: 'B',
        latex: 'f^{-1}(x) = \\frac{(x - 5)^2 + 6}{3}, \\quad x \\in \\mathbb{R}',
        explanation: 'Incorrect: Without the restriction x ≥ 5, the quadratic is not one-to-one and includes values not in the range of f(x).',
      },
      {
        id: 'C',
        latex: 'f^{-1}(x) = (3x - 6)^2 + 5',
        explanation: 'Incorrect: You must isolate the radical first before squaring.',
      },
      {
        id: 'D',
        latex: 'f^{-1}(x) = \\sqrt{3x + 6} - 5',
        explanation: 'Incorrect: Inverses of radicals are quadratics (with restricted domains).',
      },
    ],
    correctId: 'A',
    hint: 'Isolate the radical first: x - 5 = √(3y - 6). Then square both sides!',
    fullStepLaTeX: 'x - 5 = \\sqrt{3y - 6} \\implies (x - 5)^2 = 3y - 6 \\implies 3y = (x - 5)^2 + 6 \\implies y = \\frac{(x - 5)^2 + 6}{3}, \\, x \\ge 5',
  },
];

export const PracticeMode: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});

  const currentQ = QUESTIONS[currentIndex];

  const handleSelect = (optionId: string) => {
    if (userAnswers[currentQ.id]) return; // Already answered
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: optionId }));
    setSelectedOption(optionId);
    if (optionId === currentQ.correctId) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(userAnswers[QUESTIONS[currentIndex + 1].id] || null);
      setShowHint(false);
    } else {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowHint(false);
    setScore(0);
    setCompleted(false);
    setUserAnswers({});
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Interactive High School Practice & Self-Quiz
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-1">
            Test Your Knowledge: Inverses & Completing the Square
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500 font-medium block">Score</span>
          <span className="text-base font-bold text-slate-900">
            {score} / {QUESTIONS.length}
          </span>
        </div>
      </div>

      {!completed ? (
        <div className="mt-5 space-y-5">
          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Question Prompt */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-indigo-700">Question {currentIndex + 1} of {QUESTIONS.length}</span>
              <span className="bg-white px-2 py-0.5 rounded border border-slate-200">{currentQ.category}</span>
            </div>
            <div className="text-base font-medium text-slate-900">
              <MathView math={currentQ.problem} />
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              const hasAnswered = !!userAnswers[currentQ.id];
              const isCorrect = opt.id === currentQ.correctId;

              let btnStyle = 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50';
              if (hasAnswered) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20 text-emerald-900 font-semibold';
                } else if (isSelected) {
                  btnStyle = 'border-rose-400 bg-rose-50/60 text-rose-900';
                } else {
                  btnStyle = 'border-slate-200 bg-white opacity-50';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  disabled={hasAnswered}
                  className={`p-3.5 rounded-xl border text-left transition flex items-start gap-3 ${btnStyle}`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      hasAnswered && isCorrect
                        ? 'bg-emerald-600 text-white'
                        : hasAnswered && isSelected
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {opt.id}
                  </span>
                  <div className="flex-1 overflow-x-auto">
                    <MathView math={opt.latex} />
                    {hasAnswered && (isCorrect || isSelected) && (
                      <p className={`text-xs mt-1.5 ${isCorrect ? 'text-emerald-700 font-medium' : 'text-rose-600'}`}>
                        {opt.explanation}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Hint & Solution Box */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1.5 transition"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
            </button>

            {userAnswers[currentQ.id] && (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <span>{currentIndex < QUESTIONS.length - 1 ? 'Next Question' : 'View Summary'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {showHint && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 space-y-1">
              <span className="font-bold flex items-center gap-1">💡 Teacher's Hint:</span>
              <p>{currentQ.hint}</p>
              {userAnswers[currentQ.id] && (
                <div className="mt-2 pt-2 border-t border-amber-200/60">
                  <span className="font-semibold block mb-1">Full algebraic steps:</span>
                  <MathView math={currentQ.fullStepLaTeX} block />
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Completed Screen */
        <div className="text-center py-8 space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-slate-900">Quiz Complete!</h4>
          <p className="text-sm text-slate-600">
            You scored <span className="font-bold text-slate-900">{score}</span> out of{' '}
            <span className="font-bold text-slate-900">{QUESTIONS.length}</span> (
            {Math.round((score / QUESTIONS.length) * 100)}%).
          </p>
          <div className="max-w-md mx-auto text-xs text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-200 text-left">
            <span className="font-bold text-slate-800 block mb-1">High School Takeaways:</span>
            <ul className="list-disc pl-4 space-y-1">
              <li>Always remember the Golden Rule: swap x and y first, then isolate y.</li>
              <li>Quadratics require completing the square and restricting the domain.</li>
              <li>Never confuse f⁻¹(x) with 1/f(x) — they are completely different!</li>
            </ul>
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-2 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Practice Quiz</span>
          </button>
        </div>
      )}
    </div>
  );
};
