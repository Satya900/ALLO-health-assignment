import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Debounce function to limit the rate of function calls
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Throttle function to limit function calls to once per interval
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Memoization utility for expensive calculations
 */
export const memoize = (fn, getKey = (...args) => JSON.stringify(args)) => {
  const cache = new Map();
  
  return (...args) => {
    const key = getKey(...args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    // Limit cache size to prevent memory leaks
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    return result;
  };
};

/**
 * React hooks for performance optimization
 */

/**
 * Debounced value hook
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Debounced callback hook
 */
export const useDebouncedCallback = (callback, delay, deps = []) => {
  const timeoutRef = useRef(null);

  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay, ...deps]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

/**
 * Throttled callback hook
 */
export const useThrottledCallback = (callback, limit, deps = []) => {
  const lastRun = useRef(Date.now());

  const throttledCallback = useCallback((...args) => {
    if (Date.now() - lastRun.current >= limit) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, limit, ...deps]);

  return throttledCallback;
};

/**
 * Intersection Observer hook for lazy loading
 */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [hasIntersected, options]);

  return {
    targetRef,
    isIntersecting,
    hasIntersected,
  };
};

/**
 * Virtual scrolling hook for large lists
 */
export const useVirtualScroll = ({
  items = [],
  itemHeight = 50,
  containerHeight = 400,
  overscan = 5,
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef(null);

  const visibleItemsCount = Math.ceil(containerHeight / itemHeight);
  const totalHeight = items.length * itemHeight;
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    startIndex + visibleItemsCount + overscan * 2
  );

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      ...item,
      index: startIndex + index,
      offsetY: (startIndex + index) * itemHeight,
    }));
  }, [items, startIndex, endIndex, itemHeight]);

  const handleScroll = useThrottledCallback((event) => {
    setScrollTop(event.target.scrollTop);
  }, 16); // ~60fps

  return {
    scrollElementRef,
    visibleItems,
    totalHeight,
    handleScroll,
    scrollToIndex: (index) => {
      if (scrollElementRef.current) {
        scrollElementRef.current.scrollTop = index * itemHeight;
      }
    },
  };
};

/**
 * Memoized component wrapper
 */
export const memo = (Component, areEqual) => {
  return React.memo(Component, areEqual);
};

/**
 * Performance monitoring hook
 */
export const usePerformanceMonitor = (name) => {
  const startTimeRef = useRef(null);

  const start = useCallback(() => {
    startTimeRef.current = performance.now();
  }, []);

  const end = useCallback(() => {
    if (startTimeRef.current) {
      const duration = performance.now() - startTimeRef.current;
      console.log(`${name} took ${duration.toFixed(2)}ms`);
      startTimeRef.current = null;
      return duration;
    }
    return 0;
  }, [name]);

  const measure = useCallback((fn) => {
    start();
    const result = fn();
    end();
    return result;
  }, [start, end]);

  return { start, end, measure };
};

/**
 * Image lazy loading hook
 */
export const useLazyImage = (src, placeholder = '') => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const { targetRef, hasIntersected } = useIntersectionObserver();

  useEffect(() => {
    if (!hasIntersected || !src) return;

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      setIsError(true);
    };
    
    img.src = src;
  }, [hasIntersected, src]);

  return {
    targetRef,
    imageSrc,
    isLoaded,
    isError,
  };
};

/**
 * Optimized search hook with debouncing and memoization
 */
export const useOptimizedSearch = (items, searchFields, delay = 300) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, delay);

  const filteredItems = useMemo(() => {
    if (!debouncedQuery.trim()) return items;

    const lowercaseQuery = debouncedQuery.toLowerCase();
    
    return items.filter(item => {
      return searchFields.some(field => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], item);
        return value?.toString().toLowerCase().includes(lowercaseQuery);
      });
    });
  }, [items, searchFields, debouncedQuery]);

  return {
    query,
    setQuery,
    filteredItems,
    isSearching: query !== debouncedQuery,
  };
};

/**
 * Batch updates hook to reduce re-renders
 */
export const useBatchedUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const timeoutRef = useRef(null);

  const batchUpdate = useCallback((updateFn) => {
    setUpdates(prev => [...prev, updateFn]);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setUpdates(currentUpdates => {
        currentUpdates.forEach(fn => fn());
        return [];
      });
    }, 0);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return batchUpdate;
};

/**
 * Optimized list rendering hook
 */
export const useOptimizedList = (items, keyExtractor, renderItem) => {
  const memoizedItems = useMemo(() => {
    return items.map((item, index) => ({
      key: keyExtractor ? keyExtractor(item, index) : index,
      item,
      index,
    }));
  }, [items, keyExtractor]);

  const MemoizedItem = useMemo(() => {
    return memo(({ item, index }) => renderItem(item, index));
  }, [renderItem]);

  return {
    memoizedItems,
    MemoizedItem,
  };
};

/**
 * Resource preloading utilities
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadImages = (sources) => {
  return Promise.all(sources.map(preloadImage));
};

/**
 * Bundle size optimization utilities
 */
export const lazyImport = (importFn) => {
  return React.lazy(importFn);
};

/**
 * Memory usage monitoring
 */
export const getMemoryUsage = () => {
  if ('memory' in performance) {
    return {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit,
    };
  }
  return null;
};

export default {
  debounce,
  throttle,
  memoize,
  useDebounce,
  useDebouncedCallback,
  useThrottledCallback,
  useIntersectionObserver,
  useVirtualScroll,
  usePerformanceMonitor,
  useLazyImage,
  useOptimizedSearch,
  useBatchedUpdates,
  useOptimizedList,
  preloadImage,
  preloadImages,
  lazyImport,
  getMemoryUsage,
};