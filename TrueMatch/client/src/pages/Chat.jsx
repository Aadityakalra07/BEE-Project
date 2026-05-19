// =============================================
// CHAT PAGE (View Layer)
// =============================================
// In-app messaging between matched users.
// Only users with accepted interests can chat.
// Uses: messageService.js (Controller layer)
// =============================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getConversations, getMessages, sendMessage } from '../services/messageService';

/* ── Icons ── */
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
  </svg>
);

const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChatBubbleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 text-brand-200 dark:text-dark-border">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
  </svg>
);

/* ── Time formatter ── */
const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  if (days < 7) return date.toLocaleDateString('en-IN', { weekday: 'short' });
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
};

const formatMessageTime = (dateStr) => {
  return new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

/* ── Date separator ── */
const formatDateSeparator = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};

/* ── Avatar helper ── */
const getAvatar = (user) => {
  if (user?.photo) return `/uploads/${user.photo}`;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&size=80&background=8B1A2B&color=fff`;
};

/* ══════════════════════════════════════════════
   CONVERSATION LIST SIDEBAR
   ══════════════════════════════════════════════ */
const ConversationList = ({ conversations, activeUserId, onSelect, loading }) => {
  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-2xl">
            <div className="shimmer w-12 h-12 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="shimmer h-4 w-24 rounded-lg" />
              <div className="shimmer h-3 w-36 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 px-6 text-center">
        <ChatBubbleIcon />
        <h3 className="text-base font-display font-semibold text-gray-500 dark:text-gray-400 mt-4">No conversations yet</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 max-w-[200px]">
          Accept interests to start chatting with your matches!
        </p>
        <Link to="/interests" className="btn-primary text-xs mt-5 !px-5 !py-2.5">
          View Interests
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full" style={{ scrollbarWidth: 'thin' }}>
      <div className="p-3 space-y-1">
        {conversations.map((conv) => {
          const other = conv.otherUser;
          const isActive = other?._id === activeUserId;

          return (
            <button
              key={conv._id}
              onClick={() => onSelect(other)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 text-left group ${
                isActive
                  ? 'bg-gradient-to-r from-brand-50 to-brand-100/50 dark:from-brand-900/30 dark:to-brand-800/20 shadow-sm'
                  : 'hover:bg-brand-50/50 dark:hover:bg-dark-card/50'
              }`}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={getAvatar(other)}
                  alt={other?.name}
                  className={`w-12 h-12 rounded-full object-cover ring-2 transition-all ${
                    isActive ? 'ring-brand-400 dark:ring-gold-400' : 'ring-brand-100 dark:ring-dark-border'
                  }`}
                />
                {conv.unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-dark-bg">
                    {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-semibold truncate ${
                    isActive ? 'text-brand-700 dark:text-gold-400' : 'text-gray-900 dark:text-white'
                  }`}>
                    {other?.name}
                  </h4>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0 ml-2">
                    {formatTime(conv.updatedAt)}
                  </span>
                </div>
                <p className={`text-xs mt-0.5 truncate ${
                  conv.unreadCount > 0
                    ? 'text-gray-700 dark:text-gray-300 font-medium'
                    : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {conv.lastMessageSender?._id === conv.otherUser?._id ? '' : 'You: '}
                  {conv.lastMessage || 'Start a conversation...'}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   MESSAGE THREAD
   ══════════════════════════════════════════════ */
const MessageThread = ({ chatUser, messages, onSend, sending, onBack }) => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat user changes
  useEffect(() => {
    inputRef.current?.focus();
  }, [chatUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    onSend(text.trim());
    setText('');
  };

  // Group messages by date
  const groupedMessages = [];
  let lastDate = '';
  messages.forEach((msg) => {
    const msgDate = new Date(msg.createdAt).toDateString();
    if (msgDate !== lastDate) {
      groupedMessages.push({ type: 'date', date: msg.createdAt });
      lastDate = msgDate;
    }
    groupedMessages.push({ type: 'message', ...msg });
  });

  if (!chatUser) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center h-full bg-surface-100/50 dark:bg-dark-bg/50">
        <ChatBubbleIcon />
        <h3 className="text-lg font-display font-semibold text-gray-400 dark:text-gray-500 mt-4">Select a conversation</h3>
        <p className="text-sm text-gray-300 dark:text-gray-600 mt-1">Choose someone from the left to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* ── Chat Header ── */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-brand-100/30 dark:border-dark-border/30 bg-white/70 dark:bg-dark-card/70 backdrop-blur-xl shrink-0">
        <button onClick={onBack} className="md:hidden p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-dark-bg transition-colors">
          <BackIcon />
        </button>
        <Link to={`/profile/${chatUser._id}`} className="flex items-center gap-3 flex-1 min-w-0 group">
          <img
            src={getAvatar(chatUser)}
            alt={chatUser.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-100 dark:ring-dark-border group-hover:ring-brand-400 dark:group-hover:ring-gold-400 transition-all"
          />
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-gold-400 transition-colors">
              {chatUser.name}
            </h3>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">Tap to view profile</p>
          </div>
        </Link>
      </div>

      {/* ── Messages Area ── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-1 bg-surface-100/30 dark:bg-dark-bg/30" style={{ scrollbarWidth: 'thin' }}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <div className="w-16 h-16 rounded-full bg-brand-50 dark:bg-dark-card flex items-center justify-center text-3xl mb-3">
              👋
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Say hello to {chatUser.name}!</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Start your conversation below</p>
          </div>
        )}

        {groupedMessages.map((item, i) => {
          if (item.type === 'date') {
            return (
              <div key={`date-${i}`} className="flex items-center justify-center py-3">
                <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm px-3 py-1 rounded-full border border-brand-100/20 dark:border-dark-border/20">
                  {formatDateSeparator(item.date)}
                </span>
              </div>
            );
          }

          const isMine = item.sender === user?._id || item.sender?._id === user?._id;

          return (
            <div key={item._id || i} className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-1`}>
              <div
                className={`max-w-[75%] sm:max-w-[65%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed transition-all ${
                  isMine
                    ? 'bg-gradient-to-br from-brand-600 to-brand-700 text-white rounded-br-md shadow-sm'
                    : 'bg-white dark:bg-dark-card text-gray-800 dark:text-gray-200 rounded-bl-md shadow-sm border border-brand-100/10 dark:border-dark-border/20'
                }`}
              >
                <p className="break-words whitespace-pre-wrap">{item.text}</p>
                <p className={`text-[9px] mt-1.5 text-right ${
                  isMine ? 'text-white/60' : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {formatMessageTime(item.createdAt)}
                  {isMine && (
                    <span className="ml-1">{item.read ? '✓✓' : '✓'}</span>
                  )}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Message Input ── */}
      <div className="shrink-0 px-4 sm:px-6 py-3 border-t border-brand-100/30 dark:border-dark-border/30 bg-white/70 dark:bg-dark-card/70 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Type a message..."
              rows={1}
              className="w-full resize-none bg-surface-100 dark:bg-dark-bg border border-brand-100/30 dark:border-dark-border/30 rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:focus:ring-brand-400/20 focus:border-brand-400 transition-all"
              style={{ maxHeight: '120px', minHeight: '44px' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!text.trim() || sending}
            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
              text.trim()
                ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-glow hover:shadow-lg hover:scale-105 active:scale-95'
                : 'bg-brand-100 dark:bg-dark-border text-brand-300 dark:text-gray-600 cursor-not-allowed'
            }`}
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <SendIcon />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   MAIN CHAT PAGE
   ══════════════════════════════════════════════ */
const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Poll for new messages every 5 seconds
  useEffect(() => {
    if (!chatUser) return;
    const interval = setInterval(() => {
      fetchMessages(chatUser._id, true);
    }, 5000);
    return () => clearInterval(interval);
  }, [chatUser]);

  // If userId is in URL, open that chat
  useEffect(() => {
    if (userId && conversations.length > 0) {
      const conv = conversations.find((c) => c.otherUser?._id === userId);
      if (conv?.otherUser) {
        handleSelectUser(conv.otherUser);
      } else {
        // User might not have a conversation yet — create a placeholder
        handleSelectUser({ _id: userId, name: 'Loading...', photo: '' });
        // Try to fetch their profile
        import('../services/profileService').then(({ getProfileById }) => {
          getProfileById(userId).then((res) => {
            setChatUser(res.data);
            setShowSidebar(false);
          }).catch(() => {});
        });
      }
    }
  }, [userId, conversations]);

  const fetchConversations = async () => {
    try {
      setLoadingConvos(true);
      const res = await getConversations();
      setConversations(res.data);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoadingConvos(false);
    }
  };

  const fetchMessages = useCallback(async (otherUserId, silent = false) => {
    try {
      if (!silent) setLoadingMsgs(true);
      const res = await getMessages(otherUserId);
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      if (!silent) setLoadingMsgs(false);
    }
  }, []);

  const handleSelectUser = (otherUser) => {
    setChatUser(otherUser);
    setShowSidebar(false);
    fetchMessages(otherUser._id);
    navigate(`/chat/${otherUser._id}`, { replace: true });
  };

  const handleSend = async (text) => {
    if (!chatUser) return;
    try {
      setSending(true);
      await sendMessage(chatUser._id, text);
      // Refresh messages and conversations
      await fetchMessages(chatUser._id, true);
      fetchConversations();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to send message';
      alert(errMsg);
    } finally {
      setSending(false);
    }
  };

  const handleBack = () => {
    setShowSidebar(true);
    setChatUser(null);
    navigate('/chat', { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface-100 dark:bg-dark-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
            💬 Messages
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Chat with your accepted matches
          </p>
        </div>

        {/* Chat Container */}
        <div className="glass-card rounded-2xl overflow-hidden" style={{ height: 'calc(100vh - 240px)', minHeight: '500px' }}>
          <div className="flex h-full">
            {/* ── Left: Conversation List ── */}
            <div className={`${
              showSidebar ? 'flex' : 'hidden'
            } md:flex flex-col w-full md:w-80 lg:w-96 border-r border-brand-100/20 dark:border-dark-border/20 bg-white/50 dark:bg-dark-card/30 shrink-0`}>
              {/* Search / Header */}
              <div className="px-4 py-3.5 border-b border-brand-100/20 dark:border-dark-border/20 shrink-0">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Conversations
                  {conversations.length > 0 && (
                    <span className="ml-2 text-xs font-normal text-gray-400 dark:text-gray-500">
                      ({conversations.length})
                    </span>
                  )}
                </h2>
              </div>

              {/* Conversation items */}
              <ConversationList
                conversations={conversations}
                activeUserId={chatUser?._id}
                onSelect={handleSelectUser}
                loading={loadingConvos}
              />
            </div>

            {/* ── Right: Message Thread ── */}
            <div className={`${
              !showSidebar ? 'flex' : 'hidden'
            } md:flex flex-col flex-1 min-w-0`}>
              {loadingMsgs ? (
                <div className="flex items-center justify-center h-full">
                  <div className="relative w-10 h-10">
                    <div className="absolute inset-0 border-[3px] border-brand-200 dark:border-dark-border rounded-full" />
                    <div className="absolute inset-0 border-[3px] border-brand-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                </div>
              ) : (
                <MessageThread
                  chatUser={chatUser}
                  messages={messages}
                  onSend={handleSend}
                  sending={sending}
                  onBack={handleBack}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
