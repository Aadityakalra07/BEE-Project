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
    <footer className="bg-[#fafaf9] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-16">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-lg font-bold tracking-tight text-gray-900">
              <span className="text-brand-500">True</span>Match
            </Link>
            <p className="mt-3 text-[13px] leading-relaxed text-gray-400 max-w-xs">
              A modern matchmaking platform designed to help you find your perfect life partner.
            </p>
          </div>

          {footerLinks.map((section) => (
            <div key={section.heading}>
              <h4 className="text-xs font-semibold tracking-widest uppercase text-gray-900 mb-4">
                {section.heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-[13px] text-gray-400 hover:text-gray-900 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-300">
            © {year} TrueMatch. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {['Twitter', 'Instagram', 'LinkedIn'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-xs text-gray-300 hover:text-gray-900 transition-colors duration-200"
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
