// src/pages/Register.jsx
import React, { useState } from "react";
import { registerUser } from "../services/auth.service";
import "../styles/register.css";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    rut: "",
    email: "",
    password: "",
    contact: "",
    homeAddress: "",
    docIdentity: null,
    docResidence: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerUser(formData);
      alert("Registro enviado con éxito");
      // Redireccionar o limpiar formulario si quieres
    } catch (error) {
      console.error(error);
      alert("Error al registrar");
    }
  };

  return (
    <div className="register-background">
      <form className="register-container" onSubmit={handleSubmit}>
        <h2 className="register-title">Solicitud de Registro</h2>

        <label>NOMBRE COMPLETO</label>
        <input type="text" name="fullName" onChange={handleChange} required />

        <label>RUT</label>
        <input type="text" name="rut" onChange={handleChange} required />

        <label>CORREO ELECTRÓNICO</label>
        <input type="email" name="email" onChange={handleChange} required />

        <label>CONTRASEÑA</label>
        <input type="password" name="password" onChange={handleChange} required />

        <label>NÚMERO DE CONTACTO</label>
        <input type="text" name="contact" onChange={handleChange} required />

        <label>DIRECCIÓN</label>
        <input type="text" name="homeAddress" onChange={handleChange} required />

        <div className="documents-title">DOCUMENTOS</div>

        <div className="documents-upload">
          <div>
            <label>CÉDULA IDENTIDAD</label>
            <input
              type="file"
              name="docIdentity"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>COMPROBANTE DOMICILIO</label>
            <input
              type="file"
              name="docResidence"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit">ENVIAR SOLICITUD</button>
      </form>
    </div>
  );
}

export default Register;
