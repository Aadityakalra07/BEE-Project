import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const QuickViewModal = ({ profile, onClose }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!profile) return null;

  const photoUrl = profile.photo
    ? `/uploads/${profile.photo}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=400&background=8B1A2B&color=fff`;

  return (
    <div ref={overlayRef} onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-dark-card rounded-3xl overflow-hidden shadow-2xl animate-slide-up">

        {/* Close button */}
        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-all">
          ✕
        </button>

        {/* Hero photo */}
        <div className="relative h-64 overflow-hidden">
          <img src={photoUrl} alt={profile.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-5 right-5">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-display font-bold text-white drop-shadow-lg">{profile.name}</h2>
              {profile.isApproved && (
                <span className="bg-emerald-400/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">✓ Verified</span>
              )}
            </div>
            <p className="text-white/80 text-sm mt-0.5">
              {profile.age} years · {profile.gender} · {profile.city}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Religion', value: profile.religion },
              { label: 'Education', value: profile.education },
              { label: 'Profession', value: profile.profession },
              { label: 'Caste', value: profile.caste },
            ].map(({ label, value }) => (
              <div key={label} className="bg-surface-100 dark:bg-dark-bg rounded-xl p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-500/60 dark:text-gold-400/60">{label}</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{value || 'Not specified'}</p>
              </div>
            ))}
          </div>

          {profile.bio && (
            <div className="bg-surface-100 dark:bg-dark-bg rounded-xl p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-500/60 dark:text-gold-400/60">About</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed line-clamp-3">{profile.bio}</p>
            </div>
          )}

          <Link to={`/profile/${profile._id}`} onClick={onClose}
            className="block w-full text-center btn-primary !py-3 text-sm">
            View Full Profile →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
