import React, { useState } from 'react';
import { Phone, Calendar, Edit2, Trash2, Eye, Copy, Check } from 'lucide-react';

export default function ContactRow({ contact, onEdit, onDelete, onView }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

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

  const initials = contact.name
    ? contact.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'K';

  const age = calculateAge(contact.birth_date);

  return (
    <tr className="border-b border-slate-800/80 hover:bg-slate-800/40 transition-colors">
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs shrink-0">
            {initials}
          </div>
          <div>
            <div className="font-semibold text-slate-100 text-sm hover:text-indigo-300 transition-colors cursor-pointer" onClick={() => onView(contact)}>
              {contact.name}
            </div>
            <div className="text-[11px] text-slate-400">ID #{contact.id}</div>
          </div>
        </div>
      </td>

      <td className="py-3.5 px-4 text-xs text-slate-300 max-w-[200px] truncate">
        {contact.address || <span className="text-slate-500 italic">-</span>}
      </td>

      <td className="py-3.5 px-4 text-xs text-slate-300 whitespace-nowrap">
        {contact.birth_date ? (
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{formatDate(contact.birth_date)}</span>
            {age !== null && (
              <span className="text-[10px] text-slate-400">({age} th)</span>
            )}
          </div>
        ) : (
          <span className="text-slate-500 italic">-</span>
        )}
      </td>

      <td className="py-3.5 px-4">
        <div className="flex flex-wrap gap-1.5 max-w-[280px]">
          {contact.phones && contact.phones.length > 0 ? (
            contact.phones.map((p, idx) => (
              <span
                key={p.id || idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono"
              >
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{p.phone_number}</span>
                <span className="text-[9px] text-indigo-400 font-sans font-medium uppercase">
                  [{p.label || 'Utama'}]
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(p.phone_number, idx)}
                  className="hover:text-white ml-0.5 text-slate-400"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </span>
            ))
          ) : (
            <span className="text-slate-500 italic text-xs">-</span>
          )}
        </div>
      </td>

      <td className="py-3.5 px-4 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1">
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
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(contact)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Hapus"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
