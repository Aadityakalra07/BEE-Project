import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import useSmoothScroll from './hooks/useSmoothScroll';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import InstallPrompt from './components/InstallPrompt';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateProfile from './pages/CreateProfile';
import SearchProfiles from './pages/SearchProfiles';
import ProfileDetails from './pages/ProfileDetails';
import Interests from './pages/Interests';
import Favourites from './pages/Favourites';
import AdminDashboard from './pages/AdminDashboard';
import Settings from './pages/Settings';

/* ── Animated Page Wrapper ── */
const pageVariants = {
  initial: { opacity: 0, y: 16, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit:    { opacity: 0, y: -8, filter: 'blur(2px)' },
};
const pageTransition = { duration: 0.3, ease: [0.22, 1, 0.36, 1] };

const AnimatedPage = ({ children }) => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
    {children}
  </motion.div>
);

/* ── Route Guards ── */
const Loader = () => (
  <div className="flex items-center justify-center min-h-screen bg-surface-100 dark:bg-dark-bg">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 border-[3px] border-brand-200 dark:border-dark-border rounded-full" />
      <div className="absolute inset-0 border-[3px] border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  </div>
);

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" />;
  return user.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

function App() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const location = useLocation();

  // Lenis smooth scroll + GSAP ScrollTrigger integration
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-surface-100 dark:bg-dark-bg">
      <Navbar />

      <main style={{ minHeight: 'calc(100vh - 180px)' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <AnimatedPage><Register /></AnimatedPage>} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <AnimatedPage><Login /></AnimatedPage>} />
            <Route path="/dashboard" element={<PrivateRoute><AnimatedPage><Dashboard /></AnimatedPage></PrivateRoute>} />
            <Route path="/create-profile" element={<PrivateRoute><AnimatedPage><CreateProfile /></AnimatedPage></PrivateRoute>} />
            <Route path="/search" element={<PrivateRoute><AnimatedPage><SearchProfiles /></AnimatedPage></PrivateRoute>} />
            <Route path="/profile/:id" element={<PrivateRoute><AnimatedPage><ProfileDetails /></AnimatedPage></PrivateRoute>} />
            <Route path="/interests" element={<PrivateRoute><AnimatedPage><Interests /></AnimatedPage></PrivateRoute>} />
            <Route path="/favourites" element={<PrivateRoute><AnimatedPage><Favourites /></AnimatedPage></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><AnimatedPage><Settings /></AnimatedPage></PrivateRoute>} />
            <Route path="/admin" element={<AdminRoute><AnimatedPage><AdminDashboard /></AnimatedPage></AdminRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
      <InstallPrompt />

      {/* Branded Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme={isDark ? 'dark' : 'light'}
        toastStyle={{
          background: isDark ? '#232340' : '#ffffff',
          border: `1px solid ${isDark ? 'rgba(45,45,80,0.5)' : 'rgba(194,24,91,0.1)'}`,
          borderRadius: '1rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          fontFamily: '"Inter", sans-serif',
          fontSize: '14px',
          color: isDark ? '#e5e7eb' : '#1a1a2e',
        }}
      />
    </div>
  );
}

export default App;
