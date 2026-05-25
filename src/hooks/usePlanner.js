import { useState, useEffect } from 'react';

/**
 * A custom hook to manage study plans.
 */
export const usePlanner = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock fetching plans
  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPlans([{ id: 1, title: 'Calculus Final Prep', status: 'active' }]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlans();
  }, []);

  return { plans, loading, error };
};
