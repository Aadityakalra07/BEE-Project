import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ShimmerProfileRow } from '../components/Shimmer';

const statusConfig = {
  pending:  { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800/50', label: 'Pending' },
  accepted: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800/50', label: 'Accepted' },
  rejected: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-800/50', label: 'Rejected' },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.pending;
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>{cfg.label}</span>;
};

const Interests = () => {
  const [tab, setTab] = useState('received');
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchInterests(); }, []);

  const fetchInterests = async () => {
    try {
      setLoading(true);
      const [receivedRes, sentRes] = await Promise.all([axios.get('/api/interest/received'), axios.get('/api/interest/sent')]);
      setReceived(receivedRes.data); setSent(sentRes.data);
    } catch (err) { console.error('Error fetching interests:', err); }
    finally { setLoading(false); }
  };

  const handleAcceptReject = async (interestId, status) => {
    try { await axios.put(`/api/interest/${interestId}`, { status }); fetchInterests(); }
    catch (err) { console.error('Error updating interest:', err); }
  };

  if (loading) return (
    <div className="min-h-screen bg-surface-100 dark:bg-dark-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-4">
        <div className="shimmer h-10 w-48 rounded-xl" />
        {Array.from({ length: 4 }).map((_, i) => <ShimmerProfileRow key={i} />)}
      </div>
    </div>
  );

  const currentList = tab === 'received' ? received : sent;

  return (
    <div className="min-h-screen bg-surface-100 dark:bg-dark-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-7">
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Interest Requests</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your received and sent interests</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-7 glass-card rounded-xl p-1 w-fit">
          {[['received', `Received (${received.length})`], ['sent', `Sent (${sent.length})`]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                tab === key ? 'bg-gradient-brand text-white shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}>{label}</button>
          ))}
        </div>

        {currentList.length > 0 ? (
          <div className="space-y-4">
            {currentList.map((interest) => {
              const person = tab === 'received' ? interest.sender : interest.receiver;
              const photoUrl = person?.photo
                ? `/uploads/${person.photo}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(person?.name || 'U')}&size=80&background=8B1A2B&color=fff`;
              return (
                <div key={interest._id} className="glass-card rounded-2xl p-5 flex items-center gap-4">
                  <img src={photoUrl} alt={person?.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-brand-100 dark:ring-brand-900 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-bold text-gray-900 dark:text-white truncate">
                      <Link to={`/profile/${person?._id}`} className="hover:text-brand-500 dark:hover:text-gold-400 transition-colors">{person?.name}</Link>
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {[person?.age && `${person.age} yrs`, person?.city, person?.profession].filter(Boolean).join(' · ')}
                    </p>
                    <div className="mt-2"><StatusBadge status={interest.status} /></div>
                  </div>
                  {tab === 'received' && interest.status === 'pending' && (
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleAcceptReject(interest._id, 'accepted')} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all">✓ Accept</button>
                      <button onClick={() => handleAcceptReject(interest._id, 'rejected')} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all">✗ Reject</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-400 dark:text-gray-600">
            <div className="text-5xl mb-4">💌</div>
            <h3 className="text-lg font-display font-semibold text-gray-500 dark:text-gray-400">No {tab} interests yet</h3>
            <p className="text-sm mt-2">{tab === 'received' ? 'When someone sends you an interest, it will appear here.' : 'Browse profiles and send interests to connect!'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Interests;
