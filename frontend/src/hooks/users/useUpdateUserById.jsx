import { useState } from 'react';
import { updateUserById } from '../../services/user.service';

export function useUpdateUserById() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateUser = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateUserById(id, data);
      return response;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err.message ||
        'Error al actualizar usuario.';
      setError(message);
      throw err; 
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error };
}
