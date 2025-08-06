import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVotacionesDisp } from '../services/votacion.service.js';
import '../styles/votacion.css';
import Navbar from '../components/Navbar.jsx';
import SidebarAdmin from '../components/SidebarAdmin.jsx';
import SidebarUsuario from '../components/SidebarUsuario.jsx';
import { FaArrowLeft } from 'react-icons/fa';

function Votacion() {
  const [votaciones, setVotaciones] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    if (!token) {
      setError("Usuario no autenticado");
      return;
    }

    const fetchVotaciones = async () => {
      try {
        const data = await getVotacionesDisp();
        console.log(data)
        setVotaciones(data.data);
      } catch (err) {
        console.error("Error al obtener votaciones:", err.message);
        setError("Error al obtener votaciones");
      }
    };

    fetchVotaciones();
  }, []);

  const irAVoto = (idVotacion) => {
    navigate(`/votaciones/${idVotacion}`);
  };

  return (
    <div className="votacion-layout">
      <Navbar />
      <div className="body-votacion">
        <SidebarUsuario />
        <div className="votaciones-container">
          <header className="votaciones-banner">
            <button
              className="boton-volver"
              onClick={() => navigate('/home')}
              title="Volver atrás"
            >
              <FaArrowLeft />
            </button>
            <h1 className="votaciones-titulo"><strong>VOTACIONES</strong></h1>
          </header>
          <main className="votaciones-cards-grid">
            {error ? (
              <p className="mensaje-error">{error}</p>
            ) : votaciones === null ? (
              <p className="mensaje-cargando">Cargando votaciones...</p>
            ) : votaciones.length === 0 ? (
              <p className="mensaje-no-votaciones">No hay votaciones disponibles</p>
            ) : (
              votaciones.map((v, i) => (
                <div className="votaciones-card" key={i}>
                  <h2>{v.titulo}</h2>
                  <p>{v.descripcion}</p>
                  <div className="fechas-container">
                    <p><strong>Fecha Inicio:</strong> {new Date(v.fecha_inicio).toLocaleString('es-CL')}</p>
                    <p><strong>Fecha Fin:</strong> {new Date(v.fecha_fin).toLocaleString('es-CL')}</p>
                  </div>
                  <button onClick={() => irAVoto(v.id)}><strong>VOTA AQUÍ</strong></button>
                </div>
              ))
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Votacion;
