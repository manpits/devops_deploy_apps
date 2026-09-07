import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Contact, Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

export default function RegisterPage({ onNavigateToLogin }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (password !== passwordConfirmation) {
      setErrors({ password_confirmation: ['Konfirmasi kata sandi tidak cocok'] });
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, passwordConfirmation);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: err.response?.data?.message || 'Gagal melakukan pendaftaran.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-xl shadow-indigo-500/25 mb-4">
            <Contact className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Buat Akun Baru
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Daftar untuk mengelola data kontak pribadi Anda
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-3xl p-7 sm:p-8 shadow-2xl relative border border-slate-800">
          {errors.general && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium leading-relaxed">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Anda"
                  required
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-900/90 border ${
                    errors.name ? 'border-rose-500' : 'border-slate-700'
                  } text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-rose-400 font-medium">{errors.name[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-900/90 border ${
                    errors.email ? 'border-rose-500' : 'border-slate-700'
                  } text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-400 font-medium">{errors.email[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  required
                  minLength={8}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-slate-900/90 border ${
                    errors.password ? 'border-rose-500' : 'border-slate-700'
                  } text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-400 font-medium">{errors.password[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="Ulangi kata sandi"
                  required
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-900/90 border ${
                    errors.password_confirmation ? 'border-rose-500' : 'border-slate-700'
                  } text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                />
              </div>
              {errors.password_confirmation && (
                <p className="mt-1 text-xs text-rose-400 font-medium">
                  {errors.password_confirmation[0]}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 focus:ring-4 focus:ring-indigo-500/30 transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Daftar Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer switch to Login */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Sudah punya akun?{' '}
          <button
            onClick={onNavigateToLogin}
            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Masuk ke Akun
          </button>
        </p>
      </div>
    </div>
  );
}
