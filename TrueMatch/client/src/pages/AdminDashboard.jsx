import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { ShimmerBlock } from '../components/Shimmer';
import {
  LineChart, Line, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';

/* ── Color Palette for Charts ── */
const COLORS = ['#C2185B', '#D4AF37', '#8B1A2B', '#E91E63', '#F0D778', '#B71C1C', '#FFB300', '#AD1457', '#F48FB1', '#880E4F'];

/* ── Stat Card ── */
const StatCard = ({ value, label, color, icon }) => (
  <div className="glass-card rounded-2xl p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className={`text-3xl font-display font-bold ${color}`}>{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{label}</p>
      </div>
      <span className="text-2xl">{icon}</span>
    </div>
  </div>
);

/* ── Verification Badges ── */
const VerifBadge = ({ level }) => {
  const cfg = {
    none: null,
    basic: { label: 'Basic', cls: 'bg-gray-100 dark:bg-gray-800 text-gray-500' },
    photo: { label: '📷 Photo', cls: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50' },
    id: { label: '🪪 ID', cls: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50' },
    premium: { label: '⭐ Premium', cls: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50' },
  };
  const c = cfg[level];
  if (!c) return null;
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.cls}`}>{c.label}</span>;
};

/* ── User Detail Modal ── */
const UserModal = ({ user, onClose }) => {
  if (!user) return null;
  const photo = user.photo
    ? `/uploads/${user.photo}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=200&background=8B1A2B&color=fff`;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-white dark:bg-dark-card rounded-3xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="relative h-48 bg-gradient-brand">
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50">✕</button>
        </div>
        <div className="px-6 pb-6 -mt-12">
          <img src={photo} alt={user.name} className="w-24 h-24 rounded-full object-cover ring-4 ring-white dark:ring-dark-card shadow-lg" />
          <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mt-3">{user.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {user.isApproved && <span className="badge-verified text-[10px]">Approved</span>}
            {user.isSuspended && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-200 dark:border-red-800/50">Suspended</span>}
            {user.isReported && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-500 border border-orange-200 dark:border-orange-800/50">Reported</span>}
            <VerifBadge level={user.verificationLevel} />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-5">
            {[
              { l: 'Gender', v: user.gender }, { l: 'Age', v: user.age },
              { l: 'Religion', v: user.religion }, { l: 'City', v: user.city },
              { l: 'Profession', v: user.profession }, { l: 'Education', v: user.education },
              { l: 'Joined', v: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-' },
              { l: 'Verification', v: user.verificationLevel || 'none' },
            ].map(({ l, v }) => (
              <div key={l} className="bg-surface-100 dark:bg-dark-bg rounded-xl p-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">{l}</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{v || '-'}</p>
              </div>
            ))}
          </div>
          {user.bio && <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 leading-relaxed">{user.bio}</p>}
        </div>
      </div>
    </div>
  );
};

/* ── Chart tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white dark:bg-dark-card shadow-lg rounded-xl px-3 py-2 border border-brand-100/30 dark:border-dark-border/30">
        <p className="text-xs font-semibold text-gray-900 dark:text-white">{label}</p>
        <p className="text-xs text-brand-600 dark:text-gold-400 font-bold">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
const USERS_PER_PAGE = 10;

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [usersRes, statsRes, verifRes] = await Promise.all([
        axios.get('/api/profile/admin/users'),
        axios.get('/api/admin/stats').catch(() => ({ data: null })),
        axios.get('/api/admin/verification-requests').catch(() => ({ data: [] })),
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
      setVerificationRequests(verifRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  /* ── Actions ── */
  const handleApprove = async (id) => {
    try { await axios.put(`/api/profile/admin/approve/${id}`); fetchAll(); } catch (e) { console.error(e); }
  };
  const handleDelete = async (id) => {
    if (window.confirm('Delete this user permanently?')) {
      try { await axios.delete(`/api/profile/admin/user/${id}`); fetchAll(); } catch (e) { console.error(e); }
    }
  };
  const handleSuspend = async (id) => {
    try { await axios.put(`/api/admin/suspend/${id}`); fetchAll(); } catch (e) { console.error(e); }
  };
  const handleApproveAll = async () => {
    if (window.confirm('Approve ALL pending profiles?')) {
      try { const res = await axios.put('/api/admin/approve-all'); setActionMsg(res.data.message); fetchAll(); } catch (e) { console.error(e); }
    }
  };
  const handleExportCSV = () => { window.open('/api/admin/export-csv', '_blank'); };
  const handleVerifReview = async (reqId, status) => {
    try { await axios.put(`/api/admin/verification/${reqId}`, { status }); fetchAll(); } catch (e) { console.error(e); }
  };

  /* ── Filtered + paginated users ── */
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter((u) =>
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.city || '').toLowerCase().includes(q) ||
      (u.religion || '').toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * USERS_PER_PAGE, currentPage * USERS_PER_PAGE);

  const pendingCount = users.filter((u) => !u.isApproved && u.isProfileComplete).length;
  const reportedCount = users.filter((u) => u.isReported).length;

  const tabs = [
    { key: 'overview', label: '📊 Overview' },
    { key: 'users', label: `👥 Users (${users.length})` },
    { key: 'verification', label: `✅ Verification (${verificationRequests.length})` },
  ];

  if (loading) return (
    <div className="min-h-screen bg-surface-100 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <ShimmerBlock key={i} height="h-24" className="rounded-2xl" />)}
        </div>
        <ShimmerBlock height="h-64" className="rounded-2xl" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-100 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage users, analytics, and verifications</p>
          </div>
          {/* Quick Actions */}
          <div className="flex gap-2 shrink-0">
            <button onClick={handleApproveAll} className="btn-primary text-xs !px-4 !py-2">✓ Approve All ({pendingCount})</button>
            <button onClick={handleExportCSV} className="btn-secondary text-xs !px-4 !py-2">📥 Export CSV</button>
          </div>
        </div>

        {actionMsg && (
          <div className="mb-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 text-sm px-4 py-3 rounded-xl">{actionMsg}</div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 glass-card rounded-xl p-1 w-fit">
          {tabs.map(({ key, label }) => (
            <button key={key} onClick={() => { setActiveTab(key); setCurrentPage(1); }}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === key ? 'bg-gradient-brand text-white shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}>{label}</button>
          ))}
        </div>

        {/* ═══ OVERVIEW TAB ═══ */}
        {activeTab === 'overview' && stats && (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
              <StatCard value={stats.totalUsers} label="Total Users" color="text-gray-900 dark:text-white" icon="👥" />
              <StatCard value={stats.approved} label="Approved" color="text-emerald-600 dark:text-emerald-400" icon="✅" />
              <StatCard value={stats.pending} label="Pending" color="text-amber-600 dark:text-amber-400" icon="⏳" />
              <StatCard value={stats.reported} label="Reported" color="text-red-500 dark:text-red-400" icon="🚩" />
              <StatCard value={stats.suspended} label="Suspended" color="text-orange-500 dark:text-orange-400" icon="🚫" />
              <StatCard value={stats.verificationPending} label="Verif. Pending" color="text-blue-600 dark:text-blue-400" icon="🔍" />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Line Chart — Registrations */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm mb-4">📈 Registrations (Last 30 Days)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={stats.registrations}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="count" stroke="#C2185B" strokeWidth={2.5} dot={{ r: 3, fill: '#C2185B' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart — Gender */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm mb-4">👤 Gender Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={stats.genderDist} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {stats.genderDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart — Religion */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm mb-4">🙏 Religion Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stats.religionDist}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {stats.religionDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart — City */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm mb-4">📍 Top Cities</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={stats.cityDist} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {stats.cityDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* ═══ USERS TAB ═══ */}
        {activeTab === 'users' && (
          <>
            {/* Search */}
            <div className="mb-5">
              <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="input-premium max-w-sm" placeholder="🔍 Search by name, email, city, religion..." />
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-brand-100/30 dark:border-dark-border/30">
                      {['Name', 'Email', 'Gender', 'City', 'Religion', 'Verification', 'Status', 'Actions'].map((h) => (
                        <th key={h} className="px-4 py-3.5 text-left label-premium !mb-0 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-50 dark:divide-dark-border/20">
                    {paginatedUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-brand-50/50 dark:hover:bg-dark-card/50 transition-colors cursor-pointer" onClick={() => setSelectedUser(u)}>
                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white whitespace-nowrap">{u.name}</td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{u.email}</td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{u.gender || '-'}</td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{u.city || '-'}</td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{u.religion || '-'}</td>
                        <td className="px-4 py-3"><VerifBadge level={u.verificationLevel} /></td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {u.isApproved ? <span className="badge-verified text-[9px]">Approved</span> : <span className="badge-pending text-[9px]">Pending</span>}
                            {u.isSuspended && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500">Suspended</span>}
                            {u.isReported && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-500">Reported</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1.5">
                            {!u.isApproved && u.isProfileComplete && (
                              <button onClick={() => handleApprove(u._id)} className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold rounded-lg transition-all">Approve</button>
                            )}
                            <button onClick={() => handleSuspend(u._id)} className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${u.isSuspended ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}>
                              {u.isSuspended ? 'Unsuspend' : 'Suspend'}
                            </button>
                            <button onClick={() => handleDelete(u._id)} className="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold rounded-lg transition-all">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="w-9 h-9 rounded-lg glass-card flex items-center justify-center disabled:opacity-30 text-gray-600 dark:text-gray-300 text-sm">←</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, currentPage - 3), currentPage + 2).map((p) => (
                  <button key={p} onClick={() => setCurrentPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-semibold ${currentPage === p ? 'bg-gradient-brand text-white' : 'glass-card text-gray-600 dark:text-gray-300'}`}>{p}</button>
                ))}
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="w-9 h-9 rounded-lg glass-card flex items-center justify-center disabled:opacity-30 text-gray-600 dark:text-gray-300 text-sm">→</button>
              </div>
            )}
          </>
        )}

        {/* ═══ VERIFICATION TAB ═══ */}
        {activeTab === 'verification' && (
          <>
            {verificationRequests.length > 0 ? (
              <div className="space-y-4">
                {verificationRequests.map((req) => {
                  const user = req.user;
                  const photo = user?.photo ? `/uploads/${user.photo}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&size=80&background=8B1A2B&color=fff`;
                  return (
                    <div key={req._id} className="glass-card rounded-2xl p-5 flex items-center gap-4">
                      <img src={photo} alt={user?.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-brand-100 dark:ring-brand-900 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display font-bold text-gray-900 dark:text-white">{user?.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-800/50">
                            {req.type === 'photo' ? '📷 Photo Verification' : '🪪 ID Verification'}
                          </span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</span>
                        </div>
                        {req.verificationCode && <p className="text-xs text-gray-400 mt-1">Code: <span className="font-mono font-bold text-brand-600 dark:text-gold-400">{req.verificationCode}</span></p>}
                      </div>
                      <a href={`/uploads/${req.documentPath}`} target="_blank" rel="noopener noreferrer"
                        className="btn-secondary text-xs !px-3 !py-2 shrink-0">View Doc</a>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => handleVerifReview(req._id, 'approved')} className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all">✓ Approve</button>
                        <button onClick={() => handleVerifReview(req._id, 'rejected')} className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all">✗ Reject</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-24 text-gray-400 dark:text-gray-600">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-lg font-display font-semibold text-gray-500 dark:text-gray-400">All caught up!</h3>
                <p className="text-sm mt-2">No pending verification requests.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
};

export default AdminDashboard;
