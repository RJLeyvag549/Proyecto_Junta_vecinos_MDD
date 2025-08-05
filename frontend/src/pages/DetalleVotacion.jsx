import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { contarVotosPorOpcion, getVotacionById } from '../services/votacion.service';
import '../styles/voto.css';
import '../styles/detalleVotacion.css';
import Navbar from '../components/Navbar.jsx';
import SidebarAdmin from '../components/SidebarAdmin.jsx';
import { useNavigate } from 'react-router-dom';

function DetalleVotacion() {
  const { id } = useParams();
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [votacion, setVotacion] = useState(null);

  useEffect(() => {
    const fetchResultados = async () => {
      try {
        const response = await contarVotosPorOpcion(id);
        setResultados(response.resultados);

        const votacionRes = await getVotacionById(id);
        setVotacion(votacionRes);

      } catch (err) {
        console.error(err);
        setError("Error al obtener resultados");
      }
    };
    fetchResultados();
  }, [id]);

  return (
    <div className="fondo-voto">
      <Navbar />
      <div className="detalle-body">
        <SidebarAdmin />
        <div className="detalle-votacion-container">

          {votacion && (
            <div className="votacion-info-card">
              <h2 className="chart-title">Votación: {votacion.titulo}</h2>
              <p><strong>Descripción:</strong> {votacion.descripcion}</p>
              <p><strong>Fecha de inicio:</strong> {new Date(votacion.fecha_inicio).toLocaleString()}</p>
              <p><strong>Fecha de cierre:</strong> {new Date(votacion.fecha_fin).toLocaleString()}</p>
              <p><strong>Creada por:</strong> {votacion.creada_por}</p>
              <p><strong>Opciones:</strong></p>
              <ul className="opciones-list">
                {votacion.opciones && votacion.opciones.length > 0 ? (
                  votacion.opciones.map((opcion, index) => (
                    <li key={index}>{opcion}</li>
                  ))
                ) : (
                  <li>No hay opciones registradas.</li>
                )}
              </ul>
            </div>
          )}


          <h3 className="chart-title">Resultados</h3>

          {error ? (
            <p className="error">{error}</p>
          ) : resultados.length === 0 ? (
            <p className="no-datos">No hay votos registrados aún.</p>
          ) : (
            <div className="chart-wrapper">
              <ResponsiveContainer width="90%" height={400}>
                <BarChart data={resultados}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="opcion" />
                  <YAxis allowDecimals={false} />
                  <Tooltip contentStyle={{
                    backgroundColor: 'rgba(233, 245, 219, 0.95)',
                    borderRadius: '12px',
                    border: '1px solid #a3c585',
                    color: '#1f2d1e',
                    fontFamily: 'Nunito',
                    fontSize: '0.95rem'
                  }} />
                  <Bar dataKey="cantidad" fill="#355e3b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <button className="volver-btn" onClick={() => navigate('/votaciones')}>
            ← Volver a votaciones
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetalleVotacion;
