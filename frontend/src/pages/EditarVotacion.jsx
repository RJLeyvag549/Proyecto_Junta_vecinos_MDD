import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVotacionById, updateVotacion } from '../services/votacion.service.js';
import Navbar from '../components/Navbar.jsx';
import SidebarAdmin from '../components/SidebarAdmin.jsx';
import '../styles/votacion.css';
import '../styles/editarVotacion.css'; // usa los mismos estilos
import { FaTimes, FaArrowLeft, FaPlus } from 'react-icons/fa';

function EditarVotacion() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    fecha_inicio: '',
    hora_inicio: '',
    fecha_fin: '',
    hora_fin: '',
    opciones: [],
  });
  const [nuevaOpcion, setNuevaOpcion] = useState('');
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);

  useEffect(() => {
    const fetchVotacion = async () => {
      try {
        const votacion = await getVotacionById(id); // ya devuelve el objeto votación directamente
        console.log("Respuesta cargada:", votacion);

        if (!votacion || !votacion.titulo) {
          throw new Error("La votación no existe o está incompleta.");
        }

        const toLocal = (fechaUTC) => {
          const date = new Date(fechaUTC);
          const chileTime = new Intl.DateTimeFormat('sv-SE', {
            timeZone: 'America/Santiago',
            dateStyle: 'short',
            timeStyle: 'short',
          }).format(date); // Ej: "2025-08-04 21:30"

          const [fecha, hora] = chileTime.split(' ');
          return { fecha, hora: hora.slice(0, 5) }; // hh:mm
        };

        const inicio = toLocal(votacion.fecha_inicio);
        const fin = toLocal(votacion.fecha_fin);

        setForm({
          titulo: votacion.titulo,
          descripcion: votacion.descripcion,
          fecha_inicio: inicio.fecha,
          hora_inicio: inicio.hora,
          fecha_fin: fin.fecha,
          hora_fin: fin.hora,
          opciones: votacion.opciones || [],
        });
      } catch (error) {
        console.error("Error al cargar votación:", error);
        setError(error.message);
      }
    };

    fetchVotacion();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setExito(false);

    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      const token = user?.token;

      const toUTCString = (fecha, hora) => {
        const [year, month, day] = fecha.split('-').map(Number);
        const [hours, minutes] = hora.split(':').map(Number);

        // Fecha local en zona horaria de Chile (manualmente)
        const chileOffset = -3; // UTC-3 en horario de invierno, cambia a -4 si es verano
        const chileDate = new Date(Date.UTC(year, month - 1, day, hours - chileOffset, minutes));

        return chileDate.toISOString();
      };

      const fecha_inicio = toUTCString(form.fecha_inicio, form.hora_inicio);
      const fecha_fin = toUTCString(form.fecha_fin, form.hora_fin);

      const datosFinales = {
        ...form,
        fecha_inicio,
        fecha_fin,
      };

      delete datosFinales.hora_inicio;
      delete datosFinales.hora_fin;

      console.log("Datos enviados al backend:", datosFinales);

      await updateVotacion(id, datosFinales, token);
      setExito(true);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Error al actualizar la votación');
      }
    }
  };

  const agregarOpcion = () => {
    if (nuevaOpcion.trim() !== '') {
      setForm((prev) => ({
        ...prev,
        opciones: [...prev.opciones, nuevaOpcion.trim()],
      }));
      setNuevaOpcion('');
    }
  };

  const eliminarOpcion = (index) => {
    setForm((prev) => ({
      ...prev,
      opciones: prev.opciones.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="votacion-layout">
      <Navbar />
      <div className="editar-body">
        <SidebarAdmin />
        <div className="editar-votacion-container">
          <div className="editar-banner">
            <button className="btn-volver" onClick={() => navigate(-1)}>
              <FaArrowLeft />
            </button>
            <h2>Editar votación</h2>
          </div>
          {error && <p className="mensaje-error">{error}</p>}
          {exito && <p className="mensaje-exito">Votación actualizada con éxito.</p>}

          <form onSubmit={handleSubmit} className="editar-votacion-form">
            <label htmlFor="titulo">Título:</label>
            <input
              type="text"
              name="titulo"
              placeholder="Título"
              value={form.titulo}
              onChange={handleChange}
              required
            />
            <label htmlFor="descripcion">Descripción:</label>
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

            <label>Opciones:</label>

            <ul className="lista-opciones-editar">
              {form.opciones.map((opcion, index) => (
                <li key={index} className="opcion-item-editar">
                  <span className="texto-opcion-editar">{opcion}</span>
                  <button
                    type="button"
                    className="btn-quitar-opcion-editar"
                    onClick={() => eliminarOpcion(index)}
                  >
                    <FaTimes />
                  </button>
                </li>
              ))}
            </ul>

            <label htmlFor="nuevaOpcion">Ingresar nueva opción:</label>
            <div className="nueva-opcion-editar">
              <input
                type="text"
                value={nuevaOpcion}
                onChange={(e) => setNuevaOpcion(e.target.value)}
                placeholder="Nueva opción"
              />
              <button type="button" className="btn-agregar-opcion" onClick={agregarOpcion}>
                <FaPlus />
              </button>
            </div>

            <button type="submit" className="btn-actualizar-votacion">Guardar cambios</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditarVotacion;
