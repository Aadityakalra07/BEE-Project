import { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileCard from '../components/ProfileCard';

const Spinner = () => (
  <div className="flex items-center justify-center min-h-[40vh]">
    <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await axios.get('/api/profile/favourites');
        setFavourites(res.data);
      } catch (err) {
        console.error('Error fetching favourites:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavourites();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-7">
          <h1 className="text-2xl font-extrabold text-accent-dark">My Favourites â­</h1>
          <p className="text-sm text-gray-500 mt-1">Profiles you have saved</p>
        </div>

        {favourites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favourites.map((profile) => (
              <ProfileCard key={profile._id} profile={profile} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-400">
            <div className="text-5xl mb-4">â­</div>
            <h3 className="text-lg font-semibold text-gray-500">No favourites yet</h3>
            <p className="text-sm mt-2">Browse profiles and click Favourite to save them here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favourites;
