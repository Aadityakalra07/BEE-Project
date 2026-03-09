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
      className={`text-sm font-medium transition-colors duration-150 ${
        isActive(to)
          ? 'text-brand-500'
          : 'text-accent-dark hover:text-brand-500'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-1 text-xl font-extrabold tracking-tight">
            <span className="text-brand-500">True</span>
            <span className="text-accent-dark">Match</span>
            <span className="ml-1 text-xs font-medium text-white bg-brand-500 px-1.5 py-0.5 rounded-full">â¤</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            {user ? (
              <>
                {navLink('/dashboard', 'Dashboard')}
                {navLink('/search', 'Search')}
                {navLink('/interests', 'Interests')}
                {navLink('/favourites', 'Favourites')}
                {user.role === 'admin' && navLink('/admin', 'Admin')}
                <button
                  onClick={handleLogout}
                  className="ml-2 text-sm font-semibold border border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-white px-4 py-1.5 rounded-xl transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {navLink('/login', 'Login')}
                <Link
                  to="/register"
                  className="text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white px-5 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Register Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-accent-dark transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-accent-dark transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-accent-dark transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 flex flex-col gap-3 border-t border-gray-100 animate-fade-in">
            {user ? (
              <>
                {navLink('/dashboard', 'Dashboard')}
                {navLink('/search', 'Search Profiles')}
                {navLink('/interests', 'Interests')}
                {navLink('/favourites', 'Favourites')}
                {user.role === 'admin' && navLink('/admin', 'Admin Panel')}
                <button
                  onClick={handleLogout}
                  className="text-left text-sm font-semibold text-brand-500 hover:text-brand-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {navLink('/login', 'Login')}
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-semibold text-brand-500"
                >
                  Register Free
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
