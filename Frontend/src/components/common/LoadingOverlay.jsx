import LoadingSpinner from './LoadingSpinner';

/**
 * Loading overlay component for covering content during async operations
 */
const LoadingOverlay = ({
  isLoading = false,
  message = 'Loading...',
  children,
  className = '',
  spinnerSize = 'lg',
  backdrop = true,
  transparent = false,
}) => {
  if (!isLoading) {
    return children;
  }

  const overlayClasses = `
    absolute inset-0 flex flex-col items-center justify-center z-50
    ${backdrop ? (transparent ? 'bg-white bg-opacity-75' : 'bg-gray-50 bg-opacity-90') : ''}
    ${className}
  `;

  return (
    <div className="relative">
      {children}
      <div className={overlayClasses}>
        <LoadingSpinner size={spinnerSize} />
        {message && (
          <p className="mt-4 text-sm text-gray-600 text-center max-w-xs">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * Full screen loading overlay
 */
export const FullScreenLoader = ({
  isLoading = false,
  message = 'Loading...',
  spinnerSize = 'xl',
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50">
      <LoadingSpinner size={spinnerSize} />
      {message && (
        <p className="mt-6 text-lg text-gray-600 text-center max-w-md">
          {message}
        </p>
      )}
    </div>
  );
};

/**
 * Inline loading component
 */
export const InlineLoader = ({
  isLoading = false,
  message = 'Loading...',
  spinnerSize = 'sm',
  className = '',
}) => {
  if (!isLoading) return null;

  return (
    <div className={`flex items-center justify-center py-4 ${className}`}>
      <LoadingSpinner size={spinnerSize} />
      {message && (
        <span className="ml-3 text-sm text-gray-600">{message}</span>
      )}
    </div>
  );
};

/**
 * Button loading state
 */
export const LoadingButton = ({
  isLoading = false,
  loadingText = 'Loading...',
  children,
  disabled = false,
  className = '',
  spinnerSize = 'sm',
  ...props
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`relative ${className}`}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size={spinnerSize} />
        </div>
      )}
      <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
        {isLoading ? loadingText : children}
      </span>
    </button>
  );
};

/**
 * Skeleton loader for content placeholders
 */
export const SkeletonLoader = ({
  lines = 3,
  className = '',
  animate = true,
}) => {
  const animationClass = animate ? 'animate-pulse' : '';

  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-gray-200 rounded ${animationClass}`}
          style={{
            width: `${Math.random() * 40 + 60}%`,
          }}
        />
      ))}
    </div>
  );
};

/**
 * Card skeleton loader
 */
export const CardSkeleton = ({
  showAvatar = false,
  showImage = false,
  lines = 3,
  className = '',
}) => {
  return (
    <div className={`bg-white shadow rounded-lg p-6 ${className}`}>
      <div className="animate-pulse">
        {showImage && (
          <div className="h-48 bg-gray-200 rounded mb-4" />
        )}
        
        <div className="flex items-center mb-4">
          {showAvatar && (
            <div className="h-10 w-10 bg-gray-200 rounded-full mr-3" />
          )}
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
        
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className="h-3 bg-gray-200 rounded"
              style={{
                width: `${Math.random() * 30 + 70}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Table skeleton loader
 */
export const TableSkeleton = ({
  rows = 5,
  columns = 4,
  className = '',
}) => {
  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      <div className="animate-pulse">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, index) => (
              <div key={index} className="h-4 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4 border-b border-gray-200">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="h-4 bg-gray-200 rounded"
                  style={{
                    width: `${Math.random() * 40 + 60}%`,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Hook for managing loading states
 */
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [loadingMessage, setLoadingMessage] = useState('');

  const startLoading = (message = '') => {
    setIsLoading(true);
    setLoadingMessage(message);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setLoadingMessage('');
  };

  const withLoading = async (asyncFn, message = '') => {
    startLoading(message);
    try {
      const result = await asyncFn();
      return result;
    } finally {
      stopLoading();
    }
  };

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
    withLoading,
  };
};

export default LoadingOverlay;