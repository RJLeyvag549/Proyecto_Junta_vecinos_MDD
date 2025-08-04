import { useState, useEffect } from 'react';
import { getInventories } from '../../services/inventory.service.js';

const useGetInventories = () => {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInventories = async () => {
    try {
      setLoading(true);
      const response = await getInventories();
      if (Array.isArray(response)) {
        setInventories(response);
        setError(null);
      } else {
        setError(response.message || 'Error al obtener inventarios');
      }
    } catch (err) {
      setError('Error al obtener inventarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventories();
  }, []);

  return { inventories, loading, error, refetch: fetchInventories };
};

export default useGetInventories;
