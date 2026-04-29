import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProfileCard from '../components/ProfileCard';
import { ShimmerBlock } from '../components/Shimmer';

/* ── Share Icon ── */
const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

/* ── Detail Row ── */
const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 py-3.5 border-b border-brand-100/20 dark:border-dark-border/20 last:border-0">
    <span className="text-lg w-6 text-center shrink-0">{icon}</span>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-wider text-brand-500/50 dark:text-gold-400/50">{label}</p>
      <p className="text-sm text-gray-900 dark:text-gray-200 font-medium mt-0.5">{value || 'Not specified'}</p>
    </div>
  </div>
);

/* ── Photo Gallery ── */
const PhotoGallery = ({ photos, name }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Support both single photo string and array
  const photoList = useMemo(() => {
    if (Array.isArray(photos) && photos.length > 0) return photos;
    if (typeof photos === 'string' && photos) return [photos];
    return [];
  }, [photos]);

  if (photoList.length === 0) {
    return (
      <div className="h-72 sm:h-96 bg-brand-50 dark:bg-dark-card flex items-center justify-center">
        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=8B1A2B&color=fff`} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }

  const mainPhoto = `/uploads/${photoList[activeIndex]}`;

  return (
    <div>
      <div className="relative h-72 sm:h-96 overflow-hidden bg-gray-100 dark:bg-dark-card">
        <img src={mainPhoto} alt={name} className="w-full h-full object-cover transition-all duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {photoList.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {activeIndex + 1} / {photoList.length}
          </div>
        )}
      </div>
      {/* Thumbnails */}
      {photoList.length > 1 && (
        <div className="flex gap-2 p-3 overflow-x-auto bg-white dark:bg-dark-card" style={{ scrollbarWidth: 'none' }}>
          {photoList.map((photo, i) => (
            <button key={i} onClick={() => setActiveIndex(i)}
              className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                i === activeIndex ? 'border-brand-500 ring-2 ring-brand-500/30' : 'border-transparent opacity-60 hover:opacity-100'
              }`}>
              <img src={`/uploads/${photo}`} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ProfileDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [similarProfiles, setSimilarProfiles] = useState([]);
  const [compatibilityScore, setCompatibilityScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/profile/${id}`);
        setProfile(res.data);
        // Fetch compatible profiles to get real score + similar profiles
        try {
          const compatRes = await axios.get('/api/profile/compatible');
          const thisProfile = compatRes.data.find((p) => p._id === id);
          if (thisProfile) setCompatibilityScore(thisProfile.compatibilityScore);
          const similar = compatRes.data.filter((p) =>
            p._id !== id && (p.religion === res.data.religion || p.city === res.data.city)
          ).slice(0, 3);
          setSimilarProfiles(similar);
        } catch (e) { /* ignore */ }
      } catch (err) { console.error('Error fetching profile:', err); }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, [id]);

  /* ── Actions ── */
  const handleSendInterest = async () => {
    try { const res = await axios.post(`/api/interest/${id}`); setMessage({ text: res.data.message, type: 'success' }); }
    catch (err) { setMessage({ text: err.response?.data?.message || 'Error sending interest', type: 'error' }); }
  };
  const handleToggleFavourite = async () => {
    try { const res = await axios.put(`/api/profile/favourite/${id}`); setMessage({ text: res.data.message, type: 'success' }); }
    catch (err) { setMessage({ text: err.response?.data?.message || 'Error', type: 'error' }); }
  };
  const handleReport = async () => {
    if (window.confirm('Are you sure you want to report this profile?')) {
      try { const res = await axios.put(`/api/profile/report/${id}`); setMessage({ text: res.data.message, type: 'success' }); }
      catch (err) { setMessage({ text: err.response?.data?.message || 'Error', type: 'error' }); }
    }
  };
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: `${profile.name} - TrueMatch`, url }); }
      catch (e) { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      setMessage({ text: 'Profile link copied to clipboard!', type: 'success' });
    }
  };

  /* ── Last active (simulated) ── */
  const lastActive = useMemo(() => {
    if (!profile?._id) return '';
    const hash = profile._id.charCodeAt(profile._id.length - 1) % 48;
    if (hash < 1) return 'Online now';
    if (hash < 5) return `Active ${hash * 10} minutes ago`;
    if (hash < 24) return `Active ${hash} hours ago`;
    return `Active ${Math.floor(hash / 24) + 1} days ago`;
  }, [profile]);

  /* ── Partner Preferences (simulated from profile data) ── */
  const partnerPrefs = useMemo(() => {
    if (!profile) return null;
    const age = profile.age || 25;
    return {
      ageRange: `${Math.max(18, age - 5)} – ${age + 5} years`,
      religion: profile.religion || 'Any',
      education: profile.education || 'Any',
      city: profile.city || 'Any',
    };
  }, [profile]);

  if (loading) return (
    <div className="min-h-screen bg-surface-100 dark:bg-dark-bg py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <ShimmerBlock height="h-96" className="w-full rounded-2xl" />
        <ShimmerBlock height="h-8" className="w-1/2" />
        <ShimmerBlock height="h-64" className="w-full rounded-2xl" />
      </div>
    </div>
  );

  if (!profile) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400 dark:text-gray-600">
      <div className="text-5xl mb-4">🔍</div>
      <p className="text-lg font-display font-semibold">Profile not found</p>
      <Link to="/search" className="btn-primary text-sm mt-4">Browse Profiles</Link>
    </div>
  );

  const isOwn = user && user._id === profile._id;

  return (
    <div className="min-h-screen bg-surface-100 dark:bg-dark-bg pb-24 sm:pb-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Back button */}
        <button onClick={() => navigate(-1)}
          className="mb-5 flex items-center gap-2 text-sm font-semibold text-gray-400 dark:text-gray-500 hover:text-brand-600 dark:hover:text-gold-400 transition-colors">
          ← Back
        </button>

        <div className="glass-card rounded-2xl overflow-hidden">
          {/* ═══ PHOTO GALLERY ═══ */}
          <PhotoGallery photos={profile.photos || profile.photo} name={profile.name} />

          {/* ═══ HEADER ═══ */}
          <div className="px-6 sm:px-8 pt-6 pb-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white">{profile.name}</h1>
                  {profile.isApproved && (
                    <span className="badge-verified text-[10px]">✓ Verified</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
                  {[profile.age && `${profile.age} years`, profile.gender, profile.city].filter(Boolean).join(' · ')}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mt-1">
                  <span className={`w-2 h-2 rounded-full ${lastActive === 'Online now' ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]' : 'bg-gray-300 dark:bg-gray-600'}`} />
                  {lastActive}
                </p>
              </div>

              {/* Compatibility + Share buttons */}
              <div className="flex items-center gap-2">
                {compatibilityScore && !isOwn && (
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 dark:text-gold-400 bg-brand-50 dark:bg-brand-900/20 px-3 py-1.5 rounded-full border border-brand-200/50 dark:border-brand-800/50">
                    <span className="w-2 h-2 rounded-full bg-gradient-brand" />
                    {compatibilityScore}% Match
                  </span>
                )}
                <button onClick={handleShare}
                  className="p-2.5 rounded-xl bg-surface-100 dark:bg-dark-bg text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-gold-400 transition-all">
                  <ShareIcon />
                </button>
              </div>
            </div>

            {message.text && (
              <div className={`mt-4 text-sm px-4 py-3 rounded-xl border ${
                message.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400'
              }`}>{message.text}</div>
            )}
          </div>

          {/* ═══ BIO ═══ */}
          {profile.bio && (
            <div className="px-6 sm:px-8 pb-4">
              <div className="bg-surface-100 dark:bg-dark-bg rounded-xl p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-500/50 dark:text-gold-400/50 mb-2">About</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{profile.bio}</p>
              </div>
            </div>
          )}

          {/* ═══ PROFILE DETAILS ═══ */}
          <div className="px-6 sm:px-8 pb-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-500/50 dark:text-gold-400/50 mb-2">Profile Details</p>
            <div className="bg-surface-100 dark:bg-dark-bg rounded-xl px-4">
              <DetailRow icon="🙏" label="Religion" value={profile.religion} />
              <DetailRow icon="🏷️" label="Caste" value={profile.caste} />
              <DetailRow icon="🎓" label="Education" value={profile.education} />
              <DetailRow icon="💼" label="Profession" value={profile.profession} />
              <DetailRow icon="📍" label="City" value={profile.city} />
              <DetailRow icon="📅" label="Member Since" value={new Date(profile.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })} />
            </div>
          </div>

          {/* ═══ PARTNER PREFERENCES ═══ */}
          {partnerPrefs && (
            <div className="px-6 sm:px-8 pb-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-500/50 dark:text-gold-400/50 mb-2">Partner Preferences</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Age Range', value: partnerPrefs.ageRange, icon: '🎂' },
                  { label: 'Religion', value: partnerPrefs.religion, icon: '🙏' },
                  { label: 'Education', value: partnerPrefs.education, icon: '🎓' },
                  { label: 'City', value: partnerPrefs.city, icon: '📍' },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="bg-surface-100 dark:bg-dark-bg rounded-xl p-3">
                    <p className="text-lg mb-1">{icon}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">{label}</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ DESKTOP ACTION BUTTONS ═══ */}
          {!isOwn && (
            <div className="hidden sm:flex px-6 sm:px-8 pb-8 gap-3 flex-wrap">
              <button onClick={handleSendInterest} className="btn-primary text-sm">💌 Send Interest</button>
              <button onClick={handleToggleFavourite} className="btn-secondary text-sm">⭐ Favourite</button>
              <button onClick={handleShare} className="btn-secondary text-sm">📤 Share</button>
              <button onClick={handleReport}
                className="ml-auto px-5 py-2.5 border border-red-200 dark:border-red-800/50 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-semibold rounded-full transition-all">
                🚩 Report
              </button>
            </div>
          )}
        </div>

        {/* ═══ SIMILAR PROFILES ═══ */}
        {similarProfiles.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-1">Similar Profiles</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Profiles with similar background</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {similarProfiles.map((p) => <ProfileCard key={p._id} profile={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* ═══ MOBILE STICKY ACTION BAR ═══ */}
      {!isOwn && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-dark-card/90 backdrop-blur-xl border-t border-brand-100/30 dark:border-dark-border/30 px-4 py-3 flex gap-2">
          <button onClick={handleSendInterest} className="flex-1 btn-primary text-sm !py-3 !rounded-xl">
            💌 Send Interest
          </button>
          <button onClick={handleToggleFavourite}
            className="w-12 h-12 rounded-xl bg-surface-100 dark:bg-dark-bg flex items-center justify-center text-lg border border-brand-100 dark:border-dark-border">
            ⭐
          </button>
          <button onClick={handleShare}
            className="w-12 h-12 rounded-xl bg-surface-100 dark:bg-dark-bg flex items-center justify-center border border-brand-100 dark:border-dark-border">
            <ShareIcon />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDetails;
