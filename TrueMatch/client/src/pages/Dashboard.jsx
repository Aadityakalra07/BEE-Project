import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProfileCard from '../components/ProfileCard';

const Spinner = () => (
  <div className="flex items-center justify-center min-h-[40vh]">
    <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, matchesRes] = await Promise.all([
          axios.get('/api/profile/me'),
          axios.get('/api/profile'),
        ]);
        setProfile(profileRes.data);
        setMatches(matchesRes.data.slice(0, 6));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner />;

  const photoUrl = profile?.photo
    ? `/uploads/${profile.photo}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&size=200&background=111827&color=fff`;

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Welcome bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {profile?.isApproved
                ? 'âœ… Your profile is approved and visible to others'
                : 'â³ Your profile is pending admin approval'}
            </p>
          </div>
          <Link
            to="/create-profile"
            className="shrink-0 text-sm font-semibold border border-gray-200 text-gray-900 hover:bg-gray-900 hover:text-white px-5 py-2.5 rounded-full transition-all duration-200"
          >
            Edit Profile
          </Link>
        </div>

        {/* Incomplete profile warning */}
        {!profile?.isProfileComplete && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3.5 rounded-xl flex items-center gap-3">
            <span className="text-xl">âš ï¸</span>
            <span>
              Your profile is incomplete.{' '}
              <Link to="/create-profile" className="font-semibold underline hover:text-amber-900">
                Complete it now
              </Link>{' '}
              to appear in search results.
            </span>
          </div>
        )}

        {/* Profile summary card */}
        {profile?.isProfileComplete && (
          <div className="bg-white rounded-2xl shadow-card p-6 mb-8 flex items-center gap-6">
            <img
              src={photoUrl}
              alt={profile.name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-gray-100 shrink-0"
            />
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-lg truncate">{profile.name}</h3>
              <p className="text-sm text-gray-500 mt-0.5">
                {profile.age} yrs &bull; {profile.religion} &bull; {profile.city}
              </p>
              <p className="text-sm text-gray-500">{profile.profession} &bull; {profile.education}</p>
            </div>
            <div className="ml-auto shrink-0 hidden sm:flex gap-3">
              <Link to="/search" className="text-sm font-semibold bg-gray-900 hover:bg-black text-white px-5 py-2 rounded-full transition-all duration-200">
                Browse Matches
              </Link>
            </div>
          </div>
        )}

        {/* Suggested Matches */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Suggested Matches</h2>
          <p className="text-sm text-gray-500">Profiles that might interest you</p>
        </div>

        {matches.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((m) => (
                <ProfileCard key={m._id} profile={m} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                to="/search"
                className="inline-block px-8 py-3 bg-gray-900 hover:bg-black text-white font-semibold rounded-full transition-all duration-200"
              >
                View All Profiles
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">ðŸ’”</div>
            <h3 className="text-lg font-semibold text-gray-500">No matches yet</h3>
            <p className="text-sm mt-1">New profiles are being added every day. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
