import React from 'react';

/**
 * Comprehensive error handling utilities
 */

// Error types
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  AUTHENTICATION: 'AUTH_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  SERVER: 'SERVER_ERROR',
  CLIENT: 'CLIENT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
};

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

/**
 * Parse API error response and return standardized error object
 */
export const parseApiError = (error) => {
  // Default error structure
  const defaultError = {
    type: ERROR_TYPES.UNKNOWN,
    severity: ERROR_SEVERITY.MEDIUM,
    message: 'An unexpected error occurred',
    code: null,
    details: null,
    timestamp: new Date().toISOString(),
  };

  // Handle network errors
  if (!error.response) {
    return {
      ...defaultError,
      type: ERROR_TYPES.NETWORK,
      severity: ERROR_SEVERITY.HIGH,
      message: error.message || 'Network error - please check your connection',
      code: 'NETWORK_ERROR',
    };
  }

  const { status, data } = error.response;

  // Handle different HTTP status codes
  switch (status) {
    case 400:
      return {
        ...defaultError,
        type: ERROR_TYPES.VALIDATION,
        severity: ERROR_SEVERITY.LOW,
        message: data?.message || 'Invalid request data',
        code: data?.code || 'BAD_REQUEST',
        details: data?.errors || data?.details,
      };

    case 401:
      return {
        ...defaultError,
        type: ERROR_TYPES.AUTHENTICATION,
        severity: ERROR_SEVERITY.HIGH,
        message: data?.message || 'Authentication required',
        code: data?.code || 'UNAUTHORIZED',
      };

    case 403:
      return {
        ...defaultError,
        type: ERROR_TYPES.AUTHORIZATION,
        severity: ERROR_SEVERITY.MEDIUM,
        message: data?.message || 'Access denied',
        code: data?.code || 'FORBIDDEN',
      };

    case 404:
      return {
        ...defaultError,
        type: ERROR_TYPES.CLIENT,
        severity: ERROR_SEVERITY.LOW,
        message: data?.message || 'Resource not found',
        code: data?.code || 'NOT_FOUND',
      };

    case 409:
      return {
        ...defaultError,
        type: ERROR_TYPES.VALIDATION,
        severity: ERROR_SEVERITY.MEDIUM,
        message: data?.message || 'Conflict with existing data',
        code: data?.code || 'CONFLICT',
        details: data?.details,
      };

    case 422:
      return {
        ...defaultError,
        type: ERROR_TYPES.VALIDATION,
        severity: ERROR_SEVERITY.LOW,
        message: data?.message || 'Validation failed',
        code: data?.code || 'VALIDATION_ERROR',
        details: data?.errors || data?.details,
      };

    case 429:
      return {
        ...defaultError,
        type: ERROR_TYPES.CLIENT,
        severity: ERROR_SEVERITY.MEDIUM,
        message: data?.message || 'Too many requests - please try again later',
        code: data?.code || 'RATE_LIMITED',
      };

    case 500:
      return {
        ...defaultError,
        type: ERROR_TYPES.SERVER,
        severity: ERROR_SEVERITY.HIGH,
        message: data?.message || 'Internal server error',
        code: data?.code || 'INTERNAL_ERROR',
      };

    case 502:
    case 503:
    case 504:
      return {
        ...defaultError,
        type: ERROR_TYPES.SERVER,
        severity: ERROR_SEVERITY.HIGH,
        message: data?.message || 'Service temporarily unavailable',
        code: data?.code || 'SERVICE_UNAVAILABLE',
      };

    default:
      return {
        ...defaultError,
        message: data?.message || `HTTP ${status} error`,
        code: data?.code || `HTTP_${status}`,
        severity: status >= 500 ? ERROR_SEVERITY.HIGH : ERROR_SEVERITY.MEDIUM,
        type: status >= 500 ? ERROR_TYPES.SERVER : ERROR_TYPES.CLIENT,
      };
  }
};

/**
 * Get user-friendly error message based on error type and context
 */
