import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Contact, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage({ onNavigateToRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan password wajib diisi');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors?.email) {
        setError(err.response.data.errors.email[0]);
      } else {
        setError('Gagal masuk. Periksa kembali email dan password Anda.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('demo@example.com');
    setPassword('password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-xl shadow-indigo-500/25 mb-4">
            <Contact className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Selamat Datang Kembali
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Kelola data kontak dan multi nomor telepon dengan aman
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-3xl p-7 sm:p-8 shadow-2xl relative border border-slate-800">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
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
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
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
                  <span>Masuk ke Akun</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo account helper button */}
          <div className="mt-5 pt-4 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-[11px] text-slate-400 hover:text-indigo-400 transition-colors inline-flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Isi dengan Akun Demo (demo@example.com)</span>
            </button>
          </div>
        </div>

        {/* Footer switch to Register */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Belum punya akun?{' '}
          <button
            onClick={onNavigateToRegister}
            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Daftar Sekarang
          </button>
        </p>
      </div>
    </div>
  );
}
