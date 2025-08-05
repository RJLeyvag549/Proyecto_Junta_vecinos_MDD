import { useState } from 'react';
import { createTransaction } from '../../services/transaction.service.js';

const useCreateTransaction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateTransaction = async (transactionData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await createTransaction(transactionData);
      
      if (response.message && !response.id) {
        setError(response.message);
        return null;
      }
      
      return response;
    } catch (err) {
      setError('Error al crear transacción');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleCreateTransaction, loading, error };
};

export default useCreateTransaction;
