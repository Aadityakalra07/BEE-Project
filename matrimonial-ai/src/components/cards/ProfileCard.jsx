import { Link } from 'react-router-dom'
import { Heart, MessageCircle, CheckCircle, MapPin } from 'lucide-react'

export default function ProfileCard({ profile }) {
  const { id, name, age, city, photo, occupation, matchScore, verified } = profile

  return (
    <div className="card group hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative mb-4">
        <div className="aspect-[4/5] rounded-xl overflow-hidden bg-neutral-100">
          <img
            src={photo || '/api/placeholder/300/375'}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        {verified && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Verified
          </div>
        )}
        {matchScore && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur text-primary-600 text-sm font-semibold px-3 py-1 rounded-full">
            {matchScore}% Match
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg text-neutral-900">{name}, {age}</h3>
        <p className="text-neutral-600 text-sm">{occupation}</p>
        <p className="text-neutral-500 text-sm flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {city}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-neutral-100">
        <Link
          to={`/profile/${id}`}
          className="flex-1 text-center py-2 text-sm font-medium text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
        >
          View Profile
        </Link>
        <button className="p-2 text-neutral-400 hover:text-red-500 transition-colors">
          <Heart className="w-5 h-5" />
        </button>
        <Link to={`/chat/${id}`} className="p-2 text-neutral-400 hover:text-primary-500 transition-colors">
          <MessageCircle className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}
