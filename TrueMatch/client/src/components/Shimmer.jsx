// =============================================
// SHIMMER - Premium Skeleton Loading Component
// Replaces all basic spinner loaders
// =============================================

/**
 * ShimmerBlock – A single shimmer rectangle
 * @param {string} className – additional Tailwind classes
 * @param {string} height – height class (default: h-4)
 */
export const ShimmerBlock = ({ className = '', height = 'h-4' }) => (
  <div className={`shimmer ${height} ${className}`} />
);

/**
 * ShimmerCard – Skeleton for a profile card
 */
export const ShimmerCard = () => (
  <div className="bg-white dark:bg-dark-card rounded-3xl overflow-hidden shadow-card border border-brand-100/30 dark:border-dark-border/30">
    {/* Photo placeholder */}
    <div className="shimmer h-52 rounded-none" />
    {/* Body */}
    <div className="p-5 space-y-3">
      <ShimmerBlock height="h-5" className="w-3/4" />
      <ShimmerBlock height="h-3" className="w-1/2" />
      <ShimmerBlock height="h-3" className="w-2/3" />
      <ShimmerBlock height="h-3" className="w-1/3" />
      <ShimmerBlock height="h-10 mt-4" className="w-full rounded-full" />
    </div>
  </div>
);

/**
 * ShimmerProfileRow – Skeleton for an interest/list row
 */
export const ShimmerProfileRow = () => (
  <div className="bg-white dark:bg-dark-card rounded-2xl shadow-card p-5 flex items-center gap-4">
    <div className="shimmer w-14 h-14 rounded-full shrink-0" />
    <div className="flex-1 space-y-2">
      <ShimmerBlock height="h-4" className="w-1/3" />
      <ShimmerBlock height="h-3" className="w-1/2" />
    </div>
    <div className="shimmer w-20 h-8 rounded-lg shrink-0" />
  </div>
);

/**
 * ShimmerGrid – Grid of shimmer cards (for search/dashboard)
 * @param {number} count – number of skeleton cards
 * @param {string} cols – grid column classes
 */
export const ShimmerGrid = ({ count = 6, cols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' }) => (
  <div className={`grid ${cols} gap-6`}>
    {Array.from({ length: count }).map((_, i) => (
      <ShimmerCard key={i} />
    ))}
  </div>
);

/**
 * ShimmerPage – Full page centered loading skeleton
 */
const ShimmerPage = ({ type = 'cards', count = 6 }) => {
  if (type === 'rows') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <ShimmerProfileRow key={i} />
        ))}
      </div>
    );
  }

  return <ShimmerGrid count={count} />;
};

export default ShimmerPage;
