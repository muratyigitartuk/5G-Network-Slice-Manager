import { renderHook, act } from '@testing-library/react-hooks';
import useDataFetching from '../useDataFetching';

// Mock the NotificationContext
jest.mock('../../Notifications/NotificationContext', () => ({
  useNotifications: () => ({
    addNotification: jest.fn()
  })
}));

describe('useDataFetching', () => {
  // Test successful data fetching
  test('fetches data successfully', async () => {
    const mockData = { id: 1, name: 'Test Data' };
    const mockFetchFunction = jest.fn().mockResolvedValue(mockData);
    
    const { result, waitForNextUpdate } = renderHook(() => 
      useDataFetching(mockFetchFunction, [], {
        loadOnMount: true
      })
    );
    
    // Initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
    
    // Wait for the fetch to complete
    await waitForNextUpdate();
    
    // After fetch completes
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
    expect(mockFetchFunction).toHaveBeenCalledTimes(1);
  });
  
  // Test error handling
  test('handles fetch errors', async () => {
    const mockError = new Error('Fetch failed');
    const mockFetchFunction = jest.fn().mockRejectedValue(mockError);
    
    const { result, waitForNextUpdate } = renderHook(() => 
      useDataFetching(mockFetchFunction, [], {
        loadOnMount: true
      })
    );
    
    // Initial state
    expect(result.current.loading).toBe(true);
    
    // Wait for the fetch to complete
    await waitForNextUpdate();
    
    // After fetch fails
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(mockError.message);
    expect(mockFetchFunction).toHaveBeenCalledTimes(1);
  });
  
  // Test manual refetch
  test('allows manual refetch', async () => {
    const mockData = { id: 1, name: 'Test Data' };
    const mockFetchFunction = jest.fn().mockResolvedValue(mockData);
    
    const { result, waitForNextUpdate } = renderHook(() => 
      useDataFetching(mockFetchFunction, [], {
        loadOnMount: false
      })
    );
    
    // Initial state without loadOnMount
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe(null);
    
    // Manually trigger fetch
    act(() => {
      result.current.refetch();
    });
    
    // Loading state after manual fetch
    expect(result.current.loading).toBe(true);
    
    // Wait for the fetch to complete
    await waitForNextUpdate();
    
    // After fetch completes
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(mockFetchFunction).toHaveBeenCalledTimes(1);
  });
  
  // Test data transformation
  test('transforms data correctly', async () => {
    const mockData = { id: 1, name: 'Test Data' };
    const mockFetchFunction = jest.fn().mockResolvedValue(mockData);
    const mockTransform = (data) => ({ ...data, transformed: true });
    
    const { result, waitForNextUpdate } = renderHook(() => 
      useDataFetching(mockFetchFunction, [], {
        transformData: mockTransform
      })
    );
    
    // Wait for the fetch to complete
    await waitForNextUpdate();
    
    // Check transformed data
    expect(result.current.data).toEqual({ ...mockData, transformed: true });
  });
}); 