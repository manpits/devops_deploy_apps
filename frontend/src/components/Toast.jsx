import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-400 shrink-0" />,
  };

  const borderColors = {
    success: 'border-emerald-500/30 bg-emerald-950/80 text-emerald-100',
    error: 'border-rose-500/30 bg-rose-950/80 text-rose-100',
    info: 'border-indigo-500/30 bg-indigo-950/80 text-indigo-100',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl ${
          borderColors[toast.type] || borderColors.info
        }`}
      >
        {icons[toast.type] || icons.info}
        <div className="flex-1 text-sm font-medium">{toast.message}</div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors p-0.5 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
