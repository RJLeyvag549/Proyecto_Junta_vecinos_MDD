import { useEffect, useState } from 'react';
import axios from 'axios';

export function useGetCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const userData = sessionStorage.getItem('user');
  const token = userData ? JSON.parse(userData).token : null;

  if (!token) {
    setError('No hay token');
    setLoading(false);
    return;
  }

  axios
    .get('http://localhost:3000/api/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setUser(res.data?.data || null);
      setLoading(false);
    })
    .catch((err) => setError(err))
    .finally(() => setLoading(false));
}, []);


  return { user, loading, error };
}
