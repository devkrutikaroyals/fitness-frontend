import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
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
    const initializeAuth = async () => {
      if (token) {
        setAuthToken(token);
        await loadUser();
      }
      setLoading(false);
    };
    initializeAuth();
  }, [token]);

  const loadUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.data);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      handleAuthError(err);
    }
  };

  const handleAuthError = (err) => {
    const errorMessage = err.response?.data?.message || 
                        err.message || 
                        'Authentication error';
    setError(errorMessage);
    if (err.response?.status === 401) {
      logout();
    }
  };

  const register = async (formData) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/register', formData);
      handleAuthSuccess(res.data);
    } catch (err) {
      handleAuthError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/login', formData);
      handleAuthSuccess(res.data);
    } catch (err) {
      handleAuthError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = (data) => {
    const { token, role } = data.data;
    setToken(token);
    localStorage.setItem('token', token);
    setAuthToken(token);
    navigate(role === 'admin' ? '/admin/dashboard' : '/member/dashboard');
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