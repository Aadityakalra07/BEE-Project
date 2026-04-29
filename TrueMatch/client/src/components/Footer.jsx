import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  const footerLinks = [
    {
      heading: 'Product',
      links: [
        { label: 'Search Profiles', to: '/search' },
        { label: 'Create Profile', to: '/create-profile' },
        { label: 'Dashboard', to: '/dashboard' },
      ],
    },
    {
      heading: 'Support',
      links: [
        { label: 'Help Center', to: '#' },
        { label: 'Privacy Policy', to: '#' },
        { label: 'Terms of Use', to: '#' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About', to: '#' },
        { label: 'Blog', to: '#' },
        { label: 'Careers', to: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-surface-100 dark:bg-dark-bg border-t border-brand-100/30 dark:border-dark-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-16">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-1.5">
              <span className="text-lg font-display font-bold tracking-tight">
                <span className="bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">True</span>
                <span className="text-gray-900 dark:text-white">Match</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
            </Link>
            <p className="mt-3 text-[13px] leading-relaxed text-gray-400 dark:text-gray-500 max-w-xs">
              A premium matchmaking platform designed to help you find your perfect life partner.
            </p>
          </div>

          {footerLinks.map((section) => (
            <div key={section.heading}>
              <h4 className="text-xs font-semibold tracking-widest uppercase text-brand-700 dark:text-gold-400 mb-4">
                {section.heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-[13px] text-gray-400 dark:text-gray-500 hover:text-brand-600 dark:hover:text-gold-300 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-brand-100/30 dark:border-dark-border/30 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-300 dark:text-gray-600">
            © {year} TrueMatch. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {['Twitter', 'Instagram', 'LinkedIn'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-xs text-gray-300 dark:text-gray-600 hover:text-brand-500 dark:hover:text-gold-400 transition-colors duration-200"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
