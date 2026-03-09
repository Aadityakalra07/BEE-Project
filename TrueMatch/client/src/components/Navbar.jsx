import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={() => setMenuOpen(false)}
      className={`text-[13px] font-medium tracking-wide transition-colors duration-200 ${
        isActive(to) ? 'text-gray-900' : 'text-gray-400 hover:text-gray-900'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-1.5 text-lg font-bold tracking-tight text-gray-900">
            <span className="text-brand-500">True</span>Match
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                {navLink('/dashboard', 'Dashboard')}
                {navLink('/search', 'Search')}
                {navLink('/interests', 'Interests')}
                {navLink('/favourites', 'Favourites')}
                {user.role === 'admin' && navLink('/admin', 'Admin')}
                <button
                  onClick={handleLogout}
                  className="ml-1 text-[13px] font-medium text-gray-400 hover:text-gray-900 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {navLink('/login', 'Sign in')}
                <Link
                  to="/register"
                  className="text-[13px] font-semibold bg-gray-900 hover:bg-black text-white px-5 py-2 rounded-full transition-all duration-200"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden flex flex-col gap-[5px] p-2 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-[1.5px] bg-gray-900 transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
            <span className={`block w-5 h-[1.5px] bg-gray-900 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-[1.5px] bg-gray-900 transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-5 pt-3 flex flex-col gap-3 border-t border-gray-100 animate-fade-in">
            {user ? (
              <>
                {navLink('/dashboard', 'Dashboard')}
                {navLink('/search', 'Search Profiles')}
                {navLink('/interests', 'Interests')}
                {navLink('/favourites', 'Favourites')}
                {user.role === 'admin' && navLink('/admin', 'Admin Panel')}
                <button onClick={handleLogout} className="text-left text-[13px] font-medium text-gray-400 hover:text-gray-900">
                  Logout
                </button>
              </>
            ) : (
              <>
                {navLink('/login', 'Sign in')}
                <Link to="/register" onClick={() => setMenuOpen(false)} className="text-[13px] font-semibold text-gray-900">
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
