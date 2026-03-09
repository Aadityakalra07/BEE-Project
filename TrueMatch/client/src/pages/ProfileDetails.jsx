import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Spinner = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex items-start gap-4 py-3.5 border-b border-gray-100 last:border-0">
    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-28 shrink-0 mt-0.5">{label}</span>
    <span className="text-sm text-accent-dark font-medium">{value || 'Not specified'}</span>
  </div>
);

const ProfileDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/profile/${id}`);
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleSendInterest = async () => {
    try {
      const res = await axios.post(`/api/interest/${id}`);
      setMessage({ text: res.data.message, type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Error sending interest', type: 'error' });
    }
  };

  const handleToggleFavourite = async () => {
    try {
      const res = await axios.put(`/api/profile/favourite/${id}`);
      setMessage({ text: res.data.message, type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Error updating favourites', type: 'error' });
    }
  };

  const handleReport = async () => {
    if (window.confirm('Are you sure you want to report this profile?')) {
      try {
        const res = await axios.put(`/api/profile/report/${id}`);
        setMessage({ text: res.data.message, type: 'success' });
      } catch (err) {
        setMessage({ text: err.response?.data?.message || 'Error reporting profile', type: 'error' });
      }
    }
  };

  if (loading) return <Spinner />;
  if (!profile) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-400">
      <div className="text-5xl mb-4">ðŸ”</div>
      <p className="text-lg font-semibold">Profile not found</p>
    </div>
  );

  const photoUrl = profile.photo
    ? `/uploads/${profile.photo}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=300&background=E63946&color=fff`;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-accent-dark transition-colors"
        >
          â† Back
        </button>

        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {/* Hero banner */}
          <div className="h-36 bg-gradient-to-r from-accent-dark to-accent" />

          {/* Profile header */}
          <div className="px-8 pb-6">
            <div className="-mt-16 mb-4">
              <img
                src={photoUrl}
                alt={profile.name}
                className="w-32 h-32 rounded-full object-cover ring-4 ring-white shadow-md"
              />
            </div>

            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl font-extrabold text-accent-dark">{profile.name}</h2>
                <p className="text-gray-500 text-sm mt-1">
                  {profile.age} years &bull; {profile.gender} &bull; {profile.city}
                </p>
              </div>
              {profile.isApproved && (
                <span className="bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  âœ“ Verified Profile
                </span>
              )}
            </div>

            {message.text && (
              <div className={`mt-4 text-sm px-4 py-3 rounded-xl border ${
                message.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {message.text}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="px-8 pb-6 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-6 mb-2">Profile Details</h3>
            <DetailRow label="Religion" value={profile.religion} />
            <DetailRow label="Caste" value={profile.caste} />
            <DetailRow label="Education" value={profile.education} />
            <DetailRow label="Profession" value={profile.profession} />
            <DetailRow label="City" value={profile.city} />
            <DetailRow label="Member Since" value={new Date(profile.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })} />

            {profile.bio && (
              <div className="mt-5 p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">About</p>
                <p className="text-sm text-gray-600 leading-relaxed">{profile.bio}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          {user && user._id !== profile._id && (
            <div className="px-8 pb-8 flex flex-wrap gap-3">
              <button
                onClick={handleSendInterest}
                className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
              >
                ðŸ’Œ Send Interest
              </button>
              <button
                onClick={handleToggleFavourite}
                className="px-6 py-2.5 border border-accent text-accent hover:bg-accent hover:text-white text-sm font-semibold rounded-xl transition-all duration-200"
              >
                â­ Favourite
              </button>
              <button
                onClick={handleReport}
                className="px-5 py-2.5 border border-red-200 text-red-500 hover:bg-red-50 text-sm font-semibold rounded-xl transition-all duration-200 ml-auto"
              >
                ðŸš© Report
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
