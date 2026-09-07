import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Phone, User, MapPin, Calendar, AlertCircle, Loader2 } from 'lucide-react';

const PHONE_LABELS = [
  'Mobile',
  'WhatsApp',
  'Kantor',
  'Rumah',
  'Darurat',
  'Lainnya',
];

export default function ContactModal({ isOpen, onClose, onSave, contact = null }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phones, setPhones] = useState([{ phone_number: '', label: 'Mobile' }]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (contact) {
      setName(contact.name || '');
      setAddress(contact.address || '');
      setBirthDate(contact.birth_date ? contact.birth_date.split('T')[0] : '');
      if (contact.phones && contact.phones.length > 0) {
        setPhones(
          contact.phones.map((p) => ({
            id: p.id,
            phone_number: p.phone_number || '',
            label: p.label || 'Mobile',
          }))
        );
      } else {
        setPhones([{ phone_number: '', label: 'Mobile' }]);
      }
    } else {
      setName('');
      setAddress('');
      setBirthDate('');
      setPhones([{ phone_number: '', label: 'Mobile' }]);
    }
    setErrors({});
  }, [contact, isOpen]);

  if (!isOpen) return null;

  const handleAddPhone = () => {
    setPhones([...phones, { phone_number: '', label: 'Mobile' }]);
  };

  const handleRemovePhone = (index) => {
    if (phones.length <= 1) {
      setPhones([{ phone_number: '', label: 'Mobile' }]);
      return;
    }
    setPhones(phones.filter((_, idx) => idx !== index));
  };

  const handlePhoneChange = (index, field, value) => {
    const updated = [...phones];
    updated[index][field] = value;
    setPhones(updated);
  };

  const validate = () => {
    const errs = {};
    if (!name.trim()) {
      errs.name = 'Nama kontak wajib diisi';
    }

    // Filter out completely empty phone items if user added extra blank ones, but require at least 1 valid number
    const validPhones = phones.filter((p) => p.phone_number && p.phone_number.trim() !== '');
    if (validPhones.length === 0) {
      errs.phones = 'Setidaknya sertakan 1 nomor telepon';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        address: address.trim() || null,
        birth_date: birthDate || null,
        phones: phones
          .filter((p) => p.phone_number && p.phone_number.trim() !== '')
          .map((p) => ({
            phone_number: p.phone_number.trim(),
            label: p.label || 'Mobile',
          })),
      };

      await onSave(payload, contact ? contact.id : null);
      onClose();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl p-6 sm:p-7 text-left my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white">
              {contact ? 'Edit Kontak' : 'Tambah Kontak Baru'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {contact
                ? 'Perbarui detail dan nomor telepon kontak ini'
                : 'Lengkapi rincian kontak dan kelola multi nomor telepon'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errors.general && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Nama Lengkap <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-800/80 border ${
                  errors.name ? 'border-rose-500' : 'border-slate-700'
                } text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-rose-400 font-medium">{errors.name}</p>
            )}
          </div>

          {/* Dynamic Phone Numbers */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Nomor Telepon <span className="text-rose-400">*</span>
              </label>
              <button
                type="button"
                onClick={handleAddPhone}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Nomor</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {phones.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="tel"
                      value={item.phone_number}
                      onChange={(e) =>
                        handlePhoneChange(idx, 'phone_number', e.target.value)
                      }
                      placeholder="081234567890"
                      className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <select
                    value={item.label}
                    onChange={(e) =>
                      handlePhoneChange(idx, 'label', e.target.value)
                    }
                    className="w-28 py-2 px-2.5 rounded-xl text-xs bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500 shrink-0"
                  >
                    {PHONE_LABELS.map((lbl) => (
                      <option key={lbl} value={lbl}>
                        {lbl}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => handleRemovePhone(idx)}
                    title="Hapus Nomor"
                    disabled={phones.length === 1 && !item.phone_number}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors disabled:opacity-40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            {errors.phones && (
              <p className="mt-1 text-xs text-rose-400 font-medium">
                {Array.isArray(errors.phones) ? errors.phones[0] : errors.phones}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Alamat
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Alamat lengkap (opsional)"
                className="w-full pl-10 pr-4 py-2 rounded-xl text-sm bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Birth Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Tanggal Lahir
            </label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-500/30 transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{contact ? 'Simpan Perubahan' : 'Tambah Kontak'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
