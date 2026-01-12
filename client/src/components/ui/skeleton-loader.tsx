/**
 * SkeletonLoader Component
 * Reusable skeleton loader for displaying placeholder content while data loads
 * Design: Mobile-native banking app style with smooth animations
 */

interface SkeletonLoaderProps {
  variant?: "card" | "text" | "avatar" | "button" | "input" | "line";
  count?: number;
  className?: string;
  width?: string;
  height?: string;
}

export function SkeletonLoader({
  variant = "card",
  count = 1,
  className = "",
  width = "w-full",
  height = "h-12",
}: SkeletonLoaderProps) {
  const baseClasses =
    "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-lg";

  const variants = {
    card: `${width} h-32 ${baseClasses} rounded-2xl`,
    text: `${width} h-4 ${baseClasses}`,
    avatar: `w-12 h-12 ${baseClasses} rounded-full`,
    button: `${width} h-12 ${baseClasses} rounded-xl`,
    input: `${width} h-12 ${baseClasses} rounded-lg`,
    line: `${width} h-2 ${baseClasses}`,
  };

  const skeletons = Array.from({ length: count }).map((_, i) => (
    <div key={i} className={`${variants[variant]} ${className}`} />
  ));

  return count === 1 ? skeletons[0] : <div className="space-y-3">{skeletons}</div>;
}

/**
 * PageSkeletonLoader Component
 * Full page skeleton loader for initial page load
 */
export function PageSkeletonLoader() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-[#2e7146]/10 to-[#1d4a2f]/10 px-5 py-6 space-y-3">
        <SkeletonLoader variant="line" width="w-24" height="h-3" />
        <SkeletonLoader variant="text" width="w-40" height="h-6" />
      </div>

      {/* Content Skeleton */}
      <main className="flex-1 px-5 py-6 space-y-4">
        <SkeletonLoader variant="card" />
        <SkeletonLoader variant="card" />
        <SkeletonLoader variant="card" />
      </main>
    </div>
  );
}

/**
 * CardSkeletonLoader Component
 * Skeleton loader for card content
 */
export function CardSkeletonLoader() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
      <SkeletonLoader variant="text" width="w-32" height="h-4" />
      <SkeletonLoader variant="line" count={3} />
      <SkeletonLoader variant="button" />
    </div>
  );
}

/**
 * ListSkeletonLoader Component
 * Skeleton loader for list items
 */
export function ListSkeletonLoader({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <SkeletonLoader variant="text" width="w-32" height="h-4" />
            <SkeletonLoader variant="line" width="w-12" height="h-3" />
          </div>
          <SkeletonLoader variant="line" count={2} />
        </div>
      ))}
    </div>
  );
}
