import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import ProfileCard from '../components/ProfileCard';
import FilterPanel from '../components/FilterPanel';
import QuickViewModal from '../components/QuickViewModal';
import { ShimmerGrid, ShimmerProfileRow } from '../components/Shimmer';

/* ── View Toggle Icons ── */
const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);
const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);
const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="15 18 9 12 15 6" /></svg>
);
const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="9 18 15 12 9 6" /></svg>
);

const PROFILES_PER_PAGE = 12;

const SearchProfiles = () => {
  const [allProfiles, setAllProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [quickViewProfile, setQuickViewProfile] = useState(null);
  const [filters, setFilters] = useState({
    religion: '', city: '', profession: '', minAge: '', maxAge: '', gender: '',
  });

  useEffect(() => { fetchProfiles(); }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const params = {};
      Object.keys(filters).forEach((key) => { if (filters[key]) params[key] = filters[key]; });
      const res = await axios.get('/api/profile/search', { params });
      setAllProfiles(res.data);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error fetching profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  /* ── Sort ── */
  const sortedProfiles = useMemo(() => {
    const sorted = [...allProfiles];
    switch (sortBy) {
      case 'age-asc':  return sorted.sort((a, b) => (a.age || 0) - (b.age || 0));
      case 'age-desc': return sorted.sort((a, b) => (b.age || 0) - (a.age || 0));
      case 'newest':
      default:         return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }, [allProfiles, sortBy]);

  /* ── Pagination ── */
  const totalPages = Math.ceil(sortedProfiles.length / PROFILES_PER_PAGE);
  const paginatedProfiles = sortedProfiles.slice(
    (currentPage - 1) * PROFILES_PER_PAGE,
    currentPage * PROFILES_PER_PAGE
  );

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ── Page numbers for pagination ── */
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-surface-100 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Search Profiles</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Find your perfect match using filters</p>
        </div>

        <FilterPanel filters={filters} setFilters={setFilters} onSearch={fetchProfiles} />

        {/* Toolbar: count + sort + view toggle */}
        {!loading && allProfiles.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-900 dark:text-white">
                {(currentPage - 1) * PROFILES_PER_PAGE + 1}–{Math.min(currentPage * PROFILES_PER_PAGE, sortedProfiles.length)}
              </span> of <span className="font-semibold text-gray-900 dark:text-white">{sortedProfiles.length}</span> profiles
            </p>

            <div className="flex items-center gap-3">
              {/* Sort dropdown */}
              <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="input-premium !w-auto !py-2 text-xs">
                <option value="newest">Newest First</option>
                <option value="age-asc">Age: Low → High</option>
                <option value="age-desc">Age: High → Low</option>
              </select>

              {/* View toggle */}
              <div className="flex rounded-xl overflow-hidden border border-brand-100 dark:border-dark-border">
                <button onClick={() => setViewMode('grid')}
                  className={`p-2.5 transition-all ${viewMode === 'grid' ? 'bg-gradient-brand text-white' : 'bg-white dark:bg-dark-card text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                  aria-label="Grid view">
                  <GridIcon />
                </button>
                <button onClick={() => setViewMode('list')}
                  className={`p-2.5 transition-all ${viewMode === 'list' ? 'bg-gradient-brand text-white' : 'bg-white dark:bg-dark-card text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                  aria-label="List view">
                  <ListIcon />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          viewMode === 'grid'
            ? <ShimmerGrid count={8} cols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />
            : <div className="space-y-4">{Array.from({ length: 6 }).map((_, i) => <ShimmerProfileRow key={i} />)}</div>
        ) : paginatedProfiles.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProfiles.map((profile) => (
                  <ProfileCard key={profile._id} profile={profile} viewMode="grid" onQuickView={setQuickViewProfile} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {paginatedProfiles.map((profile) => (
                  <ProfileCard key={profile._id} profile={profile} viewMode="list" onQuickView={setQuickViewProfile} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}
                  className="w-10 h-10 rounded-xl flex items-center justify-center glass-card disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-card-hover transition-all text-gray-600 dark:text-gray-300">
                  <ChevronLeft />
                </button>

                {pageNumbers[0] > 1 && (
                  <>
                    <button onClick={() => goToPage(1)}
                      className="w-10 h-10 rounded-xl flex items-center justify-center glass-card hover:shadow-card-hover text-sm font-semibold text-gray-600 dark:text-gray-300">1</button>
                    {pageNumbers[0] > 2 && <span className="text-gray-400 px-1">…</span>}
                  </>
                )}

                {pageNumbers.map((page) => (
                  <button key={page} onClick={() => goToPage(page)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-all ${
                      currentPage === page
                        ? 'bg-gradient-brand text-white shadow-glow'
                        : 'glass-card text-gray-600 dark:text-gray-300 hover:shadow-card-hover'
                    }`}>{page}</button>
                ))}

                {pageNumbers[pageNumbers.length - 1] < totalPages && (
                  <>
                    {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="text-gray-400 px-1">…</span>}
                    <button onClick={() => goToPage(totalPages)}
                      className="w-10 h-10 rounded-xl flex items-center justify-center glass-card hover:shadow-card-hover text-sm font-semibold text-gray-600 dark:text-gray-300">{totalPages}</button>
                  </>
                )}

                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-xl flex items-center justify-center glass-card disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-card-hover transition-all text-gray-600 dark:text-gray-300">
                  <ChevronRight />
                </button>
              </div>
            )}
          </>
        ) : (
          /* ── Animated Empty State ── */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="relative w-32 h-32 mb-6">
              {/* Animated rings */}
              <div className="absolute inset-0 rounded-full border-4 border-brand-200/30 dark:border-brand-800/30 animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-2 rounded-full border-4 border-gold-300/20 dark:border-gold-700/20 animate-ping" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-100 to-gold-100 dark:from-brand-900/50 dark:to-gold-900/50 flex items-center justify-center animate-float">
                  <span className="text-4xl">🔍</span>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">No profiles found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Try adjusting your filters or check back later. New profiles are added every day!
            </p>
            <button onClick={() => { setFilters({ religion: '', city: '', profession: '', minAge: '', maxAge: '', gender: '' }); fetchProfiles(); }}
              className="btn-secondary text-sm mt-6">
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProfile && (
        <QuickViewModal profile={quickViewProfile} onClose={() => setQuickViewProfile(null)} />
      )}
    </div>
  );
};

export default SearchProfiles;
