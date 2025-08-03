import axios from './root.service.js';

export async function getTransactions() {
  try {
    const { data } = await axios.get('/transaction');
    return data;
  } catch (error) {
    console.error('Error en getTransactions:', error);
    if (error.response) {
      return error.response.data;
    }
    return { message: 'Error de conexión con el servidor' };
  }
}

export async function getTransactionById(id) {
  try {
    const { data } = await axios.get(`/transaction/${id}`);
    return data;
  } catch (error) {
    return error.response.data;
  }
}

export async function createTransaction(transactionData) {
  try {
    const { data } = await axios.post('/transaction', transactionData);
    return data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    return { message: 'Error de conexión con el servidor' };
  }
}

export async function updateTransaction(id, transactionData) {
  try {
    const { data } = await axios.put(`/transaction/${id}`, transactionData);
    return data;
  } catch (error) {
    console.error('Error en updateTransaction service:', error);
    if (error.response) {
      return error.response.data;
    }
    return { message: 'Error de conexión con el servidor' };
  }
}

export async function deleteTransaction(id) {
  try {
    const { data } = await axios.delete(`/transaction/${id}`);
    return data;
  } catch (error) {
    console.error('Error en deleteTransaction service:', error);
    if (error.response) {
      return error.response.data;
    }
    return { message: 'Error de conexión con el servidor' };
  }
}
