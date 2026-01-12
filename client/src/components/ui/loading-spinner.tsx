/**
 * LoadingSpinner Component
 * Reusable loading spinner for buttons and inline loading states
 * Design: Mobile-native banking app style
 */

interface LoadingSpinnerProps {
  variant?: "dots" | "spinner" | "pulse";
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white" | "gray";
  className?: string;
}

export function LoadingSpinner({
  variant = "spinner",
  size = "md",
  color = "primary",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const colorClasses = {
    primary: "text-[#2e7146]",
    white: "text-white",
    gray: "text-gray-400",
  };

  if (variant === "dots") {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <div className={`${sizeClasses[size]} rounded-full bg-current animate-bounce`} />
        <div
          className={`${sizeClasses[size]} rounded-full bg-current animate-bounce`}
          style={{ animationDelay: "0.1s" }}
        />
        <div
          className={`${sizeClasses[size]} rounded-full bg-current animate-bounce`}
          style={{ animationDelay: "0.2s" }}
        />
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-current animate-pulse ${className}`} />
    );
  }

  // Default spinner variant
  return (
    <div className={`${className}`}>
      <svg
        className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}

/**
 * ButtonLoader Component
 * Loading state for buttons with text
 */
interface ButtonLoaderProps {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
  className?: string;
}

export function ButtonLoader({
  isLoading,
  loadingText = "Loading...",
  children,
  className = "",
}: ButtonLoaderProps) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {isLoading && <LoadingSpinner variant="spinner" size="sm" color="white" />}
      <span>{isLoading ? loadingText : children}</span>
    </div>
  );
}

/**
 * InlineLoader Component
 * Inline loading indicator for form fields
 */
interface InlineLoaderProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}

export function InlineLoader({
  isLoading,
  message = "Processing...",
  className = "",
}: InlineLoaderProps) {
  if (!isLoading) return null;

  return (
    <div className={`flex items-center gap-2 text-sm text-gray-600 ${className}`}>
      <LoadingSpinner variant="dots" size="sm" color="gray" />
      <span>{message}</span>
    </div>
  );
}

/**
 * FullPageLoader Component
 * Full screen loading overlay
 */
interface FullPageLoaderProps {
  isLoading: boolean;
  message?: string;
}

export function FullPageLoader({ isLoading, message = "Loading..." }: FullPageLoaderProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4">
        <LoadingSpinner variant="spinner" size="lg" color="primary" />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
}
