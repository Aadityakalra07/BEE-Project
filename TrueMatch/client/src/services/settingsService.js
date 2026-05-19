// =============================================
// SETTINGS SERVICE (Controller Layer - Client Side)
// =============================================
// Handles all settings-related API calls.
// Maps to server routes: /api/settings/*
// Communicates with: settingsController.js (server)
// =============================================

import API from './api';

// GET /api/settings - Get user settings
export const getSettings = () => {
  return API.get('/api/settings');
};

// PUT /api/settings/privacy - Update privacy settings
export const updatePrivacy = (privacyData) => {
  return API.put('/api/settings/privacy', privacyData);
};

// PUT /api/settings/notifications - Update notification preferences
export const updateNotifications = (notificationData) => {
  return API.put('/api/settings/notifications', notificationData);
};

// PUT /api/settings/change-password - Change password
export const changePassword = (currentPassword, newPassword) => {
  return API.put('/api/settings/change-password', { currentPassword, newPassword });
};

// PUT /api/settings/block/:id - Toggle block/unblock user
export const toggleBlockUser = (userId) => {
  return API.put(`/api/settings/block/${userId}`);
};

// DELETE /api/settings/account - Delete account
export const deleteAccount = () => {
  return API.delete('/api/settings/account');
};

// GET /api/settings/download-data - GDPR data export
export const downloadMyData = () => {
  return API.get('/api/settings/download-data', { responseType: 'blob' });
};
