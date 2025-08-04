import { useState } from 'react';
import { updateTransaction } from '../../services/transaction.service.js';

const useEditTransaction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEditTransaction = async (id, transactionData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await updateTransaction(id, transactionData);
      if (response.message && !response.transaction) {
        setError(response.message);
        return null;
      }
      return response;
    } catch (err) {
      setError('Error al actualizar transacción');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleEditTransaction, loading, error };
};

export default useEditTransaction;
