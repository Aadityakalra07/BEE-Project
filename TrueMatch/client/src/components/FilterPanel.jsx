const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-200 bg-white";
const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

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
    <div className="bg-white rounded-2xl shadow-card p-5 mb-7">
      <h3 className="text-sm font-bold text-accent-dark mb-4 flex items-center gap-2">
        <span className="text-brand-500">ðŸ”</span> Filter Profiles
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className={labelCls}>Gender</label>
            <select name="gender" value={filters.gender} onChange={handleChange} className={inputCls}>
              <option value="">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Religion</label>
            <input
              type="text"
              name="religion"
              value={filters.religion}
              onChange={handleChange}
              className={inputCls}
              placeholder="e.g. Hindu"
            />
          </div>

          <div>
            <label className={labelCls}>City</label>
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleChange}
              className={inputCls}
              placeholder="e.g. Mumbai"
            />
          </div>

          <div>
            <label className={labelCls}>Profession</label>
            <input
              type="text"
              name="profession"
              value={filters.profession}
              onChange={handleChange}
              className={inputCls}
              placeholder="e.g. Engineer"
            />
          </div>

          <div>
            <label className={labelCls}>Min Age</label>
            <input
              type="number"
              name="minAge"
              value={filters.minAge}
              onChange={handleChange}
              className={inputCls}
              placeholder="18"
              min="18"
            />
          </div>

          <div>
            <label className={labelCls}>Max Age</label>
            <input
              type="number"
              name="maxAge"
              value={filters.maxAge}
              onChange={handleChange}
              className={inputCls}
              placeholder="60"
              max="100"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            type="submit"
            className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2.5 border border-gray-300 hover:border-gray-400 text-gray-600 text-sm font-semibold rounded-xl transition-all duration-200"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterPanel;
