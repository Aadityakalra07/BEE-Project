import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sliders, Save } from 'lucide-react'
import Button from '../components/ui/Button'

export default function Preferences() {
  const navigate = useNavigate()
  
  const [preferences, setPreferences] = useState({
    ageMin: 22,
    ageMax: 30,
    heightMin: "5'0\"",
    heightMax: "5'8\"",
    religions: [],
    educations: [],
    occupations: [],
    locations: [],
    maritalStatus: ['never_married'],
    diet: [],
  })

  const handleSave = () => {
    console.log('Preferences:', preferences)
    navigate('/matches')
  }

  const toggleArrayValue = (field, value) => {
    const current = preferences[field]
    if (current.includes(value)) {
      setPreferences({ ...preferences, [field]: current.filter(v => v !== value) })
    } else {
      setPreferences({ ...preferences, [field]: [...current, value] })
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sliders className="w-8 h-8 text-primary-500" />
        </div>
        <h1 className="text-2xl font-display font-bold text-neutral-900">Partner Preferences</h1>
        <p className="text-neutral-500 mt-2">Tell us what you're looking for in a partner</p>
      </div>

      <div className="space-y-8">
        {/* Age Range */}
        <div className="card">
          <h3 className="font-semibold text-neutral-900 mb-4">Age Range</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm text-neutral-500">Min Age</label>
              <select
                className="input mt-1"
                value={preferences.ageMin}
                onChange={(e) => setPreferences({ ...preferences, ageMin: parseInt(e.target.value) })}
              >
                {Array.from({ length: 30 }, (_, i) => 18 + i).map(age => (
                  <option key={age} value={age}>{age}</option>
                ))}
              </select>
            </div>
            <span className="pt-6 text-neutral-400">to</span>
            <div className="flex-1">
              <label className="text-sm text-neutral-500">Max Age</label>
              <select
                className="input mt-1"
                value={preferences.ageMax}
                onChange={(e) => setPreferences({ ...preferences, ageMax: parseInt(e.target.value) })}
              >
                {Array.from({ length: 30 }, (_, i) => 18 + i).map(age => (
                  <option key={age} value={age}>{age}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Religion */}
        <div className="card">
          <h3 className="font-semibold text-neutral-900 mb-4">Religion</h3>
          <div className="flex flex-wrap gap-2">
            {['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Other'].map((religion) => (
              <button
                key={religion}
                onClick={() => toggleArrayValue('religions', religion.toLowerCase())}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  preferences.religions.includes(religion.toLowerCase())
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {religion}
              </button>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="card">
          <h3 className="font-semibold text-neutral-900 mb-4">Education</h3>
          <div className="flex flex-wrap gap-2">
            {["Bachelor's", "Master's", 'PhD', 'Professional (CA, MBBS)', 'Any'].map((edu) => (
              <button
                key={edu}
                onClick={() => toggleArrayValue('educations', edu.toLowerCase())}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  preferences.educations.includes(edu.toLowerCase())
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {edu}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="card">
          <h3 className="font-semibold text-neutral-900 mb-4">Preferred Locations</h3>
          <div className="flex flex-wrap gap-2">
            {['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Any'].map((city) => (
              <button
                key={city}
                onClick={() => toggleArrayValue('locations', city.toLowerCase())}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  preferences.locations.includes(city.toLowerCase())
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Diet */}
        <div className="card">
          <h3 className="font-semibold text-neutral-900 mb-4">Diet Preference</h3>
          <div className="flex flex-wrap gap-2">
            {['Vegetarian', 'Non-Vegetarian', 'Vegan', "Doesn't Matter"].map((diet) => (
              <button
                key={diet}
                onClick={() => toggleArrayValue('diet', diet.toLowerCase())}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  preferences.diet.includes(diet.toLowerCase())
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {diet}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <Button size="lg" onClick={handleSave}>
          <Save className="w-5 h-5" />
          Save Preferences & Find Matches
        </Button>
      </div>
    </div>
  )
}
