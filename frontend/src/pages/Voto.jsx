import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/root.service.js';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { emitirVoto } from '../services/votacion.service.js';
import '../styles/voto.css';

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
    <div className="fondo-voto">
      <Navbar />
      <div className="voto-body flex">
        <Sidebar />
        <div className="voto-content">
          <div className="voto-card">
            <h2 className="voto-titulo">{votacion.titulo}</h2>
            <p className="voto-descripcion">{votacion.descripcion}</p>

            <div className="voto-opciones">
              <h4>Elige una opción:</h4>
              {votacion.opciones.map((op, i) => (
                <label key={i} className="voto-opcion">
                  <input
                    type="radio"
                    name="opcion"
                    value={op}
                    checked={opcionElegida === op}
                    onChange={(e) => setOpcionElegida(e.target.value)}
                  />
                  <span>{op}</span>
                </label>
              ))}
            </div>

            <button className="voto-boton" onClick={handleVotar} disabled={!opcionElegida}>
              Emitir voto
            </button>
          </div>
        </div>
      </div>
    </div>
  );

}

export default Voto;
