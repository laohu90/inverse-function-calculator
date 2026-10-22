import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  block?: boolean;
  className?: string;
  copyable?: boolean;
}

export const MathView: React.FC<MathViewProps> = ({
  math,
  block = false,
  className = '',
  copyable = false,
}) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return math;
    }
  }, [math, block]);

  const [copied, setCopied] = React.useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(math);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span className={`relative group inline-flex items-center ${block ? 'w-full justify-center my-2 flex' : ''} ${className}`}>
      <span
        className="overflow-x-auto py-0.5 text-slate-800"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {copyable && (
        <button
          onClick={handleCopy}
          title="Copy LaTeX"
          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded border border-slate-300"
        >
          {copied ? 'Copied!' : 'LaTeX'}
        </button>
      )}
    </span>
  );
};
