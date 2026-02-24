import { useState } from 'react'
import { Users, Eye, Heart, MessageCircle, Shield, Bell, Plus, CheckCircle } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import users from '../data/users.json'

const guardians = [
  { id: 'g1', name: 'Sunita Sharma', relation: 'Mother', email: 'sunita@example.com', status: 'active' },
  { id: 'g2', name: 'Rajesh Sharma', relation: 'Father', email: 'rajesh@example.com', status: 'pending' },
]

export default function GuardianMode() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeTab, setActiveTab] = useState('guardians')

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-900 flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary-500" />
            Guardian Mode
          </h1>
          <p className="text-neutral-500 mt-1">Allow family members to assist in your matrimonial search</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-5 h-5" />
          Add Guardian
        </Button>
      </div>

      {/* Info Card */}
      <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6 mb-8">
        <h3 className="font-semibold text-primary-900 mb-2">What is Guardian Mode?</h3>
        <p className="text-primary-700 text-sm">
          Guardian Mode allows your trusted family members to view matches, shortlist profiles, 
          and communicate on your behalf. All activities are logged and you maintain full control.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('guardians')}
          className={`px-4 py-2 rounded-lg font-medium text-sm ${
            activeTab === 'guardians'
              ? 'bg-primary-500 text-white'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          My Guardians
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`px-4 py-2 rounded-lg font-medium text-sm ${
            activeTab === 'activity'
              ? 'bg-primary-500 text-white'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          Activity Log
        </button>
        <button
          onClick={() => setActiveTab('permissions')}
          className={`px-4 py-2 rounded-lg font-medium text-sm ${
            activeTab === 'permissions'
              ? 'bg-primary-500 text-white'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          Permissions
        </button>
      </div>

      {/* Guardians Tab */}
      {activeTab === 'guardians' && (
        <div className="space-y-4">
          {guardians.map((guardian) => (
            <div key={guardian.id} className="card flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{guardian.name}</h3>
                  <p className="text-sm text-neutral-500">{guardian.relation} • {guardian.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                  guardian.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {guardian.status}
                </span>
                <Button variant="outline" size="sm">Manage</Button>
                <Button variant="ghost" size="sm" className="text-red-500">Remove</Button>
              </div>
            </div>
          ))}

          {guardians.length === 0 && (
            <div className="card text-center py-12">
              <Users className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="font-semibold text-neutral-900 mb-2">No Guardians Added</h3>
              <p className="text-neutral-500 mb-4">Add family members to help with your search</p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="w-5 h-5" />
                Add First Guardian
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="card">
          <h3 className="font-semibold text-neutral-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'Viewed profile', target: 'Priya Sharma', by: 'Sunita Sharma', time: '2 hours ago', icon: Eye },
              { action: 'Sent interest', target: 'Anita Patel', by: 'Sunita Sharma', time: '5 hours ago', icon: Heart },
              { action: 'Sent message', target: 'Kavya Nair', by: 'Rajesh Sharma', time: '1 day ago', icon: MessageCircle },
              { action: 'Shortlisted', target: 'Meera Reddy', by: 'Sunita Sharma', time: '2 days ago', icon: CheckCircle },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 py-3 border-b border-neutral-100 last:border-0">
                <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                  <activity.icon className="w-5 h-5 text-neutral-500" />
                </div>
                <div className="flex-1">
                  <p className="text-neutral-900">
                    <span className="font-medium">{activity.by}</span> {activity.action.toLowerCase()}{' '}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-sm text-neutral-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <div className="card">
          <h3 className="font-semibold text-neutral-900 mb-6">Guardian Permissions</h3>
          <p className="text-sm text-neutral-500 mb-6">Control what guardians can do on your behalf</p>
          
          <div className="space-y-4">
            {[
              { label: 'View Matches', desc: 'Allow guardians to browse your matches', enabled: true },
              { label: 'View Profile Details', desc: 'See detailed profile information', enabled: true },
              { label: 'Send Interest', desc: 'Express interest in profiles', enabled: true },
              { label: 'Send Messages', desc: 'Communicate with matches', enabled: false },
              { label: 'Schedule Meetings', desc: 'Arrange meetings with matches', enabled: false },
              { label: 'Accept/Reject Requests', desc: 'Respond to incoming interests', enabled: true },
            ].map(({ label, desc, enabled }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-neutral-100">
                <div>
                  <p className="font-medium text-neutral-900">{label}</p>
                  <p className="text-sm text-neutral-500">{desc}</p>
                </div>
                <label className="relative inline-flex cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={enabled} />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6 pt-6 border-t border-neutral-100">
            <Button>Save Permissions</Button>
          </div>
        </div>
      )}

      {/* Add Guardian Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Guardian">
        <div className="space-y-4">
          <Input label="Guardian's Name" placeholder="Enter full name" />
          <Input label="Email Address" type="email" placeholder="guardian@example.com" />
          
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-700">Relationship</label>
            <select className="input">
              <option>Select relationship...</option>
              <option>Father</option>
              <option>Mother</option>
              <option>Brother</option>
              <option>Sister</option>
              <option>Uncle</option>
              <option>Aunt</option>
              <option>Other</option>
            </select>
          </div>

          <p className="text-sm text-neutral-500">
            An invitation will be sent to the guardian's email. They need to accept it to access your profile.
          </p>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button className="flex-1">
              Send Invitation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
