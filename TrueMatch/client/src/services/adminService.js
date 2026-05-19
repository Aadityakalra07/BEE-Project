// =============================================
// ADMIN SERVICE (Controller Layer - Client Side)
// =============================================
// Handles all admin-related API calls.
// Maps to server routes: /api/admin/* and /api/profile/admin/*
// Communicates with: adminController.js, profileController.js (server)
// =============================================

import API from './api';

// GET /api/admin/stats - Dashboard analytics
export const getAdminStats = () => {
  return API.get('/api/admin/stats');
};

// PUT /api/admin/approve-all - Approve all pending profiles
export const approveAll = () => {
  return API.put('/api/admin/approve-all');
};

// PUT /api/admin/suspend/:id - Toggle user suspension
export const toggleSuspend = (userId) => {
  return API.put(`/api/admin/suspend/${userId}`);
};

// GET /api/admin/export-csv - Export users as CSV
export const exportUsersCSV = () => {
  return API.get('/api/admin/export-csv', { responseType: 'blob' });
};

// GET /api/admin/verification-requests - Get pending verifications
export const getVerificationRequests = () => {
  return API.get('/api/admin/verification-requests');
};

// PUT /api/admin/verification/:id - Approve/reject verification
export const reviewVerification = (requestId, status, adminNote) => {
  return API.put(`/api/admin/verification/${requestId}`, { status, adminNote });
};

// GET /api/profile/admin/users - Get all users (admin)
export const adminGetAllUsers = () => {
  return API.get('/api/profile/admin/users');
};

// PUT /api/profile/admin/approve/:id - Approve a profile
export const adminApproveProfile = (userId) => {
  return API.put(`/api/profile/admin/approve/${userId}`);
};

// DELETE /api/profile/admin/user/:id - Delete a user
export const adminDeleteUser = (userId) => {
  return API.delete(`/api/profile/admin/user/${userId}`);
};

// GET /api/profile/admin/reported - Get reported profiles
export const adminGetReported = () => {
  return API.get('/api/profile/admin/reported');
};
