import { useState } from 'react'
import { Filter, SlidersHorizontal, Grid, List } from 'lucide-react'
import ProfileCard from '../components/cards/ProfileCard'
import Button from '../components/ui/Button'
import users from '../data/users.json'

export default function Matches() {
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-900">Your Matches</h1>
          <p className="text-neutral-500 mt-1">AI-curated profiles based on your preferences</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </Button>
          
          <div className="flex border border-neutral-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-neutral-500'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-neutral-500'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-neutral-500" />
            <span className="font-medium">Quick Filters</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <select className="input w-auto">
              <option>Age: Any</option>
              <option>22-25</option>
              <option>25-28</option>
              <option>28-32</option>
              <option>32+</option>
            </select>
            <select className="input w-auto">
              <option>Location: Any</option>
              <option>Mumbai</option>
              <option>Delhi</option>
              <option>Bangalore</option>
              <option>Hyderabad</option>
            </select>
            <select className="input w-auto">
              <option>Education: Any</option>
              <option>Bachelor's</option>
              <option>Master's</option>
              <option>PhD</option>
            </select>
            <select className="input w-auto">
              <option>Sort: Match Score</option>
              <option>Newest First</option>
              <option>Recently Active</option>
            </select>
          </div>
        </div>
      )}

      {/* Match Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Matches', value: users.length },
          { label: 'New Today', value: 3 },
          { label: '90%+ Match', value: 2 },
          { label: 'Mutual Interest', value: 1 },
        ].map(({ label, value }) => (
          <div key={label} className="card text-center py-4">
            <p className="text-2xl font-bold text-primary-500">{value}</p>
            <p className="text-sm text-neutral-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Profiles Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid'
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'grid-cols-1'
      }`}>
        {users.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-10">
        <Button variant="outline">Load More Matches</Button>
      </div>
    </div>
  )
}
