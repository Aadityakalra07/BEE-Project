import { Link } from 'react-router-dom'
import { useState } from 'react'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Login:', formData)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold text-neutral-900">Welcome Back</h2>
        <p className="text-neutral-500 mt-1">Sign in to continue your journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-neutral-300" />
            <span className="text-neutral-600">Remember me</span>
          </label>
          <a href="#" className="text-primary-500 hover:text-primary-600">Forgot password?</a>
        </div>

        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-neutral-500">or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="w-full">Google</Button>
        <Button variant="outline" className="w-full">Phone</Button>
      </div>

      <p className="text-center text-sm text-neutral-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary-500 hover:text-primary-600 font-medium">
          Register
        </Link>
      </p>
    </div>
  )
}
