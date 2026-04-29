import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

/* ── Sun & Moon icons (inline SVG — no extra deps) ── */
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
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
        isActive(to)
          ? 'text-brand-700 dark:text-gold-400'
          : 'text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-gold-300'
      }`}
    >
      {label}
    </Link>
  );

  /* ── Theme Toggle Button ── */
  const ThemeToggle = () => (
    <button
      onClick={toggleTheme}
      className="relative w-9 h-9 flex items-center justify-center rounded-full
                 bg-brand-50 dark:bg-dark-card text-brand-600 dark:text-gold-400
                 hover:bg-brand-100 dark:hover:bg-dark-border
                 transition-all duration-300 group"
      aria-label="Toggle dark mode"
    >
      <span className="transition-transform duration-300 group-hover:rotate-12">
        {isDark ? <SunIcon /> : <MoonIcon />}
      </span>
    </button>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-xl border-b border-brand-100/50 dark:border-dark-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-1.5 group">
            <span className="text-xl font-display font-bold tracking-tight">
              <span className="bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">True</span>
              <span className="text-gray-900 dark:text-white">Match</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 group-hover:animate-pulse" />
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-7">
            {user ? (
              <>
                {navLink('/dashboard', 'Dashboard')}
                {navLink('/search', 'Search')}
                {navLink('/interests', 'Interests')}
                {navLink('/favourites', 'Favourites')}
                {navLink('/settings', 'Settings')}
                {user.role === 'admin' && navLink('/admin', 'Admin')}
                <ThemeToggle />
                <button
                  onClick={handleLogout}
                  className="ml-1 text-[13px] font-medium text-gray-400 dark:text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {navLink('/login', 'Sign in')}
                <ThemeToggle />
                <Link
                  to="/register"
                  className="btn-primary text-[13px] !px-5 !py-2"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile: theme + hamburger ── */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="flex flex-col gap-[5px] p-2 rounded-lg hover:bg-brand-50 dark:hover:bg-dark-card transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-[1.5px] bg-gray-900 dark:bg-gray-300 transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
              <span className={`block w-5 h-[1.5px] bg-gray-900 dark:bg-gray-300 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-[1.5px] bg-gray-900 dark:bg-gray-300 transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {menuOpen && (
          <div className="md:hidden pb-5 pt-3 flex flex-col gap-3 border-t border-brand-100/50 dark:border-dark-border/50 animate-fade-in">
            {user ? (
              <>
                {navLink('/dashboard', 'Dashboard')}
                {navLink('/search', 'Search Profiles')}
                {navLink('/interests', 'Interests')}
                {navLink('/favourites', 'Favourites')}
                {navLink('/settings', 'Settings')}
                {user.role === 'admin' && navLink('/admin', 'Admin Panel')}
                <button onClick={handleLogout} className="text-left text-[13px] font-medium text-gray-400 hover:text-brand-600 dark:hover:text-brand-400">
                  Logout
                </button>
              </>
            ) : (
              <>
                {navLink('/login', 'Sign in')}
                <Link to="/register" onClick={() => setMenuOpen(false)} className="text-[13px] font-semibold text-brand-600 dark:text-gold-400">
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
