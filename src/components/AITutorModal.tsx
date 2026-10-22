import React, { useState } from 'react';
import { X, Sparkles, Send, Loader2, Bot, AlertCircle, HelpCircle } from 'lucide-react';
import { InverseSolution } from '../types/math';
import { MathView } from './MathView';

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  solution: InverseSolution;
}

export const AITutorModal: React.FC<AITutorModalProps> = ({ isOpen, onClose, solution }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickQuestions = [
    'Why do we restrict the domain of quadratic functions before finding the inverse?',
    'Why is (b/2a)² added to BOTH sides in completing the square?',
    'Why does swapping x and y geometrically reflect over the line y = x?',
    'What is the difference between an inverse function f⁻¹(x) and reciprocal 1/f(x)?',
  ];

  const handleAsk = async (userQ: string) => {
    if (!userQ.trim()) return;
    setLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem: solution.originalEquation,
          userQuestion: userQ,
          stepsContext: solution.steps
            .map((s) => `Step ${s.stepNumber} (${s.title}): ${s.latex} - ${s.explanation}`)
            .join('\n'),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get tutor response');
      }

      setAnswer(data.reply);
    } catch (err: any) {
      setError(err.message || 'Error communicating with AI Math Tutor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-indigo-50/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">AI Math Tutor & Explainer</h3>
              <p className="text-xs text-slate-500">
                Context: <MathView math={solution.originalEquation} />
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Quick Prompts */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
              Frequently Asked High School Questions:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuestion(q);
                    handleAsk(q);
                  }}
                  className="text-left text-xs bg-slate-50 hover:bg-indigo-50/60 hover:text-indigo-900 text-slate-700 p-2.5 rounded-lg border border-slate-200 transition flex items-start gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Response Container */}
          {loading && (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
              <p className="text-xs text-slate-600 font-medium">Tutor is preparing step-by-step breakdown...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Notice:</span>
                <span>{error}</span>
                <p className="mt-1 text-slate-500">
                  Tip: All standard math steps and completing the square breakdowns are already calculated deterministically in the main steps panel!
                </p>
              </div>
            </div>
          )}

          {answer && !loading && (
            <div className="bg-slate-50 border border-indigo-100 rounded-xl p-5 text-sm text-slate-800 leading-relaxed space-y-3">
              <div className="flex items-center gap-2 text-indigo-800 font-semibold text-xs border-b border-indigo-100 pb-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Tutor Explanation</span>
              </div>
              <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-700 leading-relaxed">
                {answer}
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk(question);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about this step or concept..."
              className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 transition shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
