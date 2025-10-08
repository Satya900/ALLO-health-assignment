import { useState, useCallback } from 'react';
import { shouldRetry, getRetryDelay, parseApiError } from '../../utils/errorHandler';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

/**
 * RetryWrapper component that provides automatic retry functionality
 */
const RetryWrapper = ({
  children,
  onRetry,
  maxRetries = 3,
  baseDelay = 1000,
  showRetryButton = true,
  retryButtonText = 'Try Again',
  loadingText = 'Retrying...',
  className = '',
}) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState(null);

  const handleRetry = useCallback(async () => {
    if (!onRetry || retryCount >= maxRetries) return;

    setIsRetrying(true);
    setError(null);

    try {
      // Add delay for exponential backoff
      if (retryCount > 0) {
        const delay = getRetryDelay(retryCount, baseDelay);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      await onRetry();
      setRetryCount(0);
      setError(null);
    } catch (err) {
      const parsedError = parseApiError(err);
      setError(parsedError);
      setRetryCount(prev => prev + 1);

      // Auto-retry if conditions are met
      if (shouldRetry(parsedError, retryCount, maxRetries)) {
        setTimeout(() => {
          handleRetry();
        }, getRetryDelay(retryCount + 1, baseDelay));
      }
    } finally {
      setIsRetrying(false);
    }
  }, [onRetry, retryCount, maxRetries, baseDelay]);

  const handleManualRetry = useCallback(() => {
    setRetryCount(0);
    handleRetry();
  }, [handleRetry]);

  if (isRetrying) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-sm text-gray-600">{loadingText}</p>
        {retryCount > 0 && (
          <p className="mt-2 text-xs text-gray-500">
            Attempt {retryCount + 1} of {maxRetries + 1}
          </p>
        )}
      </div>
    );
  }

  if (error && retryCount >= maxRetries) {
    return (
      <div className={`p-4 ${className}`}>
        <ErrorMessage
          message={error.message}
          type="error"
          dismissible={false}
        />
        {showRetryButton && (
          <div className="mt-4 text-center">
            <button
              onClick={handleManualRetry}
              className="btn-secondary"
            >
              {retryButtonText}
            </button>
            <p className="mt-2 text-xs text-gray-500">
              Failed after {maxRetries + 1} attempts
            </p>
          </div>
        )}
      </div>
    );
  }

  return children;
};

/**
 * Hook for retry functionality
 */
export const useRetry = (operation, options = {}) => {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    autoRetry = true,
  } = options;

  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (...args) => {
    setIsRetrying(true);
    setError(null);

    let currentRetryCount = 0;
    let lastError = null;

    while (currentRetryCount <= maxRetries) {
      try {
        const result = await operation(...args);
        setData(result);
        setRetryCount(0);
        setError(null);
        setIsRetrying(false);
        return result;
      } catch (err) {
        lastError = parseApiError(err);
        setError(lastError);
        setRetryCount(currentRetryCount);

        if (currentRetryCount === maxRetries || !shouldRetry(lastError, currentRetryCount, maxRetries)) {
          break;
        }

        if (autoRetry) {
          const delay = getRetryDelay(currentRetryCount, baseDelay);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          break;
        }

        currentRetryCount++;
      }
    }

    setIsRetrying(false);
    throw lastError;
  }, [operation, maxRetries, baseDelay, autoRetry]);

  const retry = useCallback(() => {
    setRetryCount(0);
    return execute();
  }, [execute]);

  const reset = useCallback(() => {
    setIsRetrying(false);
    setRetryCount(0);
    setError(null);
    setData(null);
  }, []);

  return {
    execute,
    retry,
    reset,
    isRetrying,
    retryCount,
    error,
    data,
    hasError: !!error,
    canRetry: error && retryCount < maxRetries,
  };
};

/**
 * Higher-order component that adds retry functionality
 */
export const withRetry = (Component, retryOptions = {}) => {
  const RetryComponent = (props) => {
    const retry = useRetry(props.operation || (() => Promise.resolve()), retryOptions);

    return (
      <Component
        {...props}
        {...retry}
      />
    );
  };

  RetryComponent.displayName = `withRetry(${Component.displayName || Component.name})`;
  
  return RetryComponent;
};

/**
 * Retry button component
 */
export const RetryButton = ({
  onRetry,
  isRetrying = false,
  disabled = false,
  children = 'Try Again',
  className = '',
  ...props
}) => {
  return (
    <button
      onClick={onRetry}
      disabled={disabled || isRetrying}
      className={`btn-secondary ${className}`}
      {...props}
    >
      {isRetrying ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          Retrying...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default RetryWrapper;