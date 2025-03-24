import { useRef, useCallback, useEffect, useState } from 'react';

/**
 * Performance utility functions
 * 
 * This module provides helper functions to optimize performance
 * throughout the application.
 */

/**
 * Custom hook for debouncing a function call
 * 
 * @param {Function} fn - The function to debounce
 * @param {number} delay - Delay in milliseconds
 * @param {Array} deps - Dependencies array for useCallback
 * @returns {Function} - Debounced function
 */
export const useDebounce = (fn, delay = 300, deps = []) => {
  const timeoutRef = useRef(null);
  
  const debouncedFn = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      fn(...args);
    }, delay);
  }, [fn, delay, ...deps]);
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return debouncedFn;
};

/**
 * Custom hook for throttling a function call
 * 
 * @param {Function} fn - The function to throttle
 * @param {number} limit - Limit in milliseconds
 * @param {Array} deps - Dependencies array for useCallback
 * @returns {Function} - Throttled function
 */
export const useThrottle = (fn, limit = 300, deps = []) => {
  const lastRunRef = useRef(0);
  const timeoutRef = useRef(null);
  
  const throttledFn = useCallback((...args) => {
    const now = Date.now();
    
    if (now - lastRunRef.current >= limit) {
      lastRunRef.current = now;
      fn(...args);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        lastRunRef.current = Date.now();
        fn(...args);
      }, limit - (now - lastRunRef.current));
    }
  }, [fn, limit, ...deps]);
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return throttledFn;
};

/**
 * Custom hook for memoizing a value with deep comparison
 * 
 * @param {any} value - The value to memoize
 * @returns {any} - Memoized value
 */
export const useDeepMemo = (value) => {
  const ref = useRef(value);
  
  if (!deepEqual(value, ref.current)) {
    ref.current = value;
  }
  
  return ref.current;
};

/**
 * Deep equality comparison for objects and arrays
 * 
 * @param {any} a - First value
 * @param {any} b - Second value
 * @returns {boolean} - Whether the values are deeply equal
 */
export const deepEqual = (a, b) => {
  if (a === b) return true;
  
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    
    if (!deepEqual(a[key], b[key])) return false;
  }
  
  return true;
};

/**
 * Custom hook for detecting when an element is visible in the viewport
 * 
 * @param {Object} options - IntersectionObserver options
 * @returns {Object} - { ref, isVisible }
 */
export const useInView = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);
    
    const currentRef = ref.current;
    
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);
  
  return { ref, isVisible };
};

/**
 * Custom hook for measuring an element's dimensions
 * 
 * @returns {Object} - { ref, width, height }
 */
export const useMeasure = () => {
  const ref = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });
    
    const currentRef = ref.current;
    
    if (currentRef) {
      resizeObserver.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef);
      }
    };
  }, []);
  
  return { ref, ...dimensions };
}; 