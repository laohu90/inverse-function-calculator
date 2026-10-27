import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Info, Github, ExternalLink, Heart, CheckCircle2 } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'about' | 'privacy' | 'contact';
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'about',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'about' | 'privacy' | 'contact'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              f⁻¹
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Inverse Function Calculator
              </h2>
              <p className="text-xs text-slate-500">
                By <span className="font-semibold text-indigo-700">laohu90</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-nav Tabs */}
        <div className="flex border-b border-slate-200 px-6 space-x-6 text-sm font-semibold">
          <button
            onClick={() => setActiveSubTab('about')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition ${
              activeSubTab === 'about'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>About</span>
          </button>
          <button
            onClick={() => setActiveSubTab('privacy')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition ${
              activeSubTab === 'privacy'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Privacy</span>
          </button>
          <button
            onClick={() => setActiveSubTab('contact')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition ${
              activeSubTab === 'contact'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Contact & Author</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700 leading-relaxed">
          {activeSubTab === 'about' && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-100 space-y-2">
                <h3 className="font-bold text-indigo-950 text-base flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  Rigor, Precision & Clarity in Algebra
                </h3>
                <p className="text-xs text-indigo-900 leading-relaxed">
                  The Inverse Function Calculator is an open-source educational and computational tool designed for students, educators, and engineers. It specializes in rigorous algebraic inversion with strict Horizontal Line Test (HLT) verification and exact domain/range bounds.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900">Key Features:</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                  <li><strong>Non-degrading parser:</strong> High-precision parsing for polynomials of degree n, rationals, radicals, exponentials, arbitrary-base logarithms, trig, and inverse trig without silent fallbacks.</li>
                  <li><strong>Horizontal Line Test:</strong> Automatic injectivity checking with branch restriction warnings for non-monotonic curves.</li>
                  <li><strong>Completing the Square:</strong> Step-by-step trinomial factoring with vertex form breakdowns.</li>
                  <li><strong>Composition verification:</strong> Dual checks for f(f⁻¹(x)) = x and f⁻¹(f(x)) = x.</li>
                  <li><strong>Multi-format export:</strong> Support for Markdown, LaTeX, plain text, and interactive embeds.</li>
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>License: Open Source (MIT)</span>
                <a
                  href="https://github.com/laohu90/inverse-function-calculator"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {activeSubTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1.5">
                <h3 className="font-bold text-emerald-950 text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  100% Client-Side Privacy Guarantee
                </h3>
                <p className="text-xs text-emerald-900">
                  All mathematical calculations, equation solving, graph rendering, and step derivations run entirely within your browser runtime.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <h4 className="font-bold text-slate-900 text-sm">Our Privacy Commitments:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>No formula logging:</strong> The equations you enter are never transmitted to external servers or logged.</li>
                  <li><strong>No tracking:</strong> No invasive third-party trackers, ad cookies, or fingerprinting scripts.</li>
                  <li><strong>Local storage only:</strong> Recent formula history and language preferences are stored purely in your local browser storage (localStorage) and can be cleared anytime.</li>
                </ul>
              </div>
            </div>
          )}

          {activeSubTab === 'contact' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h3 className="font-bold text-slate-900 text-base">
                  Author & Project Attribution
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  This project is created and maintained by <strong>laohu90</strong>. We welcome bug reports, formula parser contributions, and pedagogical suggestions from teachers and students worldwide.
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href="https://github.com/laohu90/inverse-function-calculator"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>laohu90/inverse-function-calculator</span>
                  </a>
                  <a
                    href="https://github.com/laohu90/inverse-function-calculator/issues"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Report an Issue / Suggestion</span>
                  </a>
                </div>
              </div>

              <div className="text-xs text-slate-500 flex items-center justify-center gap-1 pt-2">
                <span>Crafted with</span>
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>for the global mathematics learning community</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
