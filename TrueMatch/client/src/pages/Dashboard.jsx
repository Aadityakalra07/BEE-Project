import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProfileCard from '../components/ProfileCard';
import { ShimmerBlock, ShimmerGrid } from '../components/Shimmer';

/* ── Progress Ring SVG ── */
const ProgressRing = ({ percent, size = 120, stroke = 8 }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="currentColor" strokeWidth={stroke}
          className="text-brand-100 dark:text-dark-border" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="url(#progressGradient)" strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B1A2B" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-display font-bold text-gray-900 dark:text-white">{percent}%</span>
        <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Complete</span>
      </div>
    </div>
  );
};

/* ── Stat Card ── */
const StatCard = ({ icon, value, label, color }) => (
  <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
    </div>
  </div>
);

/* ── Activity Item ── */
const ActivityItem = ({ text, time, icon }) => (
  <div className="flex items-start gap-3 py-3 border-b border-brand-50/50 dark:border-dark-border/30 last:border-0">
    <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-dark-card flex items-center justify-center text-sm shrink-0 mt-0.5">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-gray-700 dark:text-gray-300">{text}</p>
      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{time}</p>
    </div>
  </div>
);

/* ── Horizontal Scroll Card (mini) ── */
const MiniProfileCard = ({ profile }) => {
  const photoUrl = profile.photo
    ? `/uploads/${profile.photo}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=120&background=8B1A2B&color=fff`;
  return (
    <Link to={`/profile/${profile._id}`}
      className="shrink-0 w-36 group">
      <div className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-card group-hover:shadow-card-hover transition-all duration-300">
        <div className="h-28 overflow-hidden">
          <img src={photoUrl} alt={profile.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        </div>
        <div className="p-2.5">
          <p className="text-xs font-display font-bold text-gray-900 dark:text-white truncate">{profile.name}</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500">{profile.age ? `${profile.age} yrs` : ''} {profile.city ? `· ${profile.city}` : ''}</p>
        </div>
      </div>
    </Link>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [allProfiles, setAllProfiles] = useState([]);
  const [receivedInterests, setReceivedInterests] = useState([]);
  const [sentInterests, setSentInterests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, profilesRes, receivedRes, sentRes] = await Promise.all([
          axios.get('/api/profile/me'),
          axios.get('/api/profile/compatible').catch(() => axios.get('/api/profile')),
          axios.get('/api/interest/received').catch(() => ({ data: [] })),
          axios.get('/api/interest/sent').catch(() => ({ data: [] })),
        ]);
        setProfile(profileRes.data);
        setAllProfiles(profilesRes.data);
        setReceivedInterests(receivedRes.data);
        setSentInterests(sentRes.data);
      } catch (err) { console.error('Dashboard fetch error:', err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  /* ── Profile completion % ── */
  const completionPercent = useMemo(() => {
    if (!profile) return 0;
    const fields = ['name', 'age', 'gender', 'religion', 'caste', 'profession', 'education', 'city', 'bio', 'photo'];
    const filled = fields.filter((f) => profile[f] && String(profile[f]).trim() !== '').length;
    return Math.round((filled / fields.length) * 100);
  }, [profile]);

  /* ── Stats ── */
  const matchCount = useMemo(() =>
    receivedInterests.filter((i) => i.status === 'accepted').length +
    sentInterests.filter((i) => i.status === 'accepted').length
  , [receivedInterests, sentInterests]);

  // Simulated profile views (seeded from user ID)
  const profileViews = useMemo(() => {
    if (!user?._id) return 0;
    return 12 + (user._id.charCodeAt(0) % 50);
  }, [user]);

  /* ── Recently viewed (simulated — last 5 browsed) ── */
  const recentlyViewed = useMemo(() => allProfiles.slice(0, 5), [allProfiles]);

  /* ── New members (newest profiles) ── */
  const newMembers = useMemo(() =>
    [...allProfiles].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8)
  , [allProfiles]);

  /* ── Activity feed (generated from real interests) ── */
  const activityFeed = useMemo(() => {
    const items = [];
    receivedInterests.slice(0, 3).forEach((i) => {
      const name = i.sender?.name || 'Someone';
      if (i.status === 'pending') items.push({ text: `${name} sent you an interest`, time: new Date(i.createdAt).toLocaleDateString(), icon: '💌' });
      if (i.status === 'accepted') items.push({ text: `You accepted ${name}'s interest`, time: new Date(i.createdAt).toLocaleDateString(), icon: '✅' });
    });
    sentInterests.slice(0, 2).forEach((i) => {
      const name = i.receiver?.name || 'Someone';
      items.push({ text: `You sent interest to ${name}`, time: new Date(i.createdAt).toLocaleDateString(), icon: '💌' });
    });
    if (items.length === 0) {
      items.push({ text: 'Welcome to TrueMatch! Complete your profile to get started.', time: 'Just now', icon: '👋' });
    }
    return items.slice(0, 5);
  }, [receivedInterests, sentInterests]);

  /* ── Suggested matches (top 6) ── */
  const suggestedMatches = useMemo(() => allProfiles.slice(0, 6), [allProfiles]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-100 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => <ShimmerBlock key={i} height="h-24" className="rounded-2xl" />)}
          </div>
          <ShimmerBlock height="h-40" className="rounded-2xl" />
          <ShimmerGrid count={6} />
        </div>
      </div>
    );
  }

  const photoUrl = profile?.photo
    ? `/uploads/${profile.photo}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&size=200&background=8B1A2B&color=fff`;

  return (
    <div className="min-h-screen bg-surface-100 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ═══ WELCOME HEADER ═══ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {profile?.isApproved ? '✅ Your profile is approved and visible' : '⏳ Profile pending admin approval'}
            </p>
          </div>
          <Link to="/create-profile" className="btn-secondary shrink-0 text-sm">Edit Profile</Link>
        </div>

        {/* Incomplete warning */}
        {!profile?.isProfileComplete && (
          <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 text-sm px-4 py-3.5 rounded-xl flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <span>Your profile is incomplete. <Link to="/create-profile" className="font-semibold underline">Complete it now</Link> to appear in search.</span>
          </div>
        )}

        {/* ═══ PROFILE CARD + STATS ROW ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile summary + progress ring */}
          <div className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 lg:col-span-1">
            <ProgressRing percent={completionPercent} />
            <div className="text-center sm:text-left">
              <img src={photoUrl} alt={profile?.name} className="w-16 h-16 rounded-full object-cover ring-4 ring-brand-100 dark:ring-brand-900 mx-auto sm:mx-0 mb-3" />
              <h3 className="font-display font-bold text-gray-900 dark:text-white truncate">{profile?.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {profile?.age ? `${profile.age} yrs` : ''} {profile?.city ? `· ${profile.city}` : ''}
              </p>
              {completionPercent < 100 && (
                <Link to="/create-profile" className="inline-block text-xs text-brand-600 dark:text-gold-400 font-semibold mt-2 hover:underline">
                  Complete Profile →
                </Link>
              )}
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-4 lg:col-span-2">
            <StatCard icon="👁️" value={profileViews} label="Profile Views" color="bg-blue-50 dark:bg-blue-900/20" />
            <StatCard icon="💌" value={receivedInterests.length} label="Interests Received" color="bg-rose-50 dark:bg-rose-900/20" />
            <StatCard icon="📤" value={sentInterests.length} label="Interests Sent" color="bg-amber-50 dark:bg-amber-900/20" />
            <StatCard icon="💍" value={matchCount} label="Matches" color="bg-emerald-50 dark:bg-emerald-900/20" />
          </div>
        </div>

        {/* ═══ ACTIVITY FEED + NEW MEMBERS ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Activity Feed */}
          <div className="glass-card rounded-2xl p-6 lg:col-span-1">
            <h3 className="font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-brand-500">📋</span> Activity
            </h3>
            <div>
              {activityFeed.map((item, i) => (
                <ActivityItem key={i} {...item} />
              ))}
            </div>
          </div>

          {/* New Members */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-brand-500">🆕</span> New Members
              </h3>
              <Link to="/search" className="text-xs font-semibold text-brand-600 dark:text-gold-400 hover:underline">See all →</Link>
            </div>
            {newMembers.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
                {newMembers.map((p) => <MiniProfileCard key={p._id} profile={p} />)}
              </div>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-600">No new members yet.</p>
            )}

            {/* Recently Viewed */}
            {recentlyViewed.length > 0 && (
              <div className="mt-6">
                <h3 className="font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-brand-500">🕐</span> Recently Viewed
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
                  {recentlyViewed.map((p) => <MiniProfileCard key={p._id} profile={p} />)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ═══ SUGGESTED MATCHES ═══ */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">Suggested Matches</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Profiles that might interest you</p>
          </div>
          <Link to="/search" className="btn-secondary text-sm">View All</Link>
        </div>

        {suggestedMatches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedMatches.map((m) => <ProfileCard key={m._id} profile={m} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400 dark:text-gray-600">
            <div className="text-5xl mb-4">💔</div>
            <h3 className="text-lg font-display font-semibold text-gray-500 dark:text-gray-400">No matches yet</h3>
            <p className="text-sm mt-1">New profiles are added every day. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
