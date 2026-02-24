import { Users, UserCheck, MessageCircle, Calendar, TrendingUp, AlertTriangle, Search, Filter, MoreVertical } from 'lucide-react'
import Button from '../components/ui/Button'

const stats = [
  { label: 'Total Users', value: '24,589', change: '+12%', icon: Users, color: 'bg-blue-500' },
  { label: 'Verified Profiles', value: '18,432', change: '+8%', icon: UserCheck, color: 'bg-green-500' },
  { label: 'Active Chats', value: '3,291', change: '+23%', icon: MessageCircle, color: 'bg-purple-500' },
  { label: 'Meetings Scheduled', value: '892', change: '+15%', icon: Calendar, color: 'bg-orange-500' },
]

const recentUsers = [
  { id: 1, name: 'Priya Sharma', email: 'priya@example.com', status: 'verified', joined: '2 hours ago' },
  { id: 2, name: 'Rahul Kumar', email: 'rahul@example.com', status: 'pending', joined: '5 hours ago' },
  { id: 3, name: 'Anita Patel', email: 'anita@example.com', status: 'verified', joined: '1 day ago' },
  { id: 4, name: 'Vikram Singh', email: 'vikram@example.com', status: 'suspended', joined: '2 days ago' },
  { id: 5, name: 'Kavya Nair', email: 'kavya@example.com', status: 'verified', joined: '3 days ago' },
]

const reports = [
  { id: 1, type: 'Fake Profile', reported: 'User #12345', by: 'User #54321', status: 'pending' },
  { id: 2, type: 'Harassment', reported: 'User #67890', by: 'User #09876', status: 'investigating' },
  { id: 3, type: 'Inappropriate Content', reported: 'User #11111', by: 'User #22222', status: 'resolved' },
]

export default function AdminDashboard() {
  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'suspended': return 'bg-red-100 text-red-700'
      case 'investigating': return 'bg-blue-100 text-blue-700'
      case 'resolved': return 'bg-neutral-100 text-neutral-600'
      default: return 'bg-neutral-100 text-neutral-600'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-neutral-900">Admin Dashboard</h1>
        <p className="text-neutral-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {change}
              </span>
            </div>
            <p className="text-2xl font-bold text-neutral-900">{value}</p>
            <p className="text-neutral-500 text-sm">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-neutral-100">
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="font-semibold text-neutral-900">Recent Users</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  className="pl-9 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-left text-xs font-medium text-neutral-500 px-6 py-3">User</th>
                  <th className="text-left text-xs font-medium text-neutral-500 px-6 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-neutral-500 px-6 py-3">Joined</th>
                  <th className="text-left text-xs font-medium text-neutral-500 px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-neutral-200 rounded-full flex items-center justify-center text-sm font-medium text-neutral-600">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900 text-sm">{user.name}</p>
                          <p className="text-xs text-neutral-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500">{user.joined}</td>
                    <td className="px-6 py-4">
                      <button className="p-1 hover:bg-neutral-100 rounded">
                        <MoreVertical className="w-4 h-4 text-neutral-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 text-center">
            <Button variant="ghost" size="sm">View All Users</Button>
          </div>
        </div>

        {/* Reports */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100">
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="font-semibold text-neutral-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Recent Reports
            </h2>
            <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
              3 New
            </span>
          </div>
          <div className="p-4 space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="p-4 bg-neutral-50 rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-neutral-900 text-sm">{report.type}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>
                <p className="text-xs text-neutral-500">
                  {report.reported} reported by {report.by}
                </p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="flex-1">Review</Button>
                  <Button size="sm" variant="outline" className="flex-1">Dismiss</Button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-neutral-100 text-center">
            <Button variant="ghost" size="sm">View All Reports</Button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
        <h2 className="font-semibold text-neutral-900 mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" className="justify-start">
            <UserCheck className="w-5 h-5" />
            Verify Profiles
          </Button>
          <Button variant="outline" className="justify-start">
            <AlertTriangle className="w-5 h-5" />
            Review Reports
          </Button>
          <Button variant="outline" className="justify-start">
            <MessageCircle className="w-5 h-5" />
            Send Announcement
          </Button>
          <Button variant="outline" className="justify-start">
            <TrendingUp className="w-5 h-5" />
            View Analytics
          </Button>
        </div>
      </div>
    </div>
  )
}
