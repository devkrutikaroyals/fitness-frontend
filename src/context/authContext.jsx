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
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        setAuthToken(token);
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data);
            setIsAuthenticated(true);
          }
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, [token]);

  const loadUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.data);
        setIsAuthenticated(true);
        setError(null);
        return res.data.data;
      }
      throw new Error('Failed to load user');
    } catch (err) {
      setError(err.response?.data?.error || 'Session expired. Please login again.');
      logout();
      return null;
    }
  };

  const register = async (formData) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/register', formData);
      
      if (!res.data.success) {
        throw new Error(res.data.error || 'Registration failed');
      }

      // Show success message and redirect to login
      setMessage(res.data.message || 'Registration successful. Please login.');
      navigate('/login');
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/login', formData);
      
      if (!res.data.success) {
        throw new Error(res.data.error || 'Login failed');
      }

      const { token, role } = res.data.data;
      
      // Save token and load user
      localStorage.setItem('token', token);
      setToken(token);
      setAuthToken(token);
      
      // Load user data
      const loadedUser = await loadUser();
      if (loadedUser) {
        navigate(role === 'admin' ? '/admin/dashboard' : '/member/dashboard');
      }
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
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
  const clearMessage = () => setMessage(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        message,
        register,
        login,
        logout,
        clearErrors,
        clearMessage,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};