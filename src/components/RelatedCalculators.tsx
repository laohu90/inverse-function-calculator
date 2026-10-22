import React from 'react';
import { FunctionType } from '../types/math';
import { ArrowRight, Calculator, Layers, Divide, Compass } from 'lucide-react';

interface RelatedCalculatorsProps {
  onSwitchType: (type: FunctionType, preset?: string) => void;
}

export const RelatedCalculators: React.FC<RelatedCalculatorsProps> = ({ onSwitchType }) => {
  const links = [
    {
      title: 'Completing the Square Calculator',
      desc: 'Step-by-step breakdown of (b/2a)² derivation with geometric area model.',
      type: 'quadratic' as FunctionType,
      preset: 'quad1',
      icon: Layers,
    },
    {
      title: 'Rational Function Inverse Solver',
      desc: 'Clear fractions, cross-multiply, and factor out y with vertical asymptotes.',
      type: 'rational' as FunctionType,
      preset: 'rat1',
      icon: Divide,
    },
    {
      title: 'Domain and Range Analyzer',
      desc: 'Automatic interval notation calculation and domain swap theorem.',
      type: 'quadratic' as FunctionType,
      preset: 'quad2',
      icon: Compass,
    },
    {
      title: 'Linear Slope Inverter (1/m)',
      desc: 'Solve mx + b inverses and compute reciprocal slope lines.',
      type: 'linear' as FunctionType,
      preset: 'lin1',
      icon: Calculator,
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
            Related Math Tools
          </span>
          <h3 className="font-bold text-slate-900 text-sm mt-0.5">
            Explore Related High School & Precalculus Solvers
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {links.map((link, i) => {
          const Icon = link.icon;
          return (
            <button
              key={i}
              onClick={() => onSwitchType(link.type, link.preset)}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-left transition space-y-1.5 group flex flex-col justify-between"
            >
              <div>
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-2 group-hover:bg-indigo-600 group-hover:text-white transition">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-900 transition">
                  {link.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                  {link.desc}
                </p>
              </div>
              <span className="text-[11px] font-semibold text-indigo-600 flex items-center gap-1 pt-2">
                <span>Launch Tool</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
