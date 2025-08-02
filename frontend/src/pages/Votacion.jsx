import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVotacionesDisp } from '../services/votacion.service.js';
import '../styles/votacion.css';
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'


function Votacion() {
  const [votaciones, setVotaciones] = useState([]);
  const navigate = useNavigate();  

  useEffect(() => {
  const fetchVotaciones = async () => {
    try {
      const data = await getVotacionesDisp();
      console.log("Datos recibidos:", data);
      setVotaciones(data.data);
    } catch (error) {
      console.error('Error al obtener las votaciones:', error.message);
    }
  };

  fetchVotaciones();
}, []);

  const irAVoto = (idVotacion) => {
    navigate(`/votacion/${idVotacion}`); // Redirigir con el ID de la votación
  };

  return (
    <div className="votacion-layout">
      <Navbar />
      <div className="votacion-body">
        <Sidebar />
        <div className="votaciones-container">
          <header className="votaciones-banner">
            <strong>VOTACIONES</strong>
          </header>
          <main className="votaciones-cards-grid">
            {votaciones.length === 0 ? (
              <p className="mensaje-no-votaciones">No hay votaciones disponibles</p>
            ) : (
              votaciones.map((v, i) => (
                <div className="votaciones-card" key={i}>
                  <h2>{v.titulo}</h2>
                  <p>{v.descripcion}</p>
                <p><strong>Fecha Inicio:</strong> {new Date(v.fecha_inicio).toLocaleString('es-CL')}</p>
                <p><strong>Fecha Fin:</strong> {new Date(v.fecha_fin).toLocaleString('es-CL')}</p>
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
