import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllVotaciones, getVotacionesDisp, deleteVotacion } from '../services/votacion.service.js';
import '../styles/votacionAdmin.css';
import Navbar from '../components/Navbar.jsx';
import SidebarAdmin from '../components/SidebarAdmin.jsx';
import { FaPlus, FaTrashAlt, FaEdit, FaArrowLeft } from 'react-icons/fa';

function VotacionAdmin() {
  const [votaciones, setVotaciones] = useState(null);
  const [error, setError] = useState(null);
  const [mostrarTodas, setMostrarTodas] = useState(false);
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
        const data = mostrarTodas
          ? await getAllVotaciones()
          : await getVotacionesDisp();

        setVotaciones(data.data);
      } catch (err) {
        console.error("Error al obtener votaciones:", err.message);
        setError("Error al obtener votaciones");
      }
    };

    fetchVotaciones();
  }, [mostrarTodas]);

  const irAVoto = (idVotacion) => {
    navigate(`/votaciones/${idVotacion}`);
  };

  const irADetalle = (idVotacion) => {
    navigate(`/votaciones/${idVotacion}/detalle`);
  };

  const eliminarVotacion = async (idVotacion) => {
    const confirmar = confirm("¿Estás seguro de que deseas eliminar esta votación?");
    if (!confirmar) return;

    try {
      await deleteVotacion(idVotacion);
      setVotaciones(prev => prev.filter(v => v.id !== idVotacion));
    } catch (err) {
      console.error("Error al eliminar la votación:", err.message);
      alert("No se pudo eliminar la votación.");
    }
  };


  return (
    <div className="votacion-layout-admin">
      <Navbar />
      <div className="votacion-body-admin">
        <SidebarAdmin />
        <div className="votaciones-container-admin">
          <header className="votaciones-banner-admin">
            <button
              className="boton-volver-admin"
              onClick={() => navigate('/home')}
              title="Volver atrás"
            >
              <FaArrowLeft />
            </button>
            <strong className="titulo-banner-admin">
              {mostrarTodas ? 'TODAS LAS VOTACIONES' : 'VOTACIONES DISPONIBLES'}
            </strong>
            <button
              className="boton-toggle-admin"
              onClick={() => setMostrarTodas(prev => !prev)}
            >
              {mostrarTodas ? 'Mostrar solo disponibles' : 'Mostrar todas las votaciones'}
            </button>
            <button
              onClick={() => navigate('/crear-votacion')}
              className="boton-crear-flotante"
              title="Crear nueva votación"
            >
              <FaPlus size={22} />
            </button>
          </header>
          <main className="votaciones-cards-grid-admin">
            {error ? (
              <p className="mensaje-error">{error}</p>
            ) : votaciones === null ? (
              <p className="mensaje-cargando">Cargando votaciones...</p>
            ) : votaciones.length === 0 ? (
              <p className="mensaje-no-votaciones">No hay votaciones para mostrar</p>
            ) : (
              votaciones.map((v, i) => (
                <div className="votaciones-card-admin" key={i}>
                  <div className="botones-superiores-admin">
                    <button onClick={() => navigate(`/votaciones/${v.id}/editar`)} className="btn-editar" title="Editar votación">
                      <FaEdit size={16} />
                    </button>
                    <button onClick={() => eliminarVotacion(v.id)} className="btn-eliminar" title="Eliminar votación">
                      <FaTrashAlt size={16} />
                    </button>
                  </div>
                  <h2>{v.titulo}</h2>
                  <p>{v.descripcion}</p>
                  <p><strong>Fecha Inicio:</strong> {new Date(v.fecha_inicio).toLocaleString('es-CL')}</p>
                  <p><strong>Fecha Fin:</strong> {new Date(v.fecha_fin).toLocaleString('es-CL')}</p>

                  <div className="botones-acciones">
                    {!mostrarTodas && (
                      <button onClick={() => irAVoto(v.id)} className="btn-votar">
                        VOTA AQUÍ
                      </button>
                    )}
                    <button onClick={() => irADetalle(v.id)} className="btn-detalle">
                      VER DETALLE
                    </button>
                  </div>
                </div>
              ))
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default VotacionAdmin;
