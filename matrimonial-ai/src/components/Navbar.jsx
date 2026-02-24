import { Link, useLocation } from 'react-router-dom'
import { Heart, MessageCircle, Calendar, Settings, User, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navLinks = [
  { path: '/matches', label: 'Matches' },
  { path: '/meetings', label: 'Meetings' },
  { path: '/guardian', label: 'Guardian' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const isLoggedIn = true // Dummy state for UI

  return (
    <nav className="bg-white border-b border-neutral-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary-500" fill="currentColor" />
            <span className="text-xl font-display font-semibold text-neutral-900">MatrimonyAI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {isLoggedIn && navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === path
                    ? 'text-primary-500'
                    : 'text-neutral-600 hover:text-primary-500'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link to="/chat/1" className="p-2 text-neutral-600 hover:text-primary-500 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </Link>
                <Link to="/settings" className="p-2 text-neutral-600 hover:text-primary-500 transition-colors">
                  <Settings className="w-5 h-5" />
                </Link>
                <Link to="/profile/me" className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-neutral-600 hover:text-primary-500">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-neutral-600"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden border-t border-neutral-100 py-4 space-y-2">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-neutral-600 hover:bg-primary-50 rounded-lg"
              >
                {label}
              </Link>
            ))}
            <div className="border-t border-neutral-100 pt-4 mt-4 px-4 space-y-2">
              <Link to="/settings" className="block py-2 text-neutral-600">Settings</Link>
              <Link to="/profile/me" className="block py-2 text-neutral-600">Profile</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
