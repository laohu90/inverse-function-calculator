import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { SupportedLocale, TRANSLATIONS } from '../i18n/translations';

interface LanguageSelectorProps {
  currentLocale: SupportedLocale;
  onSelectLocale: (locale: SupportedLocale) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLocale,
  onSelectLocale,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const locales: SupportedLocale[] = ['en', 'es', 'fr', 'pt', 'zh'];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentDict = TRANSLATIONS[currentLocale];

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition shadow-2xs"
        aria-expanded={isOpen}
      >
        <span className="text-base">{currentDict.flag}</span>
        <span className="hidden sm:inline text-xs font-bold text-slate-800">{currentDict.localeName}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white shadow-lg border border-slate-200 py-1.5 z-50 text-xs font-medium divide-y divide-slate-100">
          {locales.map((loc) => {
            const item = TRANSLATIONS[loc];
            const isSelected = loc === currentLocale;
            return (
              <button
                key={loc}
                onClick={() => {
                  onSelectLocale(loc);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 flex items-center justify-between transition hover:bg-indigo-50/70 hover:text-indigo-900 ${
                  isSelected ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{item.flag}</span>
                  <span className="text-sm">{item.localeName}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
