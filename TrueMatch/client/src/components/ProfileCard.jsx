import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

/* ── Inline SVG Icons ── */
const HeartIcon = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ProfileCard = ({ profile, onQuickView, viewMode = 'grid' }) => {
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const photoUrl = profile.photo
    ? `/uploads/${profile.photo}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=250&background=8B1A2B&color=fff`;

  // Use real compatibility score from API if available, else fallback to seeded random
  const compatibility = useMemo(() => {
    if (profile.compatibilityScore) return profile.compatibilityScore;
    const hash = profile._id ? profile._id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) : 0;
    return 75 + (hash % 24);
  }, [profile._id, profile.compatibilityScore]);

  // Stable "active ago" (seeded from ID)
  const activeStatus = useMemo(() => {
    const hash = profile._id ? profile._id.charCodeAt(profile._id.length - 1) : 0;
    const mins = hash % 120;
    if (mins < 5) return { text: 'Online', online: true };
    if (mins < 60) return { text: `Active ${mins}m ago`, online: false };
    return { text: `Active ${Math.floor(mins / 60)}h ago`, online: false };
  }, [profile._id]);

  const handleFavToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setFavLoading(true);
      await axios.put(`/api/profile/favourite/${profile._id}`);
      setIsFav(!isFav);
    } catch (err) {
      console.error('Fav toggle error:', err);
    } finally {
      setFavLoading(false);
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    if (onQuickView) onQuickView(profile);
  };

  /* ═══ LIST VIEW ═══ */
  if (viewMode === 'list') {
    return (
      <div className="glass-card rounded-2xl p-4 flex items-center gap-4 group hover:shadow-card-hover transition-all duration-300">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
          <img src={photoUrl} alt={profile.name} className="w-full h-full object-cover" loading="lazy" />
          {activeStatus.online && (
            <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white dark:border-dark-card rounded-full" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-gray-900 dark:text-white truncate">{profile.name}</h3>
            {profile.isApproved && <span className="text-emerald-500 text-xs">✓</span>}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {[profile.age && `${profile.age} yrs`, profile.city, profile.profession].filter(Boolean).join(' · ')}
          </p>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{activeStatus.text}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-brand-600 dark:text-gold-400 bg-brand-50 dark:bg-brand-900/20 px-2 py-1 rounded-lg">{compatibility}%</span>
          <button onClick={handleFavToggle} disabled={favLoading}
            className={`p-1.5 rounded-full transition-all duration-200 ${isFav ? 'text-red-500' : 'text-gray-300 dark:text-gray-600 hover:text-red-400'}`}>
            <HeartIcon filled={isFav} />
          </button>
          {onQuickView && (
            <button onClick={handleQuickView} className="text-xs font-semibold text-brand-500 dark:text-gold-400 hover:underline">Quick View</button>
          )}
          <Link to={`/profile/${profile._id}`} className="btn-primary text-xs !px-4 !py-2">View</Link>
        </div>
      </div>
    );
  }

  /* ═══ GRID VIEW (default) ═══ */
  return (
    <div className="gradient-border-card group" style={{ perspective: '1200px' }}>
      <div className="bg-white dark:bg-dark-card rounded-3xl overflow-hidden shadow-card transition-all duration-500 group-hover:shadow-card-hover group-hover:-translate-y-1.5 group-hover:rotate-x-1 group-hover:rotate-y-1"
        style={{ transformStyle: 'preserve-3d' }}>

        {/* Photo */}
        <div className="relative overflow-hidden h-56">
          <img src={photoUrl} alt={profile.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Top badges row */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            {/* Compatibility badge */}
            <span className="bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm text-brand-600 dark:text-gold-400 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-brand inline-block" />
              {compatibility}% Match
            </span>

            {/* Favourite heart */}
            <button onClick={handleFavToggle} disabled={favLoading}
              className={`w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-300 shadow-sm ${
                isFav
                  ? 'bg-red-500/90 text-white scale-110'
                  : 'bg-white/80 dark:bg-dark-card/80 text-gray-400 dark:text-gray-500 hover:bg-red-500/90 hover:text-white hover:scale-110'
              }`}>
              <HeartIcon filled={isFav} />
            </button>
          </div>

          {/* Bottom of photo: name + status */}
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center gap-1.5">
              <h3 className="text-white font-display font-bold text-lg truncate drop-shadow-md">{profile.name}</h3>
              {profile.verificationLevel === 'premium' && (
                <span className="bg-emerald-400/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm" title="Premium Verified">🛡️</span>
              )}
              {profile.verificationLevel === 'id' && (
                <span className="bg-amber-400/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm" title="ID Verified">🪪</span>
              )}
              {profile.verificationLevel === 'photo' && (
                <span className="bg-blue-400/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm" title="Photo Verified">📷</span>
              )}
              {(!profile.verificationLevel || profile.verificationLevel === 'none' || profile.verificationLevel === 'basic') && profile.isApproved && (
                <span className="bg-emerald-400/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">✓</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${activeStatus.online ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]' : 'bg-gray-400'}`} />
              <span className="text-white/80 text-[11px] font-medium">{activeStatus.text}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="space-y-1.5">
            <p className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="text-brand-500">📍</span>{profile.city || 'Not specified'}
            </p>
            <p className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>🎂</span>{profile.age ? `${profile.age} years` : 'Age not set'}
            </p>
            <p className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>🙏</span>{profile.religion || 'Not specified'}
            </p>
            <p className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>💼</span>{profile.profession || 'Not specified'}
            </p>
          </div>

          <div className="flex gap-2 mt-4">
            <Link to={`/profile/${profile._id}`} className="flex-1 text-center text-sm font-semibold btn-primary !py-2.5">
              View Profile
            </Link>
            {onQuickView && (
              <button onClick={handleQuickView}
                className="px-3 py-2.5 border border-brand-200 dark:border-dark-border text-brand-600 dark:text-gold-400 rounded-full hover:bg-brand-50 dark:hover:bg-dark-card text-sm font-semibold transition-all">
                ⚡
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
