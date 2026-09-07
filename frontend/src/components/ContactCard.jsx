import React from 'react';
import { Phone, MapPin, Calendar, Edit2, Trash2, Eye, ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function ContactCard({ contact, onEdit, onDelete, onView }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyToClipboard = (number, idx, e) => {
    e.stopPropagation();
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
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getLabelBadgeStyle = (label) => {
    const l = (label || '').toLowerCase();
    if (l.includes('whatsapp') || l.includes('wa')) {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
    if (l.includes('kantor') || l.includes('work') || l.includes('office')) {
      return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
    }
    if (l.includes('rumah') || l.includes('home')) {
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
    return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
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

  // Deterministic avatar gradient based on name
  const gradientList = [
    'from-blue-600 to-indigo-600',
    'from-purple-600 to-pink-600',
    'from-emerald-600 to-teal-600',
    'from-amber-600 to-orange-600',
    'from-rose-600 to-red-600',
    'from-cyan-600 to-blue-600',
  ];
  const charCode = (contact.name || 'a').charCodeAt(0);
  const gradientClass = gradientList[charCode % gradientList.length];

  return (
    <div className="group relative rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl transition-all duration-300 hover:border-slate-700 hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col justify-between">
      <div>
        {/* Header: Avatar, Name, Actions */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${gradientClass} flex items-center justify-center text-white font-bold text-base shadow-md shadow-slate-950/50 shrink-0`}
            >
              {initials}
            </div>
            <div>
              <h4 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors line-clamp-1">
                {contact.name}
              </h4>
              <div className="flex items-center gap-2 mt-0.5">
                {contact.birth_date && (
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {formatDate(contact.birth_date)} {age !== null && `(${age} th)`}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onView(contact)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Lihat Detail"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(contact)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
              title="Edit Kontak"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(contact)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Hapus Kontak"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Address */}
        {contact.address && (
          <div className="flex items-start gap-2 mb-4 text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2 leading-relaxed">{contact.address}</span>
          </div>
        )}

        {/* Phones list */}
        <div className="space-y-1.5 mb-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Nomor Telepon ({contact.phones ? contact.phones.length : 0})
          </span>
          {contact.phones && contact.phones.length > 0 ? (
            contact.phones.map((phone, idx) => (
              <div
                key={phone.id || idx}
                className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-800/30 border border-slate-800 text-xs text-slate-200 hover:bg-slate-800/60 transition-colors"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono text-slate-100 truncate">
                    {phone.phone_number}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded border font-medium shrink-0 ${getLabelBadgeStyle(
                      phone.label
                    )}`}
                  >
                    {phone.label || 'Utama'}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => copyToClipboard(phone.phone_number, idx, e)}
                    className="p-1 text-slate-400 hover:text-slate-100 transition-colors"
                    title="Salin Nomor"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <a
                    href={`tel:${phone.phone_number}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 text-slate-400 hover:text-indigo-400 transition-colors"
                    title="Panggil"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 italic py-1">Belum ada nomor telepon</p>
          )}
        </div>
      </div>

      {/* Footer info */}
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
        <span>ID #{contact.id}</span>
        <button
          onClick={() => onView(contact)}
          className="text-indigo-400 hover:text-indigo-300 font-medium"
        >
          Lihat Selengkapnya &rarr;
        </button>
      </div>
    </div>
  );
}
