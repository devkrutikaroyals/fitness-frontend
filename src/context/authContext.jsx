import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';  // your axios instance
import setAuthToken from '../utils/setAuthToken';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.data);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication error');
      logout();
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      const newToken = res.data.data.token;
      const role = res.data.data.role;

      setToken(newToken);
      localStorage.setItem('token', newToken);
      setAuthToken(newToken);

      await loadUser();
      navigate(role === 'admin' ? '/admin/dashboard' : '/member/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      throw err;
    }
  };

  const login = async (formData) => {
    try {
      const res = await api.post('/auth/login', formData);
      const newToken = res.data.data.token;
      const role = res.data.data.role;

      setToken(newToken);
      localStorage.setItem('token', newToken);
      setAuthToken(newToken);

      await loadUser();
      navigate(role === 'admin' ? '/admin/dashboard' : '/member/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  const clearErrors = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        clearErrors,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
