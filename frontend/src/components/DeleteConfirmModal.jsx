import React, { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  contactName,
}) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-sm rounded-2xl border border-rose-500/30 bg-slate-900 shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-white mb-2">Hapus Kontak?</h3>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          Apakah Anda yakin ingin menghapus kontak{' '}
          <span className="font-semibold text-slate-200">"{contactName}"</span>?
          Semua nomor telepon terkait juga akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Ya, Hapus</span>
          </button>
        </div>
      </div>
    </div>
  );
}
