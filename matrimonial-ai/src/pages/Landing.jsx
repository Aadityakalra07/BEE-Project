import { Link } from 'react-router-dom'
import { Heart, Shield, Bot, MessageCircle, Calendar, Users, ArrowRight, Star, CheckCircle } from 'lucide-react'
import Button from '../components/ui/Button'

const features = [
  {
    icon: Bot,
    title: 'AI-Powered Matching',
    description: 'Advanced algorithms analyze compatibility across 50+ dimensions for better matches.'
  },
  {
    icon: Shield,
    title: 'Verified Profiles',
    description: 'Every profile undergoes verification for authenticity and safety.'
  },
  {
    icon: MessageCircle,
    title: 'Secure Chat',
    description: 'End-to-end encrypted messaging to protect your conversations.'
  },
  {
    icon: Calendar,
    title: 'Meeting Planner',
    description: 'Built-in tools to schedule and manage meetings with matches.'
  },
  {
    icon: Users,
    title: 'Guardian Mode',
    description: 'Let family members assist in your matrimonial search.'
  },
  {
    icon: Heart,
    title: 'Smart Preferences',
    description: 'Set detailed preferences and let AI find your ideal match.'
  },
]

const stats = [
  { value: '50K+', label: 'Happy Couples' },
  { value: '2M+', label: 'Verified Profiles' },
  { value: '95%', label: 'Match Accuracy' },
  { value: '100+', label: 'Cities Covered' },
]

const testimonials = [
  {
    name: 'Rahul & Priya',
    city: 'Mumbai',
    quote: 'We found each other through the AI matching system. It truly understands what makes people compatible!',
    image: 'https://images.unsplash.com/photo-1522098533979-4b1be15e2f14?w=400'
  },
  {
    name: 'Vikram & Anjali',
    city: 'Delhi',
    quote: 'The guardian mode helped our families connect seamlessly. A modern solution with traditional values.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400'
  },
]

export default function Landing() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
                <Star className="w-4 h-4" />
                Trusted by 50,000+ Families
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-display font-bold text-neutral-900 leading-tight">
                Find Your <span className="text-primary-500">Perfect</span> Life Partner with AI
              </h1>
              
              <p className="text-lg text-neutral-600 max-w-lg">
                Experience the future of matrimony with our AI-powered platform that understands your preferences and values to find your ideal match.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button size="xl">
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="xl">
                    Login
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-neutral-500">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Free to Join
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Verified Profiles
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Secure & Private
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-primary-200 to-secondary-200 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1523246844598-1fa3e25cf5ab?w=600"
                  alt="Happy Couple"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating cards */}
              <div className="absolute -left-8 top-1/4 bg-white rounded-2xl shadow-xl p-4 hidden lg:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">92% Match</p>
                    <p className="text-sm text-neutral-500">Perfect compatibility</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-neutral-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-white">{value}</p>
                <p className="text-neutral-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 mb-4">
              Why Choose MatrimonyAI?
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Our platform combines traditional values with modern technology to help you find your perfect life partner.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="card hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{title}</h3>
                <p className="text-neutral-600 text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-neutral-900 mb-4">
              Success Stories
            </h2>
            <p className="text-neutral-600">Hear from couples who found their soulmates</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map(({ name, city, quote, image }) => (
              <div key={name} className="card">
                <div className="flex items-start gap-4">
                  <img src={image} alt={name} className="w-16 h-16 rounded-full object-cover" />
                  <div>
                    <p className="text-neutral-600 mb-4">"{quote}"</p>
                    <p className="font-semibold text-neutral-900">{name}</p>
                    <p className="text-sm text-neutral-500">{city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of families who have trusted MatrimonyAI to find their life partners.
          </p>
          <Link to="/register">
            <Button variant="outline" size="xl" className="bg-white text-primary-600 border-white hover:bg-white/90">
              Create Free Profile
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
