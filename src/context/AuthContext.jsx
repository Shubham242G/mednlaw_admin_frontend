import { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  );
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  // Register user
  const register = async (userData) => {
    setError(null);
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setToken(response.data.token);
      setUser(response.data.user);
      setLoading(false);
      
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.msg || 'Registration failed';
      setError(message);
      setLoading(false);
      return { success: false, error: message };
    }
  };

  // Login user
  const login = async (credentials) => {
    setError(null);
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setToken(response.data.token);
      setUser(response.data.user);
      setLoading(false);
      
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.msg || 'Login failed';
      setError(message);
      setLoading(false);
      return { success: false, error: message };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!token && !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
