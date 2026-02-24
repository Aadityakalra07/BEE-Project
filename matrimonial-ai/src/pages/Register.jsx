import { Link } from 'react-router-dom'
import { useState } from 'react'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Register:', formData)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold text-neutral-900">Create Account</h2>
        <p className="text-neutral-500 mt-1">Start your journey to find your partner</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+91 XXXXXXXXXX"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-neutral-700">Gender</label>
          <div className="flex gap-4">
            {['Male', 'Female'].map((gender) => (
              <label key={gender} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value={gender.toLowerCase()}
                  checked={formData.gender === gender.toLowerCase()}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="text-primary-500"
                />
                <span className="text-neutral-600">{gender}</span>
              </label>
            ))}
          </div>
        </div>

        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        />

        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" className="rounded border-neutral-300 mt-1" />
          <span className="text-neutral-600">
            I agree to the <a href="#" className="text-primary-500">Terms of Service</a> and{' '}
            <a href="#" className="text-primary-500">Privacy Policy</a>
          </span>
        </label>

        <Button type="submit" className="w-full">
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-neutral-600">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
          Sign In
        </Link>
      </p>
    </div>
  )
}
