import React, { useState } from 'react';
import { createVotacion } from '../services/votacion.service.js';
import Navbar from '../components/Navbar.jsx';
import SidebarAdmin from '../components/SidebarAdmin.jsx';
import '../styles/crearVotacion.css';
import { FaTimes, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function CrearVotacion() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    fecha_inicio: '',
    hora_inicio: '',
    fecha_fin: '',
    hora_fin: '',
    opciones: [''],
  });

  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);

  const handleChange = (e, index = null) => {
    if (e.target.name === 'opcion') {
      const nuevasOpciones = [...form.opciones];
      nuevasOpciones[index] = e.target.value;
      setForm({ ...form, opciones: nuevasOpciones });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const agregarOpcion = () => {
    setForm({ ...form, opciones: [...form.opciones, ''] });
  };

  const eliminarOpcion = (index) => {
    const nuevasOpciones = form.opciones.filter((_, i) => i !== index);
    setForm({ ...form, opciones: nuevasOpciones });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setExito(false);
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      const token = user?.token;

      const fecha_inicio = `${form.fecha_inicio}T${form.hora_inicio}`;
      const fecha_fin = `${form.fecha_fin}T${form.hora_fin}`;

      const datosFinales = {
        ...form,
        fecha_inicio,
        fecha_fin,
      };

      delete datosFinales.hora_inicio;
      delete datosFinales.hora_fin;

      await createVotacion(datosFinales, token);
      setExito(true);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al crear la votación');
    }
  };

  return (
    <div className="votacion-layout">
      <Navbar />
      <div className="crear-body">
        <SidebarAdmin />
        <div className="crear-votacion-container">
          <div className="crear-banner">
            <button className="btn-volver" onClick={() => navigate(-1)}>
              <FaArrowLeft />
            </button>
            <h2>Crear nueva votación</h2>
          </div>
          {error && <p className="mensaje-error">{error}</p>}
          {exito && <p className="mensaje-exito">Votación creada con éxito.</p>}

          <form onSubmit={handleSubmit} className="crear-votacion-form">
            <input
              type="text"
              name="titulo"
              placeholder="Título"
              value={form.titulo}
              onChange={handleChange}
              required
            />
            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={form.descripcion}
              onChange={handleChange}
              required
            />
            <label>Fecha y hora de inicio</label>
            <input
              type="date"
              name="fecha_inicio"
              value={form.fecha_inicio}
              onChange={handleChange}
              required
            />
            <input
              type="time"
              name="hora_inicio"
              value={form.hora_inicio}
              onChange={handleChange}
              required
            />
            <label>Fecha y hora de fin</label>
            <input
              type="date"
              name="fecha_fin"
              value={form.fecha_fin}
              onChange={handleChange}
              required
            />
            <input
              type="time"
              name="hora_fin"
              value={form.hora_fin}
              onChange={handleChange}
              required
            />
            <h4>Opciones:</h4>
            {form.opciones.map((opcion, index) => (
              <div key={index} className="opcion-item">
                <input
                  type="text"
                  name="opcion"
                  placeholder={`Opción ${index + 1}`}
                  value={opcion}
                  onChange={(e) => handleChange(e, index)}
                  required
                />
                {form.opciones.length > 1 && (
                  <button
                    type="button"
                    className="btn-quitar-opcion"
                    onClick={() => eliminarOpcion(index)}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="btn-agregar-opcion" onClick={agregarOpcion}>
              + Añadir otra opción
            </button>
            <button type="submit" className="btn-submit-votacion">Crear votación</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CrearVotacion;
