// =============================================
// AUTH CONTEXT (Model Layer - Client Side)
// =============================================
// MVC Role: Model — manages authentication state
// Consumes: authService.js (Controller layer)
// Consumed by: pages/ & components/ (View layer)
//
// Provides user state and auth actions to the
// entire React component tree via Context API.
// =============================================

import { createContext, useState, useContext, useEffect } from 'react';
import { loginUser as loginAPI, registerUser as registerAPI, googleLogin as googleLoginAPI } from '../services/authService';
import API from '../services/api';

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
    }
    setLoading(false);
  }, []);

  // Login function — delegates to authService (Controller)
  const login = async (email, password) => {
    const res = await loginAPI(email, password);
    const userData = res.data;
    setUser(userData);
    localStorage.setItem('truematch_user', JSON.stringify(userData));
    return userData;
  };

  // Register function — delegates to authService (Controller)
  const register = async (payload) => {
    const res = await registerAPI(payload);
    const userData = res.data;
    setUser(userData);
    localStorage.setItem('truematch_user', JSON.stringify(userData));
    return userData;
  };

  // Google login function — delegates to authService (Controller)
  const loginWithGoogle = async (credential) => {
    const res = await googleLoginAPI(credential);
    const userData = res.data;
    setUser(userData);
    localStorage.setItem('truematch_user', JSON.stringify(userData));
    return userData;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('truematch_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
