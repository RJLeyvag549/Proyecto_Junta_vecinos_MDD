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

export async function emitirVoto(id_votacion, opcion_elegida) {
  try {
    const response = await api.post('/voto', {
      id_votacion,
      opcion_elegida
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al emitir voto' };
  }
};