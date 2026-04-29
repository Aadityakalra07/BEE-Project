import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', dob: '', password: '', confirmPassword: '', gender: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePreview, setProfilePreview] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (jpg, png, gif, webp)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Profile picture must be less than 5MB');
      return;
    }
    setError('');
    setProfilePic(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.name || !formData.email || !formData.dob || !formData.password || !formData.gender) {
      setError('Please fill in all fields');
      return;
    }
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
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('dob', formData.dob);
      payload.append('password', formData.password);
      payload.append('gender', formData.gender);
      if (profilePic) payload.append('profilePic', profilePic);
      await register(payload);
      navigate('/create-profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-100 dark:bg-dark-bg flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-1.5">
            <span className="text-2xl font-display font-bold tracking-tight">
              <span className="bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">True</span>
              <span className="text-gray-900 dark:text-white">Match</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
          </Link>
          <h2 className="mt-6 text-3xl font-display font-bold text-gray-900 dark:text-white">Create Your Account</h2>
          <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">Join thousands finding their perfect partner</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          {error && (
            <div className="mb-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-premium">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-premium" placeholder="Enter your full name" />
            </div>
            <div>
              <label className="label-premium">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-premium" placeholder="you@example.com" />
            </div>
            <div>
              <label className="label-premium">Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="input-premium"
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 21)).toISOString().split('T')[0]} />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">You must be at least 21 years old to register.</p>
            </div>
            <div>
              <label className="label-premium">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="input-premium">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="label-premium">Profile Picture (Optional)</label>
              <input type="file" accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" onChange={handleProfilePicChange} className="input-premium" />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Max 5MB. Supported: JPG, PNG, GIF, WEBP.</p>
              {profilePreview && (
                <img src={profilePreview} alt="Profile preview" className="mt-3 w-16 h-16 rounded-full object-cover ring-2 ring-brand-200 dark:ring-brand-700" />
              )}
            </div>
            <div>
              <label className="label-premium">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-premium" placeholder="Minimum 6 characters" />
            </div>
            <div>
              <label className="label-premium">Confirm Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="input-premium" placeholder="Re-enter password" />
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary !py-3 mt-2 disabled:opacity-60">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 dark:text-gold-400 font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
