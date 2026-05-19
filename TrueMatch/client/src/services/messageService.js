// =============================================
// MESSAGE SERVICE (Controller Layer - Client Side)
// =============================================
// Handles all messaging-related API calls.
// Maps to server routes: /api/messages/*
// Communicates with: messageController.js (server)
// =============================================

import API from './api';

// GET /api/messages/conversations - List all conversations
export const getConversations = () => {
  return API.get('/api/messages/conversations');
};

// GET /api/messages/:userId - Get messages with a specific user
export const getMessages = (userId) => {
  return API.get(`/api/messages/${userId}`);
};

// POST /api/messages/:userId - Send message to a user
export const sendMessage = (userId, text) => {
  return API.post(`/api/messages/${userId}`, { text });
};

// GET /api/messages/unread/count - Get total unread count
export const getUnreadCount = () => {
  return API.get('/api/messages/unread/count');
};
