// =============================================
// AUTH SERVICE (Controller Layer - Client Side)
// =============================================
// Handles all authentication-related API calls.
// Maps to server routes: /api/auth/*
// Communicates with: authController.js (server)
// =============================================

import API from './api';

// POST /api/auth/register - Register a new user
export const registerUser = (formData) => {
  const config = formData instanceof FormData
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : undefined;
  return API.post('/api/auth/register', formData, config);
};

// POST /api/auth/login - Login with email & password
export const loginUser = (email, password) => {
  return API.post('/api/auth/login', { email, password });
};

// POST /api/auth/google - Login/Register with Google
export const googleLogin = (credential) => {
  return API.post('/api/auth/google', { credential });
};

// GET /api/auth/me - Get current logged-in user
export const getMe = () => {
  return API.get('/api/auth/me');
};
