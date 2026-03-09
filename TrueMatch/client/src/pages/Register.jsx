import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200 bg-white';
const labelCls = 'block text-xs font-semibold text-gray-500 mb-1.5';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    password: '',
    confirmPassword: '',
    gender: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.dob || !formData.password || !formData.gender) {
      setError('Please fill in all fields');
      return;
    }

    // Age restriction: must be at least 21
    const today = new Date();
    const birthDate = new Date(formData.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    if (age < 21) {
      setError('You must be at least 21 years old to register');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await register(formData.name, formData.email, formData.password, formData.gender, formData.dob);
      navigate('/create-profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-accent-light/30 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-1 text-2xl font-extrabold">
            <span className="text-brand-500">True</span><span className="text-accent-dark">Match</span>
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-accent-dark">Create Your Account</h2>
          <p className="mt-1 text-sm text-gray-500">Join thousands finding their perfect partner</p>
        </div>

        <div className="bg-white rounded-3xl shadow-card-hover p-8">
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelCls}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputCls}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className={labelCls}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputCls}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className={labelCls}>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={inputCls}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 21)).toISOString().split('T')[0]}
              />
              <p className="text-xs text-gray-400 mt-1">You must be at least 21 years old to register.</p>
            </div>

            <div>
              <label className={labelCls}>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className={inputCls}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={inputCls}
                placeholder="Minimum 6 characters"
              />
            </div>

            <div>
              <label className={labelCls}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={inputCls}
              placeholder="Re-enter password"
            />
          </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-500 font-semibold hover:text-brand-600">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
