/**
 * ErrorMessage component for displaying user-friendly errors
 * @param {Object} props
 * @param {string} props.message - Error message to display
 * @param {string} props.title - Optional error title
 * @param {string} props.type - Error type: 'error', 'warning', 'info'
 * @param {boolean} props.dismissible - Whether error can be dismissed
 * @param {Function} props.onDismiss - Callback when error is dismissed
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Optional children content
 * @param {Function} props.onRetry - Optional retry callback
 */
const ErrorMessage = ({
  message,
  title,
  type = 'error',
  dismissible = false,
  onDismiss,
  className = '',
  children,
  onRetry,
}) => {
  // Type-specific styles
  const typeStyles = {
    error: {
      container: 'bg-red-50 border-red-200',
      icon: 'text-red-400',
      title: 'text-red-800',
      message: 'text-red-700',
      button: 'text-red-800 hover:bg-red-100',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200',
      icon: 'text-yellow-400',
      title: 'text-yellow-800',
      message: 'text-yellow-700',
      button: 'text-yellow-800 hover:bg-yellow-100',
    },
    info: {
      container: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-400',
      title: 'text-blue-800',
      message: 'text-blue-700',
      button: 'text-blue-800 hover:bg-blue-100',
    },
  };

  const styles = typeStyles[type];

  // Type-specific icons
  const icons = {
    error: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    warning: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
    ),
    info: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  if (!message && !children) {
    return null;
  }

  return (
    <div className={`border rounded-lg p-4 ${styles.container} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <span className={styles.icon}>{icons[type]}</span>
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${styles.title}`}>{title}</h3>
          )}
          {message && (
            <div className={`${title ? 'mt-2' : ''} text-sm ${styles.message}`}>
              <p>{message}</p>
            </div>
          )}
          {children && (
            <div className={`${title || message ? 'mt-2' : ''} text-sm ${styles.message}`}>
              {children}
            </div>
          )}
          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                className={`text-sm font-medium ${styles.button} focus:outline-none focus:underline`}
                onClick={onRetry}
              >
                Try again
              </button>
            </div>
          )}
        </div>
        {dismissible && onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={`inline-flex rounded-md p-1.5 ${styles.button} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600`}
                onClick={onDismiss}
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Inline error message for forms
 */
export const InlineError = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <p className={`mt-1 text-sm text-red-600 ${className}`}>
      {message}
    </p>
  );
};

/**
 * Page-level error message
 */
export const PageError = ({ 
  title = 'Something went wrong', 
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  onGoBack,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">{title}</h2>
          <p className="mt-2 text-sm text-gray-600">{message}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <button onClick={onRetry} className="btn-primary">
              Try Again
            </button>
          )}
          {onGoBack && (
            <button onClick={onGoBack} className="btn-secondary">
              Go Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Network error message
 */
export const NetworkError = ({ onRetry }) => {
  return (
    <ErrorMessage
      type="error"
      title="Connection Error"
      message="Unable to connect to the server. Please check your internet connection and try again."
      onRetry={onRetry}
    />
  );
};

/**
 * Not found error message
 */
export const NotFoundError = ({ resource = 'resource', onGoBack }) => {
  return (
    <ErrorMessage
      type="warning"
      title="Not Found"
      message={`The ${resource} you're looking for doesn't exist or has been removed.`}
    >
      {onGoBack && (
        <button onClick={onGoBack} className="mt-2 text-sm font-medium text-yellow-800 hover:text-yellow-900 focus:outline-none focus:underline">
          Go back
        </button>
      )}
    </ErrorMessage>
  );
};

/**
 * Permission denied error message
 */
export const PermissionError = ({ message = "You don't have permission to access this resource." }) => {
  return (
    <ErrorMessage
      type="warning"
      title="Access Denied"
      message={message}
    />
  );
};

/**
 * Validation error message
 */
export const ValidationError = ({ errors = [], onDismiss }) => {
  if (!errors.length) return null;

  return (
    <ErrorMessage
      type="error"
      title="Please correct the following errors:"
      dismissible={!!onDismiss}
      onDismiss={onDismiss}
    >
      <ul className="mt-2 list-disc list-inside space-y-1">
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </ErrorMessage>
  );
};

export default ErrorMessage;