// src/services/auth.service.js
import cookies from 'js-cookie';
import axios from './root.service.js';

export async function login(data) {
  const response = await axios.post('/auth/login', data);

  if (response.status === 200) {
    const user = {
      token: response.data.token,
      data: response.data.user // aquí viene el role
    };
    sessionStorage.setItem('user', JSON.stringify(user));
  }
  return response.data;
}

export async function register(data) {
  const formData = new FormData();
  formData.append("fullName", data.fullName);
  formData.append("rut", data.rut);
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("contact", data.contact);
  formData.append("homeAddress", data.homeAddress);
  formData.append("docIdentity", data.docIdentity);
  formData.append("docResidence", data.docResidence);

  const response = await axios.post("/auth/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

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
  try {
    await axios.post('/auth/logout');
  } catch (err) {
    console.warn("⚠️ Logout falló en el backend (continuamos):", err.message);
  }

  sessionStorage.removeItem('user'); // 🔁 asegurarse que usamos "user"
  cookies.remove('miCookie');
}
