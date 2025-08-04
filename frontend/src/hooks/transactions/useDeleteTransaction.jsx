import { useState } from 'react';
import { deleteTransaction } from '../../services/transaction.service.js';

const useDeleteTransaction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDeleteTransaction = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await deleteTransaction(id);
      if (response.message && response.message.includes('Error')) {
        setError(response.message);
        return false;
      }
      return true;
    } catch (err) {
      setError('Error al eliminar transacción');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleDeleteTransaction, loading, error };
};

export default useDeleteTransaction;
