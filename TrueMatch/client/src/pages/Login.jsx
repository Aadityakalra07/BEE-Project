import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const isGoogleEnabled = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  const handlePostLoginRedirect = (userData) => {
    if (userData.role === 'admin') {
      navigate('/admin');
    } else if (userData.isProfileComplete) {
      navigate('/dashboard');
    } else {
      navigate('/create-profile');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const userData = await login(email, password);
      handlePostLoginRedirect(userData);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError('');
      if (!credentialResponse?.credential) {
        setError('Google sign-in did not return a valid credential');
        return;
      }
      const userData = await loginWithGoogle(credentialResponse.credential);
      handlePostLoginRedirect(userData);
    } catch (err) {
      setError(err.response?.data?.message || 'Google login failed');
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };

  return (
    <div className="min-h-screen bg-surface-100 dark:bg-dark-bg flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-1.5">
            <span className="text-2xl font-display font-bold tracking-tight">
              <span className="bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">True</span>
              <span className="text-gray-900 dark:text-white">Match</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
          </Link>
          <h2 className="mt-6 text-3xl font-display font-bold text-gray-900 dark:text-white">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">Sign in to your TrueMatch account</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          {error && (
            <div className="mb-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-premium">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-premium"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="label-premium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-premium"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary !py-3 mt-2 disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {isGoogleEnabled ? (
            <>
              <div className="my-5 flex items-center gap-3">
                <div className="h-px bg-brand-100 dark:bg-dark-border flex-1" />
                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Or continue with</span>
                <div className="h-px bg-brand-100 dark:bg-dark-border flex-1" />
              </div>

              <div className="flex justify-center">
                <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
              </div>
            </>
          ) : (
            <p className="mt-5 text-xs text-gray-400 dark:text-gray-600 text-center">
              Google login is disabled. Set VITE_GOOGLE_CLIENT_ID to enable it.
            </p>
          )}

          <div className="mt-5 p-3 bg-brand-50/50 dark:bg-dark-card rounded-xl text-xs text-gray-400 dark:text-gray-500 text-center">
            Demo: <span className="font-mono text-brand-600 dark:text-gold-400">admin@truematch.com</span> / <span className="font-mono text-brand-600 dark:text-gold-400">password123</span>
          </div>

          <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-600 dark:text-gold-400 font-semibold hover:underline">
              Register free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
