import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Fetch current authenticated user info
  const fetchUser = async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/user');
      setUser(response.data.data || response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    const handleAuthLogout = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth:logout', handleAuthLogout);
    return () => window.removeEventListener('auth:logout', handleAuthLogout);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/login', { email, password });
    const { token: newToken, user: userData } = response.data;
    
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    return response.data;
  };

  const register = async (name, email, password, password_confirmation) => {
    const response = await api.post('/register', {
      name,
      email,
      password,
      password_confirmation,
    });
    const { token: newToken, user: userData } = response.data;

    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
