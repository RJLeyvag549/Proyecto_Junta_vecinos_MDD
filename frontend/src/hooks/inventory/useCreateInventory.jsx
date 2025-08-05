import { useState } from 'react';
import { createInventory } from '../../services/inventory.service.js';

const useCreateInventory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateInventory = async (inventoryData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await createInventory(inventoryData);
      
      if (response.message && !response.id) {
        setError(response.message);
        return null;
      }
      
      return response;
    } catch (err) {
      setError(err.message || 'Error al crear item del inventario');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return { handleCreateInventory, loading, error, clearError };
};

export default useCreateInventory;