export const getUserFriendlyMessage = (error, context = '') => {
  const contextMessages = {
    login: {
      [ERROR_TYPES.AUTHENTICATION]: 'Invalid email or password',
      [ERROR_TYPES.NETWORK]: 'Unable to connect. Please check your internet connection.',
      [ERROR_TYPES.SERVER]: 'Login service is temporarily unavailable',
    },
    patient: {
      [ERROR_TYPES.VALIDATION]: 'Please check the patient information and try again',
      [ERROR_TYPES.AUTHORIZATION]: 'You do not have permission to access patient records',
      [ERROR_TYPES.NETWORK]: 'Unable to save patient data. Please try again.',
    },
    appointment: {
      [ERROR_TYPES.VALIDATION]: 'Please check the appointment details',
      [ERROR_TYPES.AUTHORIZATION]: 'You do not have permission to manage appointments',
      [ERROR_TYPES.NETWORK]: 'Unable to process appointment. Please try again.',
    },
    queue: {
      [ERROR_TYPES.VALIDATION]: 'Unable to add patient to queue',
      [ERROR_TYPES.AUTHORIZATION]: 'You do not have permission to manage the queue',
      [ERROR_TYPES.NETWORK]: 'Queue service is temporarily unavailable',
    },
  };

  // Try to get context-specific message
  if (context && contextMessages[context] && contextMessages[context][error.type]) {
    return contextMessages[context][error.type];
  }

  // Fall back to generic messages
  const genericMessages = {
    [ERROR_TYPES.NETWORK]: 'Network connection error. Please check your internet connection and try again.',
    [ERROR_TYPES.AUTHENTICATION]: 'Please log in to continue.',
    [ERROR_TYPES.AUTHORIZATION]: 'You do not have permission to perform this action.',
    [ERROR_TYPES.VALIDATION]: 'Please check your input and try again.',
    [ERROR_TYPES.SERVER]: 'Server error. Please try again later.',
    [ERROR_TYPES.CLIENT]: 'Request error. Please try again.',
    [ERROR_TYPES.UNKNOWN]: 'An unexpected error occurred. Please try again.',
  };

  return genericMessages[error.type] || error.message || 'An unexpected error occurred';
};

/**
 * Determine if error should trigger a retry mechanism
 */
export const shouldRetry = (error, retryCount = 0, maxRetries = 3) => {
  if (retryCount >= maxRetries) {
    return false;
  }

  // Retry for network errors and server errors (5xx)
  return error.type === ERROR_TYPES.NETWORK || 
         error.type === ERROR_TYPES.SERVER ||
         (error.code && error.code.includes('TIMEOUT'));
};

/**
 * Calculate retry delay with exponential backoff
 */
export const getRetryDelay = (retryCount, baseDelay = 1000) => {
  return Math.min(baseDelay * Math.pow(2, retryCount), 10000); // Max 10 seconds
};

/**
 * Log error to external service (mock implementation)
 */
export const logError = (error, context = {}) => {
  const errorLog = {
    ...error,
    context,
    userAgent: navigator.userAgent,
    url: window.location.href,
    userId: context.userId || 'anonymous',
    sessionId: context.sessionId || 'unknown',
  };

  // In production, send to error tracking service
  console.error('Error logged:', errorLog);

  // Mock API call to error logging service
  if (process.env.NODE_ENV === 'production') {
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorLog),
    // }).catch(console.error);
  }
};

/**
 * Create retry function with exponential backoff
 */
export const createRetryFunction = (fn, maxRetries = 3, baseDelay = 1000) => {
  return async (...args) => {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = parseApiError(error);
        
        if (attempt === maxRetries || !shouldRetry(lastError, attempt, maxRetries)) {
          throw lastError;
        }
        
        const delay = getRetryDelay(attempt, baseDelay);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  };
};

/**
 * Error handler for async operations
 */
export const handleAsyncError = async (asyncFn, context = {}) => {
  try {
    return await asyncFn();
  } catch (error) {
    const parsedError = parseApiError(error);
    logError(parsedError, context);
    throw parsedError;
  }
};

/**
 * React hook for error handling
 */
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);
  const [isRetrying, setIsRetrying] = React.useState(false);

  const handleError = React.useCallback((error, context = {}) => {
    const parsedError = parseApiError(error);
    logError(parsedError, context);
    setError(parsedError);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
    setIsRetrying(false);
  }, []);

  const retryOperation = React.useCallback(async (operation) => {
    if (!operation) return;
    
    setIsRetrying(true);
    try {
      await operation();
      clearError();
    } catch (error) {
      handleError(error);
    } finally {
      setIsRetrying(false);
    }
  }, [handleError, clearError]);

  return {
    error,
    isRetrying,
    handleError,
    clearError,
    retryOperation,
    hasError: !!error,
  };
};

export default {
  parseApiError,
  getUserFriendlyMessage,
  shouldRetry,
  getRetryDelay,
  logError,
  createRetryFunction,
  handleAsyncError,
  useErrorHandler,
  ERROR_TYPES,
  ERROR_SEVERITY,
};