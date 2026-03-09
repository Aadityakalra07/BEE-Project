import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: '🔒', title: '100% Verified Profiles', desc: 'Every profile is manually verified by our admin team to ensure authenticity and safety.' },
  { icon: '🔍', title: 'Advanced Search', desc: 'Filter by age, religion, city, profession and more to find your ideal match quickly.' },
  { icon: '💑', title: 'Send Interests', desc: 'Express your interest and connect directly with compatible profiles in seconds.' },
  { icon: '🛡️', title: 'Safe & Secure', desc: 'Your data is fully encrypted and we employ robust privacy measures at every level.' },
  { icon: '📱', title: 'Mobile Friendly', desc: 'Access TrueMatch beautifully from any device — desktop, tablet, or mobile.' },
  { icon: '❤️', title: 'All Communities', desc: 'Open to all religions, castes, cities and professions from every corner of India.' },
];

const stats = [
  { value: '50,000+', label: 'Registered Members' },
  { value: '12,000+', label: 'Successful Matches' },
  { value: '98%', label: 'Verified Profiles' },
  { value: '150+', label: 'Cities Covered' },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-accent-dark via-accent to-brand-500 text-white">
        {/* decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-white/5 rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
          <span className="inline-block bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 animate-fade-in">
            🎉 India's Most Trusted Matrimonial Platform
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-slide-up">
            Find Your Perfect
            <span className="block text-accent-light"> Life Partner</span>
          </h1>

          <p className="max-w-xl mx-auto text-base sm:text-lg text-white/80 leading-relaxed mb-10 animate-slide-up">
            TrueMatch connects you with compatible partners based on your preferences. Join thousands of happy families who found love through our platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            {user ? (
              <Link
                to="/dashboard"
                className="px-8 py-3.5 bg-white text-brand-500 font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-3.5 bg-white text-brand-500 font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                  Register Free
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3.5 border-2 border-white text-white font-semibold rounded-2xl hover:bg-white/10 transition-all duration-200"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-cream border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-extrabold text-brand-500">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-accent-dark">Why Choose TrueMatch?</h2>
          <p className="mt-3 text-gray-500 max-w-lg mx-auto">We provide all the tools you need to find the right partner in a safe, trusted environment.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {features.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="group bg-white rounded-2xl p-7 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 border border-gray-50"
            >
              <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-2xl mb-5">
                {icon}
              </div>
              <h3 className="font-bold text-accent-dark text-base mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      {!user && (
        <section className="bg-gradient-to-r from-brand-500 to-brand-600 text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h2 className="text-3xl font-extrabold mb-4">Ready to Find Your Match?</h2>
            <p className="text-white/80 mb-8">Create your free profile and let TrueMatch do the rest.</p>
            <Link
              to="/register"
              className="inline-block px-10 py-3.5 bg-white text-brand-500 font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              Get Started — It's Free
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
