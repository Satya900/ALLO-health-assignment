/**
 * LoadingSpinner component with different sizes and styles
 * @param {Object} props
 * @param {string} props.size - Size of spinner: 'sm', 'md', 'lg', 'xl'
 * @param {string} props.color - Color theme: 'primary', 'white', 'gray'
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.text - Optional loading text
 */
const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  className = '', 
  text = '' 
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };
  
  // Color classes
  const colorClasses = {
    primary: 'text-blue-600',
    white: 'text-white',
    gray: 'text-gray-400',
  };
  
  // Text size classes
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };
  
  const spinnerClasses = `
    animate-spin 
    ${sizeClasses[size]} 
    ${colorClasses[color]} 
    ${className}
  `.trim();
  
  return (
    <div className="flex items-center justify-center">
      <svg
        className={spinnerClasses}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && (
        <span className={`ml-2 ${colorClasses[color]} ${textSizeClasses[size]}`}>
          {text}
        </span>
      )}
    </div>
  );
};

/**
 * Full page loading spinner
 */
export const PageLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">{text}</p>
      </div>
    </div>
  );
};

/**
 * Inline loading spinner for buttons
 */
export const ButtonSpinner = ({ className = '' }) => {
  return (
    <LoadingSpinner 
      size="sm" 
      color="white" 
      className={className}
    />
  );
};

/**
 * Card loading spinner
 */
export const CardLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="card p-8">
      <div className="text-center">
        <LoadingSpinner size="md" />
        <p className="mt-2 text-gray-600 text-sm">{text}</p>
      </div>
    </div>
  );
};

/**
 * Table loading spinner
 */
export const TableLoader = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="animate-pulse">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 py-3 border-b border-gray-200">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="flex-1 h-4 bg-gray-200 rounded"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * Overlay loading spinner
 */
export const OverlayLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;