import { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileCard from '../components/ProfileCard';
import FilterPanel from '../components/FilterPanel';

const Spinner = () => (
  <div className="flex items-center justify-center py-24">
    <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const SearchProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    religion: '', city: '', profession: '', minAge: '', maxAge: '', gender: '',
  });

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const params = {};
      Object.keys(filters).forEach((key) => {
        if (filters[key]) params[key] = filters[key];
      });
      const res = await axios.get('/api/profile/search', { params });
      setProfiles(res.data);
    } catch (err) {
      console.error('Error fetching profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-extrabold text-accent-dark">Search Profiles</h1>
          <p className="text-sm text-gray-500 mt-1">Find your perfect match using filters</p>
        </div>

        <FilterPanel filters={filters} setFilters={setFilters} onSearch={fetchProfiles} />

        {loading ? (
          <Spinner />
        ) : profiles.length > 0 ? (
          <>
            <p className="text-sm text-gray-500 mb-5">
              Showing <span className="font-semibold text-accent-dark">{profiles.length}</span> profile{profiles.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {profiles.map((profile) => (
                <ProfileCard key={profile._id} profile={profile} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-24 text-gray-400">
            <div className="text-5xl mb-4">ðŸ”</div>
            <h3 className="text-lg font-semibold text-gray-500">No profiles found</h3>
            <p className="text-sm mt-2">Try adjusting your filters or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchProfiles;
