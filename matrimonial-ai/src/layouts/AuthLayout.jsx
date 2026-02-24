import { Outlet, Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <Heart className="w-10 h-10 text-primary-500" fill="currentColor" />
            <span className="text-2xl font-display font-semibold text-neutral-900">MatrimonyAI</span>
          </Link>
        </div>
        <div className="card">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
