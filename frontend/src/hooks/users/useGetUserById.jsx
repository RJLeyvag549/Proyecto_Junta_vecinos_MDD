import { useState, useEffect } from 'react';
import { getUserById } from '../../services/user.service';

export function useGetUserById(id) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchUser = async () => {
    try {
      if (!id) return;

      const response = await getUserById(id);
      setUser(response.data); 
    } catch (err) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, [id]);


  return { user, loading, error };
}
