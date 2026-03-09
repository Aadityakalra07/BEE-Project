import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Spinner = () => (
  <div className="flex items-center justify-center min-h-[40vh]">
    <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const statusConfig = {
  pending:  { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  label: 'Pending' },
  accepted: { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  label: 'Accepted' },
  rejected: { bg: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-200',    label: 'Rejected' },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.pending;
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      {cfg.label}
    </span>
  );
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
      const [receivedRes, sentRes] = await Promise.all([
        axios.get('/api/interest/received'),
        axios.get('/api/interest/sent'),
      ]);
      setReceived(receivedRes.data);
      setSent(sentRes.data);
    } catch (err) {
      console.error('Error fetching interests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptReject = async (interestId, status) => {
    try {
      await axios.put(`/api/interest/${interestId}`, { status });
      fetchInterests();
    } catch (err) {
      console.error('Error updating interest:', err);
    }
  };

  if (loading) return <Spinner />;

  const currentList = tab === 'received' ? received : sent;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-7">
          <h1 className="text-2xl font-extrabold text-accent-dark">Interest Requests</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your received and sent interests</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-7 bg-white rounded-xl p-1 shadow-card w-fit">
          {[['received', `Received (${received.length})`], ['sent', `Sent (${sent.length})`]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                tab === key
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-gray-500 hover:text-accent-dark'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Cards */}
        {currentList.length > 0 ? (
          <div className="space-y-4">
            {currentList.map((interest) => {
              const person = tab === 'received' ? interest.sender : interest.receiver;
              const photoUrl = person?.photo
                ? `/uploads/${person.photo}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(person?.name || 'U')}&size=80&background=E63946&color=fff`;

              return (
                <div key={interest._id} className="bg-white rounded-2xl shadow-card p-5 flex items-center gap-4">
                  <img
                    src={photoUrl}
                    alt={person?.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-accent-dark truncate">
                      <Link to={`/profile/${person?._id}`} className="hover:text-brand-500 transition-colors">
                        {person?.name}
                      </Link>
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {[person?.age && `${person.age} yrs`, person?.city, person?.profession].filter(Boolean).join(' Â· ')}
                    </p>
                    <div className="mt-2">
                      <StatusBadge status={interest.status} />
                    </div>
                  </div>

                  {tab === 'received' && interest.status === 'pending' && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleAcceptReject(interest._id, 'accepted')}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-xl transition-all duration-200"
                      >
                        âœ“ Accept
                      </button>
                      <button
                        onClick={() => handleAcceptReject(interest._id, 'rejected')}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all duration-200"
                      >
                        âœ— Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-400">
            <div className="text-5xl mb-4">ðŸ’Œ</div>
            <h3 className="text-lg font-semibold text-gray-500">No {tab} interests yet</h3>
            <p className="text-sm mt-2">
              {tab === 'received'
                ? 'When someone sends you an interest, it will appear here.'
                : 'Browse profiles and send interests to connect!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Interests;
