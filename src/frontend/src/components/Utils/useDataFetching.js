import { useState, useEffect, useCallback } from 'react';
import { useNotifications } from '../Notifications/NotificationContext';

/**
 * Custom hook for data fetching with standardized loading, error, and success states
 * 
 * @param {Function} fetchFunction - The async function that fetches data
 * @param {Array} dependencies - Dependencies array for useEffect (optional)
 * @param {Object} options - Additional options
 * @param {boolean} options.loadOnMount - Whether to load data on component mount (default: true)
 * @param {boolean} options.showSuccessNotification - Whether to show success notification (default: false)
 * @param {boolean} options.showErrorNotification - Whether to show error notification (default: true)
 * @param {string} options.successMessage - Custom success message
 * @param {string} options.errorMessage - Custom error message prefix
 * @param {Function} options.transformData - Function to transform the fetched data
 * @returns {Object} - { data, loading, error, refetch }
 */
const useDataFetching = (
  fetchFunction,
  dependencies = [],
  options = {}
) => {
  const {
    loadOnMount = true,
    showSuccessNotification = false,
    showErrorNotification = true,
    successMessage = 'Data loaded successfully',
    errorMessage = 'Error loading data',
    transformData = (data) => data,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(loadOnMount);
  const [error, setError] = useState(null);
  const { addNotification } = useNotifications();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFunction();
      const transformedData = transformData(result);
      setData(transformedData);
      
      if (showSuccessNotification) {
        addNotification({
          type: 'success',
          message: successMessage
        });
      }
      
      return transformedData;
    } catch (err) {
      const errorMsg = err.message || 'Unknown error occurred';
      setError(errorMsg);
      
      if (showErrorNotification) {
        addNotification({
          type: 'error',
          message: `${errorMessage}: ${errorMsg}`
        });
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, showSuccessNotification, showErrorNotification, successMessage, errorMessage, transformData, addNotification]);

  useEffect(() => {
    if (loadOnMount) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setData
  };
};

// Export both named and default export
export { useDataFetching };
export default useDataFetching; 