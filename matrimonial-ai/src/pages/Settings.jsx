import { useState } from 'react'
import { User, Bell, Shield, Eye, CreditCard, HelpCircle, LogOut, ChevronRight, Moon, Smartphone } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const settingsSections = [
  {
    id: 'profile',
    icon: User,
    title: 'Profile Settings',
    description: 'Update your personal information'
  },
  {
    id: 'notifications',
    icon: Bell,
    title: 'Notifications',
    description: 'Manage notification preferences'
  },
  {
    id: 'privacy',
    icon: Shield,
    title: 'Privacy & Security',
    description: 'Control who can see your profile'
  },
  {
    id: 'visibility',
    icon: Eye,
    title: 'Profile Visibility',
    description: 'Manage profile visibility settings'
  },
  {
    id: 'subscription',
    icon: CreditCard,
    title: 'Subscription',
    description: 'Manage your subscription plan'
  },
  {
    id: 'help',
    icon: HelpCircle,
    title: 'Help & Support',
    description: 'Get help and contact support'
  },
]

export default function Settings() {
  const [activeSection, setActiveSection] = useState('profile')
  const [notifications, setNotifications] = useState({
    newMatches: true,
    messages: true,
    profileViews: false,
    meetingReminders: true,
    promotional: false
  })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-display font-bold text-neutral-900 mb-8">Settings</h1>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {settingsSections.map(({ id, icon: Icon, title }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeSection === id
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{title}</span>
              </button>
            ))}
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-500 hover:bg-red-50 transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeSection === 'profile' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-neutral-900 mb-6">Profile Settings</h2>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-neutral-200 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-neutral-400" />
                </div>
                <div>
                  <Button variant="outline" size="sm">Change Photo</Button>
                  <p className="text-xs text-neutral-500 mt-2">JPG, PNG. Max 5MB</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Full Name" placeholder="Your name" defaultValue="Rahul Kumar" />
                <Input label="Email" type="email" defaultValue="rahul@example.com" />
                <Input label="Phone" type="tel" defaultValue="+91 9876543210" />
                <Input label="City" defaultValue="Mumbai" />
              </div>

              <div className="mt-6 pt-6 border-t border-neutral-100">
                <h3 className="font-medium mb-4">Update Password</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="Current Password" type="password" />
                  <div></div>
                  <Input label="New Password" type="password" />
                  <Input label="Confirm Password" type="password" />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-neutral-100">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-neutral-900 mb-6">Notification Preferences</h2>
              
              <div className="space-y-4">
                {[
                  { key: 'newMatches', label: 'New Matches', desc: 'Get notified when you have new matches' },
                  { key: 'messages', label: 'Messages', desc: 'Receive notifications for new messages' },
                  { key: 'profileViews', label: 'Profile Views', desc: 'Know when someone views your profile' },
                  { key: 'meetingReminders', label: 'Meeting Reminders', desc: 'Reminders for upcoming meetings' },
                  { key: 'promotional', label: 'Promotional', desc: 'Receive promotional emails and offers' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-neutral-100">
                    <div>
                      <p className="font-medium text-neutral-900">{label}</p>
                      <p className="text-sm text-neutral-500">{desc}</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notifications[key]}
                        onChange={() => setNotifications({ ...notifications, [key]: !notifications[key] })}
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'privacy' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-neutral-900 mb-6">Privacy & Security</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-neutral-900 mb-3">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-8 h-8 text-neutral-400" />
                      <div>
                        <p className="font-medium">SMS Authentication</p>
                        <p className="text-sm text-neutral-500">Receive a code via SMS</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-neutral-900 mb-3">Block List</h3>
                  <p className="text-sm text-neutral-500 mb-3">Manage users you've blocked</p>
                  <Button variant="outline" size="sm">Manage Block List</Button>
                </div>

                <div className="pt-6 border-t border-neutral-100">
                  <h3 className="font-medium text-red-600 mb-2">Danger Zone</h3>
                  <p className="text-sm text-neutral-500 mb-4">Permanently delete your account and all data</p>
                  <Button variant="danger" size="sm">Delete Account</Button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'visibility' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-neutral-900 mb-6">Profile Visibility</h2>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-neutral-700">Who can see your profile?</label>
                  <select className="input">
                    <option>All verified members</option>
                    <option>Only matches</option>
                    <option>Only premium members</option>
                    <option>Nobody (Hidden)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-neutral-700">Who can see your photos?</label>
                  <select className="input">
                    <option>Everyone</option>
                    <option>Only accepted requests</option>
                    <option>Only premium members</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-neutral-700">Who can contact you?</label>
                  <select className="input">
                    <option>All verified members</option>
                    <option>Only premium members</option>
                    <option>Only mutual interests</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-6 border-t border-neutral-100">
                <Button>Save Settings</Button>
              </div>
            </div>
          )}

          {activeSection === 'subscription' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-neutral-900 mb-6">Your Subscription</h2>
              
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-2xl p-6 mb-6">
                <p className="text-sm opacity-80">Current Plan</p>
                <p className="text-2xl font-bold mt-1">Free Plan</p>
                <p className="text-sm mt-2 opacity-80">Limited features. Upgrade for full access.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-neutral-200 rounded-xl p-6">
                  <h3 className="font-semibold text-neutral-900">Premium</h3>
                  <p className="text-2xl font-bold mt-2">₹999<span className="text-sm font-normal text-neutral-500">/month</span></p>
                  <ul className="mt-4 space-y-2 text-sm text-neutral-600">
                    <li>✓ Unlimited messages</li>
                    <li>✓ See profile visitors</li>
                    <li>✓ Advanced filters</li>
                    <li>✓ Priority support</li>
                  </ul>
                  <Button className="w-full mt-6">Upgrade</Button>
                </div>

                <div className="border-2 border-primary-500 rounded-xl p-6 relative">
                  <span className="absolute -top-3 right-4 bg-primary-500 text-white text-xs px-3 py-1 rounded-full">Popular</span>
                  <h3 className="font-semibold text-neutral-900">Premium Gold</h3>
                  <p className="text-2xl font-bold mt-2">₹4999<span className="text-sm font-normal text-neutral-500">/year</span></p>
                  <ul className="mt-4 space-y-2 text-sm text-neutral-600">
                    <li>✓ All Premium features</li>
                    <li>✓ Profile boost monthly</li>
                    <li>✓ AI matchmaking</li>
                    <li>✓ Video call feature</li>
                  </ul>
                  <Button className="w-full mt-6">Upgrade</Button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'help' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-neutral-900 mb-6">Help & Support</h2>
              
              <div className="space-y-4">
                {[
                  { title: 'FAQs', desc: 'Find answers to common questions' },
                  { title: 'Contact Support', desc: 'Get help from our support team' },
                  { title: 'Report an Issue', desc: 'Report bugs or problems' },
                  { title: 'Terms of Service', desc: 'Read our terms and conditions' },
                  { title: 'Privacy Policy', desc: 'Learn how we protect your data' },
                ].map(({ title, desc }) => (
                  <button key={title} className="w-full flex items-center justify-between p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
                    <div className="text-left">
                      <p className="font-medium text-neutral-900">{title}</p>
                      <p className="text-sm text-neutral-500">{desc}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-neutral-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
