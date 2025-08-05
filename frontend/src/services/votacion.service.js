import api from './root.service.js';

export async function getVotacionesDisp() {
  try {
    const { data } = await api.get('/votaciones/disponibles');
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

export async function getAllVotaciones() {
  try {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = user?.token;

    const response = await api.get('/votaciones', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error al obtener todas las votaciones:", error);
    throw error.response?.data || { message: "Error desconocido" };
  }
}

export async function contarVotosPorOpcion(idVotacion) {
  try {
    const response = await api.get(`/voto/${idVotacion}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al obtener resultados");
  }
}

export async function getVotacionById(id) {
  const response = await api.get(`/votaciones/${id}`);
  return response.data;
}

export async function deleteVotacion(id) {
  try {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = user?.token;

    const response = await api.delete(`/votaciones/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al eliminar votación:", error);
    throw error.response?.data || { message: "Error al eliminar votación" };
  }
}

export async function createVotacion(data, token) {
  try {
    const response = await api.post('/votaciones', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear la votación:", error);
    throw error.response?.data || { message: "Error al crear la votación" };
  }
}

export async function updateVotacion(id, data, token) {
  const response = await api.put(`/votaciones/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

