// =============================================
// AUTH CONTEXT
// Manages user authentication state globally
// =============================================

import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('truematch_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      // Set default auth header for all axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    const userData = res.data;
    setUser(userData);
    localStorage.setItem('truematch_user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    return userData;
  };

  // Register function
  const register = async (payload) => {
    const config = payload instanceof FormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : undefined;
    const res = await axios.post('/api/auth/register', payload, config);
    const userData = res.data;
    setUser(userData);
    localStorage.setItem('truematch_user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    return userData;
  };

  // Google login function
  const loginWithGoogle = async (credential) => {
    const res = await axios.post('/api/auth/google', { credential });
    const userData = res.data;
    setUser(userData);
    localStorage.setItem('truematch_user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    return userData;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('truematch_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
