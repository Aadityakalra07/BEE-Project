// =============================================
// API SERVICE - Centralized Axios Instance
// =============================================
// MVC Architecture (Client-Side):
//   View       → pages/ & components/ (React UI)
//   Controller → services/            (API communication)
//   Model      → context/             (state management)
//
// This module provides a pre-configured Axios instance
// that all service modules use. It handles:
//   - Base URL configuration
//   - Auth token injection (request interceptor)
//   - Global error handling (response interceptor)
// =============================================

import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor: Attach JWT token ──
API.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('truematch_user');
    if (stored) {
      const { token } = JSON.parse(stored);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: Handle auth errors globally ──
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear stored user
      localStorage.removeItem('truematch_user');
      // Optionally redirect to login (handled by AuthContext)
    }
    return Promise.reject(error);
  }
);

export default API;
