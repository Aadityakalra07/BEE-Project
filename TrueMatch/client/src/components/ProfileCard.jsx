import { Link } from 'react-router-dom';

const ProfileCard = ({ profile }) => {
  const photoUrl = profile.photo
    ? `/uploads/${profile.photo}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=250&background=111827&color=fff`;

  return (
    <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group">
      {/* Photo */}
      <div className="relative overflow-hidden h-52">
        <img
          src={photoUrl}
          alt={profile.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-base font-bold text-gray-900 truncate">{profile.name}</h3>

        <div className="mt-2 space-y-1">
          <p className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="text-brand-500">📍</span>
            {profile.city || 'Not specified'}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-gray-500">
            <span>🎂</span>
            {profile.age ? `${profile.age} years` : 'Age not set'}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-gray-500">
            <span>🙏</span>
            {profile.religion || 'Not specified'}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-gray-500">
            <span>💼</span>
            {profile.profession || 'Not specified'}
          </p>
        </div>

        <Link
          to={`/profile/${profile._id}`}
          className="mt-4 block w-full text-center text-sm font-semibold bg-gray-900 hover:bg-black text-white py-2.5 rounded-full transition-all duration-200"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default ProfileCard;
