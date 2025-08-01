import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/root.service.js';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { emitirVoto } from '../services/votacion.service.js';


function Voto() {
  const { id } = useParams();
  const [votacion, setVotacion] = useState(null);
  const [opcionElegida, setOpcionElegida] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerVotacion = async () => {
      try {
        const { data } = await api.get(`/votacion/${id}`);
        setVotacion(data);
      } catch (error) {
        console.error('Error al obtener votación:', error);
      }
    };

    obtenerVotacion();
  }, [id]);

  const handleVotar = async () => {
  try {
    await emitirVoto(votacion.id, opcionElegida);
    alert('¡Voto emitido con éxito!');
    navigate('/votaciones');
  } catch (error) {
    alert(error.message || 'Error al votar');
  }
};

  if (!votacion) return <div>Cargando...</div>;

  return (
    <div className="votacion-layout">
      <Navbar />
      <div className="votacion-body">
        <Sidebar />
        <div className="votaciones-container">
          <div className="votaciones-banner">
            <h2>{votacion.titulo}</h2>
            <p>{votacion.descripcion}</p>
            <p><strong>Fecha Inicio:</strong> {new Date(votacion.fecha_inicio).toLocaleString('es-CL')}</p>
            <p><strong>Fecha Fin:</strong> {new Date(votacion.fecha_fin).toLocaleString('es-CL')}</p>

            <div>
              <h4>Elige una opción:</h4>
              {votacion.opciones.map((op, i) => (
                <label key={i}>
                  <input
                    type="radio"
                    name="opcion"
                    value={op}
                    checked={opcionElegida === op}
                    onChange={(e) => setOpcionElegida(e.target.value)}
                  />
                  {op}
                </label>
              ))}
            </div>

            <button onClick={handleVotar} disabled={!opcionElegida}>
              Emitir voto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Voto;
