import axios from './root.service.js';
import cookies from 'js-cookie';

export async function login(data) {
  const response = await axios.post('/auth/login', data);
 if (response.status === 200) {
  const user = {
    token: response.data.token,
    data: response.data.user  // aquí debería estar el role
  };
  sessionStorage.setItem('usuario', JSON.stringify(user));
}

  return response.data;
}

export async function register(data) {
  const response = await axios.post('/auth/register', data);
  return response.data;
}

export async function profile() {
  const config = {
    headers: {
      'Cache-Control': 'no-cache',
    },
  };
  const response = await axios.get('/auth/profile', config);
  return response.data;
}

export async function logout() {
  await axios.post('/auth/logout');
  sessionStorage.removeItem('usuario');
  cookies.remove('miCookie');
}