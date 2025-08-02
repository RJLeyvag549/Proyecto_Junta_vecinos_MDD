import axios from './root.service.js';

// src/services/auth.service.js
export async function registerUser(data) {
  const formData = new FormData();
  formData.append("fullName", data.fullName);
  formData.append("rut", data.rut);
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("contact", data.contact);
  formData.append("homeAddress", data.homeAddress);
  formData.append("docIdentity", data.docIdentity);
  formData.append("docResidence", data.docResidence);

  const response = await axios.post("http://localhost:3000/api/auth/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
