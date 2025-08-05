import axios from './root.service.js';

export async function getUsers() {
  try {
    const token = sessionStorage.getItem('token'); 
    const config = {
      headers: {
        'Cache-Control': 'no-cache',
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get('/users/', config);
    return data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function getUserById(id) {
  try {
    const token = sessionStorage.getItem('token');
    const config = {
      headers: {
        'Cache-Control': 'no-cache',
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`/users/${id}`, config); 
    return response.data; 
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function updateUserById(id, updatedData) {
  try {
    const token = sessionStorage.getItem('token');
    const config = {
      headers: {
        'Cache-Control': 'no-cache',
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.put(`/users/${id}`, updatedData, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function deleteUserById(id) {
  try {
    const token = sessionStorage.getItem('token');
    const config = {
      headers: {
        'Cache-Control': 'no-cache',
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.delete(`/users/${id}`, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function getPendingUsers() {
  try {
    const token = sessionStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      },
    };
    const { data } = await axios.get('/users/pending', config);
    return data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export const updateRequestStatus = async (id, status) => {
  try {
const res = await axios.patch(`/users/${id}/status`, {
  requestStatus: status,
});
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al actualizar estado';
  }
};




