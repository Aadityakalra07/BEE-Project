import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-accent-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-1 text-2xl font-extrabold tracking-tight mb-3">
              <span className="text-brand-400">True</span>
              <span className="text-white">Match</span>
              <span className="ml-1 text-xs font-medium bg-brand-500 px-1.5 py-0.5 rounded-full">❤</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Find your perfect life partner. Trusted by thousands of families across India for safe and secure matchmaking.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[['/', 'Home'], ['/search', 'Search Profiles'], ['/register', 'Register Free'], ['/login', 'Login']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-gray-400 hover:text-white transition-colors duration-150">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">Support</h4>
            <ul className="space-y-2">
              {['Help Center', 'Safety Tips', 'Privacy Policy', 'Terms of Service'].map((label) => (
                <li key={label}>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-150">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} TrueMatch. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">Built with ❤ as a college project</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
