import { useState, useEffect } from 'react';
import { getTransactions } from '../../services/transaction.service.js';

const useGetTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await getTransactions();
      if (Array.isArray(response)) {
        setTransactions(response);
        setError(null);
      } else {
        setError(response.message || 'Error al obtener transacciones');
      }
    } catch (err) {
      setError('Error al obtener transacciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return { transactions, loading, error, fetchTransactions };
};

export default useGetTransactions;
