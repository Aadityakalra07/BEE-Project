import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Heart, MessageCircle, Share2, CheckCircle, MapPin, Briefcase, GraduationCap, Calendar, Users, Star } from 'lucide-react'
import Button from '../components/ui/Button'
import users from '../data/users.json'

export default function ProfileDetails() {
  const { id } = useParams()
  const profile = users.find(u => u.id === id) || users[0]

  const tabs = ['About', 'Photos', 'Preferences', 'Family']
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link to="/matches" className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6">
        <ArrowLeft className="w-5 h-5" />
        Back to Matches
      </Link>

      {/* Profile Header */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Photo */}
          <div className="md:w-72 flex-shrink-0">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-100">
              <img
                src={profile.photo}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-display font-bold text-neutral-900 flex items-center gap-2">
                    {profile.name}, {profile.age}
                    {profile.verified && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                  </h1>
                  <p className="text-neutral-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" />
                    {profile.city}, {profile.state}
                  </p>
                </div>
                <div className="text-right">
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-2xl font-bold px-4 py-2 rounded-xl">
                    {profile.matchScore}%
                  </div>
                  <p className="text-sm text-neutral-500 mt-1">Match Score</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-neutral-600">
                <Briefcase className="w-5 h-5 text-neutral-400" />
                {profile.occupation}
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <GraduationCap className="w-5 h-5 text-neutral-400" />
                {profile.education}
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <Calendar className="w-5 h-5 text-neutral-400" />
                {profile.height}
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <Star className="w-5 h-5 text-neutral-400" />
                {profile.religion}
              </div>
            </div>

            <p className="text-neutral-600">{profile.bio}</p>

            {/* Hobbies */}
            <div>
              <h4 className="text-sm font-medium text-neutral-500 mb-2">Interests</h4>
              <div className="flex flex-wrap gap-2">
                {profile.hobbies.map((hobby) => (
                  <span key={hobby} className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm">
                    {hobby}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Link to={`/chat/${profile.id}`} className="flex-1">
                <Button className="w-full">
                  <MessageCircle className="w-5 h-5" />
                  Send Message
                </Button>
              </Link>
              <Button variant="outline">
                <Heart className="w-5 h-5" />
                Interested
              </Button>
              <Button variant="ghost">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex border-b border-neutral-100 mb-6">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                index === 0
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* About Section */}
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-neutral-900 mb-3">About Me</h3>
            <p className="text-neutral-600 leading-relaxed">
              {profile.bio} I believe in maintaining a healthy work-life balance and value quality time with family. 
              Looking for someone who shares similar values and is ready for a meaningful relationship.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-neutral-900 mb-3">Family Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-neutral-400" />
                <span className="text-neutral-600">{profile.family.type} Family</span>
              </div>
              <div className="text-neutral-600">
                <span className="text-neutral-500">Father:</span> {profile.family.father}
              </div>
              <div className="text-neutral-600">
                <span className="text-neutral-500">Mother:</span> {profile.family.mother}
              </div>
              <div className="text-neutral-600">
                <span className="text-neutral-500">Siblings:</span> {profile.family.siblings}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
