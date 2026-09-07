import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Contact, LogOut, User as UserIcon, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Contact className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                KontakKu
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                Cloud Manager
              </span>
            </div>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-semibold text-xs border border-indigo-500/30">
                {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-200 leading-tight truncate max-w-[140px]">
                  {user?.name || 'User'}
                </p>
                <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                  {user?.email || ''}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
