import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200 bg-white';
const labelCls = 'block text-xs font-semibold text-gray-500 mb-1.5';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

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
      if (userData.role === 'admin') {
        navigate('/admin');
      } else if (userData.isProfileComplete) {
        navigate('/dashboard');
      } else {
        navigate('/create-profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
          <h2 className="mt-4 text-2xl font-bold text-accent-dark">Welcome Back</h2>
          <p className="mt-1 text-sm text-gray-500">Login to your TrueMatch account</p>
        </div>

        <div className="bg-white rounded-3xl shadow-card-hover p-8">
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelCls}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className={labelCls}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-5 p-3 bg-gray-50 rounded-xl text-xs text-gray-400 text-center">
            Demo: <span className="font-mono">admin@truematch.com</span> / <span className="font-mono">password123</span>
          </div>

          <p className="mt-5 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-500 font-semibold hover:text-brand-600">
              Register free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
