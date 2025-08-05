import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/root.service.js';
import Navbar from '../components/Navbar';
import SidebarAdmin from '../components/SidebarAdmin';
import SidebarUsuario from '../components/SidebarUsuario';
import { emitirVoto } from '../services/votacion.service.js';
import '../styles/voto.css';
import { FaArrowLeft } from 'react-icons/fa';


function Voto() {
  const { id } = useParams();
  const [votacion, setVotacion] = useState(null);
  const [opcionElegida, setOpcionElegida] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem('user'));

  const rol = user?.data?.role || '';


  useEffect(() => {
    const obtenerVotacion = async () => {
      try {
        const { data } = await api.get(`/votaciones/${id}`);
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

  if (!votacion) {
    console.log("Votación aún no cargada");
    return <div>Cargando...</div>;
  }

  return (
    <div className="fondo-voto">
      <Navbar />
      {rol === 'administrator' ? <SidebarAdmin /> : <SidebarUsuario />}

      <div className="voto-body flex">
        <div className="voto-content">
          <div className="boton-volver-wrapper">
            <button className="boton-volver" onClick={() => navigate(-1)}>
              <FaArrowLeft />
            </button>
          </div>
          <div className="voto-card">
            <h2 className="voto-titulo">{votacion.titulo}</h2>
            <p className="voto-descripcion">{votacion.descripcion}</p>

            <div className="voto-opciones">
              <h4>Elige una opción:</h4>
              {votacion.opciones.map((op, i) => (
                <div
                  key={i}
                  className={`voto-opcion ${opcionElegida === op ? 'selected' : ''}`}
                  onClick={() => setOpcionElegida(op)}
                >
                  <input
                    type="radio"
                    name="opcion"
                    value={op}
                    checked={opcionElegida === op}
                    onChange={(e) => setOpcionElegida(e.target.value)}
                    style={{ display: 'none' }}
                  />
                  <span>{op}</span>
                </div>
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
