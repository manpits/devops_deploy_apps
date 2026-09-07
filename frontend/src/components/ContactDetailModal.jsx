import React, { useState } from 'react';
import { X, Phone, MapPin, Calendar, User, Copy, Check, ExternalLink, Edit2, Trash2, Cake } from 'lucide-react';

export default function ContactDetailModal({
  isOpen,
  onClose,
  contact,
  onEdit,
  onDelete,
}) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!isOpen || !contact) return null;

  const copyToClipboard = (number, idx) => {
    navigator.clipboard.writeText(number);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const calculateAge = (birthDateStr) => {
    if (!birthDateStr) return null;
    const birthDate = new Date(birthDateStr);
    const diffMs = Date.now() - birthDate.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Tidak diisi';
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const age = calculateAge(contact.birth_date);
  const initials = contact.name
    ? contact.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'K';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl p-6 text-left my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Head */}
        <div className="flex items-center gap-4 pb-5 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-500/20 shrink-0">
            {initials}
          </div>
          <div className="overflow-hidden">
            <h3 className="text-xl font-extrabold text-white truncate">
              {contact.name}
            </h3>
            <p className="text-xs text-indigo-400 font-medium mt-0.5">
              ID Kontak: #{contact.id}
            </p>
          </div>
        </div>

        {/* Content list */}
        <div className="mt-5 space-y-4">
          {/* Birth Date */}
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>Tanggal Lahir</span>
            </div>
            <div className="text-sm font-medium text-slate-200 flex items-center gap-2">
              <span>{formatDate(contact.birth_date)}</span>
              {age !== null && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1">
                  <Cake className="w-3 h-3" /> {age} tahun
                </span>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>Alamat</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
              {contact.address || <span className="text-slate-500 italic">Tidak ada alamat tercatat</span>}
            </p>
          </div>

          {/* Phone Numbers */}
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                <span>Nomor Telepon ({contact.phones ? contact.phones.length : 0})</span>
              </div>
            </div>

            <div className="space-y-2">
              {contact.phones && contact.phones.length > 0 ? (
                contact.phones.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-700/80"
                  >
                    <div>
                      <div className="text-sm font-mono font-bold text-white">
                        {p.phone_number}
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                        {p.label || 'Mobile'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copyToClipboard(p.phone_number, idx)}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Salin Nomor"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <a
                        href={`tel:${p.phone_number}`}
                        className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                        title="Panggil Nomor"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">Belum ada nomor telepon</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-5 mt-5 border-t border-slate-800">
          <button
            onClick={() => {
              onClose();
              onDelete(contact);
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Kontak</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onEdit(contact);
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Kontak</span>
          </button>
        </div>
      </div>
    </div>
  );
}
