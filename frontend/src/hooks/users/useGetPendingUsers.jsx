import { useEffect, useState, useCallback } from 'react';
import { getPendingUsers } from '../../services/user.service';

export function useGetPendingUsers() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getPendingUsers();
      setPendingUsers(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al obtener usuarios pendientes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { pendingUsers, loading, error, refetch };
}
