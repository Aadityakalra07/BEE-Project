import { Outlet, Link, useLocation } from 'react-router-dom'
import { Heart, Users, BarChart3, Settings, MessageSquare, Calendar, Shield } from 'lucide-react'

const sidebarLinks = [
  { path: '/admin', icon: BarChart3, label: 'Dashboard' },
  { path: '/admin/users', icon: Users, label: 'Users' },
  { path: '/admin/reports', icon: MessageSquare, label: 'Reports' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function AdminLayout() {
  const location = useLocation()
  
  return (
    <div className="min-h-screen flex bg-neutral-100">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 text-white p-6">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <Heart className="w-8 h-8 text-primary-400" fill="currentColor" />
          <span className="text-xl font-display font-semibold">Admin</span>
        </Link>
        
        <nav className="space-y-2">
          {sidebarLinks.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                location.pathname === path
                  ? 'bg-primary-500 text-white'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  )
}
