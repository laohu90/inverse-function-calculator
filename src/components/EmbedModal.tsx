import React, { useState } from 'react';
import { X, Code, Copy, Check, ExternalLink } from 'lucide-react';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFormula: string;
}

export const EmbedModal: React.FC<EmbedModalProps> = ({ isOpen, onClose, currentFormula }) => {
  const [copied, setCopied] = useState(false);
  const [width, setWidth] = useState('100%');
  const [height, setHeight] = useState('650');

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}?f=${encodeURIComponent(currentFormula)}`
    : '';

  const embedCode = `<iframe 
  src="${currentUrl}" 
  width="${width}" 
  height="${height}" 
  style="border:1px solid #e2e8f0; border-radius:12px; max-width:100%;" 
  title="Inverse Function Calculator & Steps"
  loading="lazy"
></iframe>
<p style="font-size:12px; color:#64748b; margin-top:4px;">
  Powered by <a href="${currentUrl}" target="_blank" rel="noopener noreferrer" style="color:#4f46e5; text-decoration:underline;">Inverse Function Calculator</a>
</p>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
            <Code className="w-5 h-5 text-indigo-600" />
            <span>Embed This Calculator On Your Website / Blog</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm text-slate-700">
          <p className="text-xs text-slate-600 leading-relaxed">
            Math teachers, educators, and bloggers can embed this live interactive tool directly into curriculum portals, Canvas, WordPress, or blogs for free.
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
              HTML Embed Snippet (Includes backlinks & responsive iframe):
            </label>
            <div className="relative">
              <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto whitespace-pre-wrap max-h-48 border border-slate-800">
                {embedCode}
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-2.5 right-2.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied HTML!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>

          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 flex items-start gap-2">
            <span>💡</span>
            <div>
              <strong>SEO Growth Secret:</strong> Every math blog or teacher who embeds this tool gives your website a permanent, authoritative educational backlink, boosting your Google PageRank!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
