import { useState } from 'react';
import { deleteUserById } from '../../services/user.service';

export function useDeleteUserById() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteUser = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteUserById(id);
      return response;
    } catch (err) {
      setError(err.message || 'Error al eliminar usuario.');
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading, error };
}
