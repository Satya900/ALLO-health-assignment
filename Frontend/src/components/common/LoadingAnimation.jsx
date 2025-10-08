/**
 * Enhanced loading animations for better UX
 */

// Medical-themed loading spinner
export const MedicalSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-pulse"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-600 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border border-transparent border-t-blue-400 animate-spin animation-delay-150"></div>
      </div>
    </div>
  );
};

// Pulse loading for cards
export const CardSkeleton = ({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
};

// Table loading skeleton
export const TableSkeleton = ({ rows = 5, columns = 4, className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="flex space-x-4">
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded flex-1"></div>
            ))}
          </div>
        </div>
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4 border-b border-gray-100">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex} className="h-4 bg-gray-200 rounded flex-1"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Stats card loading
export const StatsCardSkeleton = ({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
          <div className="ml-5 flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Full page loading
export const PageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="text-center">
        <div className="mb-8">
          <MedicalSpinner size="xl" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {message}
        </h2>
        <p className="text-gray-600">
          Please wait while we prepare your dashboard
        </p>
        
        {/* Progress dots */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce animation-delay-100"></div>
          <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce animation-delay-200"></div>
        </div>
      </div>
    </div>
  );
};

// Inline loading for buttons
export const ButtonSpinner = ({ size = 'sm' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5'
  };

  return (
    <div className={`${sizeClasses[size]} border-2 border-white border-t-transparent rounded-full animate-spin`}></div>
  );
};

export default {
  MedicalSpinner,
  CardSkeleton,
  TableSkeleton,
  StatsCardSkeleton,
  PageLoader,
  ButtonSpinner
};