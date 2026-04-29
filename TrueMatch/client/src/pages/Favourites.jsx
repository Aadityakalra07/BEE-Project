import { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileCard from '../components/ProfileCard';
import { ShimmerGrid } from '../components/Shimmer';

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      try { const res = await axios.get('/api/profile/favourites'); setFavourites(res.data); }
      catch (err) { console.error('Error fetching favourites:', err); }
      finally { setLoading(false); }
    };
    fetchFavourites();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-surface-100 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="shimmer h-10 w-48 rounded-xl mb-7" />
        <ShimmerGrid count={4} cols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-100 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-7">
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">My Favourites ⭐</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Profiles you have saved</p>
        </div>
        {favourites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favourites.map((profile) => <ProfileCard key={profile._id} profile={profile} />)}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-400 dark:text-gray-600">
            <div className="text-5xl mb-4">⭐</div>
            <h3 className="text-lg font-display font-semibold text-gray-500 dark:text-gray-400">No favourites yet</h3>
            <p className="text-sm mt-2">Browse profiles and click Favourite to save them here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favourites;
