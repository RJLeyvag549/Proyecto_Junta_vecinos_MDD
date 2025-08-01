import api from './root.service.js';

export async function getVotacionesDisp() {
  try {
    const { data } = await api.get('/votacion/disponibles');
    return data;
  } catch (error) {
    console.error('Error al obtener votaciones disponibles:', error);
    throw error.response?.data || error.message;
  }
};

