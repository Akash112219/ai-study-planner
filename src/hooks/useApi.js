import { useState, useCallback } from 'react';

/**
 * A custom hook to handle async API calls, loading states, and error handling.
 * Designed to work seamlessly with Axios and the Flask backend.
 * 
 * @param {Function} apiFunc - The async API service function to execute
 * @param {Object} options - Configuration options
 * @param {boolean} options.immediate - Whether to execute the function immediately on mount
 * @param {any} options.initialData - Initial data state before execution
 */
export const useApi = (apiFunc, { immediate = false, initialData = null } = {}) => {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(immediate);

  // The execute function memoized with useCallback
  const execute = useCallback(async (...args) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiFunc(...args);
      setData(result);
      return { success: true, data: result };
    } catch (err) {
      // Extract Flask/Axios specific error message if available
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.error 
        || err.message 
        || 'An unexpected error occurred while communicating with the server.';
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [apiFunc]);

  const clearError = () => setError(null);
  const reset = () => {
    setData(initialData);
    setError(null);
    setIsLoading(false);
  };

  return {
    execute,
    data,
    isLoading,
    error,
    clearError,
    reset
  };
};

export default useApi;
