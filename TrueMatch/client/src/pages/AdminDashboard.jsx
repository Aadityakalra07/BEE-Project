import { useState, useEffect } from 'react';
import axios from 'axios';

const Spinner = () => (
  <div className="flex items-center justify-center min-h-[40vh]">
    <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const StatCard = ({ value, label, color }) => (
  <div className="bg-white rounded-2xl shadow-card p-6">
    <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
    <p className="text-sm text-gray-500 mt-1">{label}</p>
  </div>
);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [reported, setReported] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, reportedRes] = await Promise.all([
        axios.get('/api/profile/admin/users'),
        axios.get('/api/profile/admin/reported'),
      ]);
      setUsers(usersRes.data);
      setReported(reportedRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`/api/profile/admin/approve/${id}`);
      fetchData();
    } catch (err) {
      console.error('Error approving:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      try {
        await axios.delete(`/api/profile/admin/user/${id}`);
        fetchData();
      } catch (err) {
        console.error('Error deleting:', err);
      }
    }
  };

  if (loading) return <Spinner />;

  const pendingUsers = users.filter((u) => !u.isApproved && u.isProfileComplete);
  const displayUsers =
    activeTab === 'pending' ? pendingUsers :
    activeTab === 'reported' ? reported :
    users;

  const tabs = [
    { key: 'all', label: 'All Users' },
    { key: 'pending', label: `Pending (${pendingUsers.length})` },
    { key: 'reported', label: `Reported (${reported.length})` },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-accent-dark">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all users and profiles</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-9">
          <StatCard value={users.length} label="Total Users" color="text-accent-dark" />
          <StatCard value={users.filter((u) => u.isApproved).length} label="Approved Profiles" color="text-green-600" />
          <StatCard value={pendingUsers.length} label="Pending Approval" color="text-amber-600" />
          <StatCard value={reported.length} label="Reported Profiles" color="text-red-500" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-card w-fit">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                activeTab === key
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-gray-500 hover:text-accent-dark'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Table */}
        {displayUsers.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Name', 'Email', 'Gender', 'City', 'Religion', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {displayUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-4 font-semibold text-accent-dark">{u.name}</td>
                      <td className="px-5 py-4 text-gray-500">{u.email}</td>
                      <td className="px-5 py-4 text-gray-500">{u.gender || '-'}</td>
                      <td className="px-5 py-4 text-gray-500">{u.city || '-'}</td>
                      <td className="px-5 py-4 text-gray-500">{u.religion || '-'}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {u.isApproved ? (
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                              Approved
                            </span>
                          ) : (
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                              Pending
                            </span>
                          )}
                          {u.isReported && (
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200">
                              Reported
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {!u.isApproved && u.isProfileComplete && (
                            <button
                              onClick={() => handleApprove(u._id)}
                              className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-all duration-200"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(u._id)}
                            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-all duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-24 text-gray-400">
            <div className="text-5xl mb-4">ðŸ“­</div>
            <h3 className="text-lg font-semibold text-gray-500">No users in this category</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
