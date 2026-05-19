// =============================================
// INTEREST SERVICE (Controller Layer - Client Side)
// =============================================
// Handles all interest-related API calls.
// Maps to server routes: /api/interest/*
// Communicates with: interestController.js (server)
// =============================================

import API from './api';

// POST /api/interest/:receiverId - Send interest to a user
export const sendInterest = (receiverId) => {
  return API.post(`/api/interest/${receiverId}`);
};

// GET /api/interest/received - Get interests received by me
export const getReceivedInterests = () => {
  return API.get('/api/interest/received');
};

// GET /api/interest/sent - Get interests I sent
export const getSentInterests = () => {
  return API.get('/api/interest/sent');
};

// PUT /api/interest/:interestId - Accept or reject interest
export const updateInterestStatus = (interestId, status) => {
  return API.put(`/api/interest/${interestId}`, { status });
};
