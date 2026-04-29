import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShimmerBlock } from '../components/Shimmer';

const Toggle = ({ checked, onChange, label }) => (
  <label className="flex items-center justify-between cursor-pointer group py-3 border-b border-brand-100/20 dark:border-dark-border/20 last:border-0">
    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{label}</span>
    <div className="relative">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <div className={`w-11 h-6 rounded-full transition-all duration-300 ${checked ? 'bg-gradient-brand' : 'bg-gray-200 dark:bg-gray-700'}`} />
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${checked ? 'translate-x-5' : ''}`} />
    </div>
  </label>
);

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('account');
  const [settings, setSettings] = useState(null);
  const [msg, setMsg] = useState({ text: '', type: '' });

  // Password change
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/settings');
        setSettings(res.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchSettings();
  }, []);

  const showMsg = (text, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 4000); };

  const handlePrivacyChange = async (field, value) => {
    try {
      await axios.put('/api/settings/privacy', { [field]: value });
      setSettings((s) => ({ ...s, [field]: value }));
      showMsg('Privacy settings updated');
    } catch (e) { showMsg(e.response?.data?.message || 'Error', 'error'); }
  };

  const handleNotifChange = async (field, value) => {
    try {
      const newNotifs = { ...settings.notifications, [field]: value };
      await axios.put('/api/settings/notifications', newNotifs);
      setSettings((s) => ({ ...s, notifications: newNotifs }));
      showMsg('Notification preferences updated');
    } catch (e) { showMsg(e.response?.data?.message || 'Error', 'error'); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) { showMsg('Passwords do not match', 'error'); return; }
    if (passwords.newPassword.length < 6) { showMsg('Password must be 6+ characters', 'error'); return; }
    try {
      const res = await axios.put('/api/settings/change-password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      showMsg(res.data.message);
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) { showMsg(e.response?.data?.message || 'Error changing password', 'error'); }
  };

  const handleUnblock = async (userId) => {
    try {
      await axios.put(`/api/settings/block/${userId}`);
      setSettings((s) => ({ ...s, blockedUsers: s.blockedUsers.filter((u) => u._id !== userId) }));
      showMsg('User unblocked');
    } catch (e) { showMsg(e.response?.data?.message || 'Error', 'error'); }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure? This will permanently delete your account and all data. This cannot be undone.')) return;
    if (!window.confirm('FINAL WARNING: All your profile data, messages, and interests will be deleted forever.')) return;
    try {
      await axios.delete('/api/settings/account');
      logout();
      navigate('/');
    } catch (e) { showMsg(e.response?.data?.message || 'Error deleting account', 'error'); }
  };

  const handleDownloadData = () => { window.open('/api/settings/download-data', '_blank'); };

  const tabs = [
    { key: 'account', label: '👤 Account', icon: '👤' },
    { key: 'privacy', label: '🔒 Privacy', icon: '🔒' },
    { key: 'notifications', label: '🔔 Notifications', icon: '🔔' },
    { key: 'blocked', label: '🚫 Blocked', icon: '🚫' },
  ];

  if (loading) return (
    <div className="min-h-screen bg-surface-100 dark:bg-dark-bg py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <ShimmerBlock height="h-10" className="w-48" />
        <ShimmerBlock height="h-64" className="rounded-2xl" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-100 dark:bg-dark-bg py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account, privacy, and preferences</p>
        </div>

        {msg.text && (
          <div className={`mb-5 text-sm px-4 py-3 rounded-xl border ${msg.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400'}`}>{msg.text}</div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 glass-card rounded-xl p-1 w-fit">
          {tabs.map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === key ? 'bg-gradient-brand text-white shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>{label}</button>
          ))}
        </div>

        {/* ═══ ACCOUNT TAB ═══ */}
        {activeTab === 'account' && (
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-display font-bold text-gray-900 dark:text-white mb-1">Account Info</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Your email and account details</p>
              <div className="bg-surface-100 dark:bg-dark-bg rounded-xl p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{user?.email || settings?.email}</p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-display font-bold text-gray-900 dark:text-white mb-1">Change Password</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Update your password regularly for security</p>
              <form onSubmit={handlePasswordChange} className="space-y-3">
                <input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} className="input-premium" placeholder="Current Password" />
                <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} className="input-premium" placeholder="New Password (6+ characters)" />
                <input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} className="input-premium" placeholder="Confirm New Password" />
                <button type="submit" className="btn-primary text-sm">Update Password</button>
              </form>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-display font-bold text-gray-900 dark:text-white mb-1">Data & Account</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Download or delete your data</p>
              <div className="flex flex-wrap gap-3">
                <button onClick={handleDownloadData} className="btn-secondary text-sm">📥 Download My Data</button>
                <button onClick={handleDeleteAccount} className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-full transition-all">🗑️ Delete Account</button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ PRIVACY TAB ═══ */}
        {activeTab === 'privacy' && settings && (
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-display font-bold text-gray-900 dark:text-white mb-1">Privacy Settings</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Control who can see your profile</p>
            <Toggle label="Hide profile from search results" checked={settings.isHidden || false} onChange={(e) => handlePrivacyChange('isHidden', e.target.checked)} />
            <div className="py-3">
              <label className="label-premium">Who can see your photos</label>
              <select value={settings.photoVisibility || 'everyone'} onChange={(e) => handlePrivacyChange('photoVisibility', e.target.value)} className="input-premium mt-1">
                <option value="everyone">Everyone</option>
                <option value="interests">People I've exchanged interests with</option>
                <option value="accepted">Only accepted connections</option>
              </select>
            </div>
          </div>
        )}

        {/* ═══ NOTIFICATIONS TAB ═══ */}
        {activeTab === 'notifications' && settings && (
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-display font-bold text-gray-900 dark:text-white mb-1">Notification Preferences</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Choose what you want to be notified about</p>
            <Toggle label="Email notifications" checked={settings.notifications?.email ?? true} onChange={(e) => handleNotifChange('email', e.target.checked)} />
            <Toggle label="Push notifications" checked={settings.notifications?.push ?? true} onChange={(e) => handleNotifChange('push', e.target.checked)} />
            <Toggle label="Interest notifications" checked={settings.notifications?.interests ?? true} onChange={(e) => handleNotifChange('interests', e.target.checked)} />
            <Toggle label="Message notifications" checked={settings.notifications?.messages ?? true} onChange={(e) => handleNotifChange('messages', e.target.checked)} />
          </div>
        )}

        {/* ═══ BLOCKED USERS TAB ═══ */}
        {activeTab === 'blocked' && settings && (
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-display font-bold text-gray-900 dark:text-white mb-1">Blocked Users</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Users you've blocked can't see your profile or contact you</p>
            {settings.blockedUsers?.length > 0 ? (
              <div className="space-y-3">
                {settings.blockedUsers.map((u) => (
                  <div key={u._id} className="flex items-center justify-between bg-surface-100 dark:bg-dark-bg rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <img src={u.photo ? `/uploads/${u.photo}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&size=40&background=8B1A2B&color=fff`} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{u.name}</span>
                    </div>
                    <button onClick={() => handleUnblock(u._id)} className="text-xs font-semibold text-brand-600 dark:text-gold-400 hover:underline">Unblock</button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-8">You haven't blocked anyone.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
