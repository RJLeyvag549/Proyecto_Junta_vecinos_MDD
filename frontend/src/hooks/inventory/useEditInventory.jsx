import { useState } from 'react';
import { updateInventory } from '../../services/inventory.service.js';

const useEditInventory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEditInventory = async (id, inventoryData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await updateInventory(id, inventoryData);
      
      if (response.message && !response.inventory) {
        setError(response.message);
        return null;
      }
      
      return response;
    } catch (err) {
      setError(err.message || 'Error al actualizar item del inventario');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return { handleEditInventory, loading, error, clearError };
};

export default useEditInventory;
