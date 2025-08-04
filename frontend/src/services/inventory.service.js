import axios from './root.service.js';

// Obtener todos los items del inventario
export const getInventories = async () => {
  try {
    const response = await axios.get('/inventory');
    return response.data;
  } catch (error) {
    console.error('Error al obtener inventarios:', error);
    throw error.response?.data || error;
  }
};

// Obtener un item del inventario por ID
export const getInventoryById = async (id) => {
  try {
    const response = await axios.get(`/inventory/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener inventario por ID:', error);
    throw error.response?.data || error;
  }
};

// Crear un nuevo item en el inventario
export const createInventory = async (inventoryData) => {
  try {
    const response = await axios.post('/inventory', inventoryData);
    return response.data;
  } catch (error) {
    console.error('Error al crear inventario:', error);
    throw error.response?.data || error;
  }
};

// Actualizar un item del inventario
export const updateInventory = async (id, inventoryData) => {
  try {
    const response = await axios.put(`/inventory/${id}`, inventoryData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar inventario:', error);
    throw error.response?.data || error;
  }
};

// Eliminar un item del inventario
export const deleteInventory = async (id) => {
  try {
    const response = await axios.delete(`/inventory/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar inventario:', error);
    throw error.response?.data || error;
  }
};
