// =============================================
// PROFILE SERVICE (Controller Layer - Client Side)
// =============================================
// Handles all profile-related API calls.
// Maps to server routes: /api/profile/*
// Communicates with: profileController.js (server)
// =============================================

import API from './api';

// GET /api/profile/me - Get my own profile
export const getMyProfile = () => {
  return API.get('/api/profile/me');
};

// PUT /api/profile - Update/Create profile (with optional photo)
export const updateProfile = (formData) => {
  return API.put('/api/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// GET /api/profile - Get all approved profiles
export const getAllProfiles = () => {
  return API.get('/api/profile');
};

// GET /api/profile/:id - Get profile by ID
export const getProfileById = (id) => {
  return API.get(`/api/profile/${id}`);
};

// GET /api/profile/search - Search & filter profiles
export const searchProfiles = (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  return API.get(`/api/profile/search?${params.toString()}`);
};

// GET /api/profile/compatible - Get profiles sorted by compatibility
export const getCompatibleProfiles = () => {
  return API.get('/api/profile/compatible');
};

// PUT /api/profile/favourite/:id - Toggle favourite
export const toggleFavourite = (profileId) => {
  return API.put(`/api/profile/favourite/${profileId}`);
};

// GET /api/profile/favourites - Get my favourite profiles
export const getFavourites = () => {
  return API.get('/api/profile/favourites');
};

// PUT /api/profile/report/:id - Report a profile
export const reportProfile = (profileId) => {
  return API.put(`/api/profile/report/${profileId}`);
};
