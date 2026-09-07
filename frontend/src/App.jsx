import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import { Loader2 } from 'lucide-react';

function MainApp() {
  const { isAuthenticated, loading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-3">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-sm font-medium tracking-wide">Memuat aplikasi...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <DashboardPage />;
  }

  return authView === 'login' ? (
    <LoginPage onNavigateToRegister={() => setAuthView('register')} />
  ) : (
    <RegisterPage onNavigateToLogin={() => setAuthView('login')} />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
