const FilterPanel = ({ filters, setFilters, onSearch }) => {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  const handleReset = () => {
    setFilters({ religion: '', city: '', profession: '', minAge: '', maxAge: '', gender: '' });
    onSearch();
  };

  return (
    <div className="glass-card rounded-2xl p-5 mb-7">
      <h3 className="text-sm font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span className="text-brand-500">🔍</span> Filter Profiles
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="label-premium">Gender</label>
            <select name="gender" value={filters.gender} onChange={handleChange} className="input-premium">
              <option value="">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="label-premium">Religion</label>
            <input type="text" name="religion" value={filters.religion} onChange={handleChange} className="input-premium" placeholder="e.g. Hindu" />
          </div>

          <div>
            <label className="label-premium">City</label>
            <input type="text" name="city" value={filters.city} onChange={handleChange} className="input-premium" placeholder="e.g. Mumbai" />
          </div>

          <div>
            <label className="label-premium">Profession</label>
            <input type="text" name="profession" value={filters.profession} onChange={handleChange} className="input-premium" placeholder="e.g. Engineer" />
          </div>

          <div>
            <label className="label-premium">Min Age</label>
            <input type="number" name="minAge" value={filters.minAge} onChange={handleChange} className="input-premium" placeholder="18" min="18" />
          </div>

          <div>
            <label className="label-premium">Max Age</label>
            <input type="number" name="maxAge" value={filters.maxAge} onChange={handleChange} className="input-premium" placeholder="60" max="100" />
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button type="submit" className="btn-primary text-sm">
            Search
          </button>
          <button type="button" onClick={handleReset} className="btn-secondary text-sm">
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterPanel;
