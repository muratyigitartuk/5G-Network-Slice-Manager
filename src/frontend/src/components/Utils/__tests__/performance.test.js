import { debounce, throttle, memoize } from '../performance';

describe('Performance Utilities', () => {
  // Mock timers for testing time-based functions
  jest.useFakeTimers();

  describe('debounce', () => {
    test('executes the function after the specified delay', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 500);

      // Call the debounced function
      debouncedFn();
      
      // Function should not be called immediately
      expect(mockFn).not.toHaveBeenCalled();
      
      // Fast-forward time by 250ms
      jest.advanceTimersByTime(250);
      expect(mockFn).not.toHaveBeenCalled();
      
      // Fast-forward time by another 250ms (total 500ms)
      jest.advanceTimersByTime(250);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('resets the timer when called again before delay', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 500);

      // Call the debounced function
      debouncedFn();
      
      // Fast-forward time by 250ms
      jest.advanceTimersByTime(250);
      expect(mockFn).not.toHaveBeenCalled();
      
      // Call the debounced function again
      debouncedFn();
      
      // Fast-forward time by 250ms (total 500ms from first call)
      jest.advanceTimersByTime(250);
      expect(mockFn).not.toHaveBeenCalled();
      
      // Fast-forward time by another 250ms (total 500ms from second call)
      jest.advanceTimersByTime(250);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('passes arguments to the debounced function', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 500);

      // Call the debounced function with arguments
      debouncedFn('test', 123);
      
      // Fast-forward time by 500ms
      jest.advanceTimersByTime(500);
      
      // Check that arguments were passed correctly
      expect(mockFn).toHaveBeenCalledWith('test', 123);
    });
  });

  describe('throttle', () => {
    test('executes the function immediately on first call', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 500);

      // Call the throttled function
      throttledFn();
      
      // Function should be called immediately
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('does not execute the function again within the specified limit', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 500);

      // Call the throttled function
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // Call the throttled function again immediately
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // Fast-forward time by 250ms
      jest.advanceTimersByTime(250);
      
      // Call the throttled function again
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('executes the function again after the specified limit', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 500);

      // Call the throttled function
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // Fast-forward time by 500ms
      jest.advanceTimersByTime(500);
      
      // Call the throttled function again
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    test('passes arguments to the throttled function', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 500);

      // Call the throttled function with arguments
      throttledFn('test', 123);
      
      // Check that arguments were passed correctly
      expect(mockFn).toHaveBeenCalledWith('test', 123);
    });
  });

  describe('memoize', () => {
    test('returns cached result for same arguments', () => {
      // Create a mock function that returns a new object each time
      const mockFn = jest.fn(() => ({ result: Math.random() }));
      const memoizedFn = memoize(mockFn);

      // Call the memoized function with the same arguments
      const result1 = memoizedFn('test', 123);
      const result2 = memoizedFn('test', 123);
      
      // Function should only be called once
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // Results should be the same object
      expect(result1).toBe(result2);
    });

    test('calls original function for different arguments', () => {
      const mockFn = jest.fn(x => x * 2);
      const memoizedFn = memoize(mockFn);

      // Call the memoized function with different arguments
      memoizedFn(1);
      memoizedFn(2);
      memoizedFn(3);
      
      // Function should be called for each unique argument
      expect(mockFn).toHaveBeenCalledTimes(3);
    });

    test('uses custom key function when provided', () => {
      const mockFn = jest.fn((a, b) => a + b);
      // Custom key function that only considers the first argument
      const keyFn = (a, b) => a.toString();
      const memoizedFn = memoize(mockFn, keyFn);

      // Call with same first argument but different second argument
      memoizedFn(1, 2);
      memoizedFn(1, 3);
      
      // Function should only be called once because keyFn only uses first arg
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // Call with different first argument
      memoizedFn(2, 3);
      
      // Function should be called again
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });
}); 