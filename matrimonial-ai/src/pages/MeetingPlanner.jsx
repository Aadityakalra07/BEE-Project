import { useState } from 'react'
import { Calendar, Clock, MapPin, Video, Coffee, Utensils, Plus, Check, X } from 'lucide-react'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import meetings from '../data/meetings.json'

const meetingTypes = [
  { id: 'video', icon: Video, label: 'Video Call' },
  { id: 'coffee', icon: Coffee, label: 'Coffee' },
  { id: 'dinner', icon: Utensils, label: 'Dinner' },
]

export default function MeetingPlanner() {
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState('upcoming')

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-neutral-100 text-neutral-600'
    }
  }

  const getTypeIcon = (type) => {
    const found = meetingTypes.find(t => t.id === type)
    return found ? found.icon : Calendar
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-900">Meeting Planner</h1>
          <p className="text-neutral-500 mt-1">Schedule and manage meetings with your matches</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-5 h-5" />
          New Meeting
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {['upcoming', 'past', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium text-sm capitalize ${
              activeTab === tab
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {meetings.map((meeting) => {
          const TypeIcon = getTypeIcon(meeting.type)
          return (
            <div key={meeting.id} className="card">
              <div className="flex items-start gap-4">
                {/* User Photo */}
                <img
                  src={meeting.userPhoto}
                  alt={meeting.userName}
                  className="w-14 h-14 rounded-full object-cover"
                />

                {/* Meeting Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-neutral-900">{meeting.userName}</h3>
                      <p className="text-sm text-neutral-500">{meeting.notes}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(meeting.status)}`}>
                      {meeting.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-neutral-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-neutral-400" />
                      {new Date(meeting.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-neutral-400" />
                      {meeting.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <TypeIcon className="w-4 h-4 text-neutral-400" />
                      {meeting.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-neutral-400" />
                      {meeting.location}
                    </span>
                  </div>

                  {/* Actions */}
                  {meeting.status === 'pending' && (
                    <div className="flex gap-2 mt-4">
                      <Button size="sm">
                        <Check className="w-4 h-4" />
                        Confirm
                      </Button>
                      <Button size="sm" variant="outline">
                        Reschedule
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-500">
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* New Meeting Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Schedule New Meeting">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-700">Select Match</label>
            <select className="input">
              <option>Select a match...</option>
              <option>Priya Sharma</option>
              <option>Anita Patel</option>
              <option>Kavya Nair</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-700">Meeting Type</label>
            <div className="grid grid-cols-3 gap-3">
              {meetingTypes.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  className="flex flex-col items-center gap-2 p-4 border border-neutral-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <Icon className="w-6 h-6 text-neutral-600" />
                  <span className="text-sm text-neutral-600">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-neutral-700">Date</label>
              <input type="date" className="input" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-neutral-700">Time</label>
              <input type="time" className="input" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-700">Location / Link</label>
            <input type="text" placeholder="Enter location or meeting link" className="input" />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-700">Notes</label>
            <textarea rows={3} placeholder="Add any notes..." className="input resize-none" />
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={() => setShowModal(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button className="flex-1">
              Send Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
