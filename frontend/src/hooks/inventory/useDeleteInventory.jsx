import { useState } from 'react';
import { deleteInventory } from '../../services/inventory.service.js';

const useDeleteInventory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDeleteInventory = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await deleteInventory(id);
      
      if (response.message) {
        return response;
      }
      
      return response;
    } catch (err) {
      setError(err.message || 'Error al eliminar item del inventario');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleDeleteInventory, loading, error };
};

export default useDeleteInventory;
