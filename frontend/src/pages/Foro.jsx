import React, { useEffect, useState } from 'react';
import '../styles/Foro.css';

import SidebarUsuario from '../components/SidebarUsuario';
import SidebarAdmin from '../components/SidebarAdmin';
import Navbar from '../components/Navbar';

const Foro = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [comentarios, setComentarios] = useState({});
  const [nuevoComentario, setNuevoComentario] = useState('');

  const user = JSON.parse(sessionStorage.getItem('user'));
  const role = user?.data?.role;
  const nombre = user?.data?.nombre;

  useEffect(() => {
    const publicacionesMock = [
      {
        _id: '1',
        titulo: 'Reunión de vecinos',
        contenido: 'La próxima reunión será el 10 de agosto a las 18:00 hrs.',
        tipo: 'aviso',
        autor: 'Directiva',
        fecha: '2025-08-01'
      },
      {
        _id: '2',
        titulo: 'Acta Reunión Julio',
        contenido: 'Resumen y acuerdos de la reunión de julio...',
        tipo: 'acta',
        autor: 'Directiva',
        fecha: '2025-07-28'
      }
    ];
    setPublicaciones(publicacionesMock);
  }, []);

  const handleComentarioChange = (e) => {
    setNuevoComentario(e.target.value);
  };

  const handleEnviarComentario = (publicacionId) => {
    if (!nuevoComentario.trim()) return;

    const comentarioNuevo = {
      id: Date.now(),
      texto: nuevoComentario,
      autor: nombre || 'Anónimo',
      fecha: new Date().toLocaleDateString()
    };

    setComentarios((prev) => ({
      ...prev,
      [publicacionId]: [...(prev[publicacionId] || []), comentarioNuevo]
    }));

    setNuevoComentario('');
  };

  const editarPublicacion = (id) => {
    alert(`Editar publicación ID: ${id}`);
  };

  const eliminarPublicacion = (id) => {
    if (confirm('¿Estás seguro de eliminar esta publicación?')) {
      setPublicaciones((prev) => prev.filter((p) => p._id !== id));
    }
  };

  return (
    <>
      <Navbar />

      <div className="foro-layout">
        <aside className="foro-sidebar">
          {role === 'administrator' ? <SidebarAdmin /> : <SidebarUsuario />}
        </aside>

        <main className="foro-container">
          <h1 className="foro-titulo">Foro Comunitario</h1>

          {publicaciones.length === 0 ? (
            <div className="sin-publicaciones">
              <p>No hay publicaciones aún.</p>
              {role === 'administrator' && (
                <button className="btn-crear-publicacion">Crear publicación</button>
              )}
            </div>
          ) : (
            publicaciones.map((pub) => (
              <div key={pub._id} className="publicacion">
                <div className="cabecera-publicacion">
                  <h2>{pub.titulo}</h2>
                  <span className="tipo-publicacion">{pub.tipo}</span>
                </div>
                <p>{pub.contenido}</p>
                <div className="info-publicacion">
                  <small>Publicado por: {pub.autor}</small><br />
                  <small>Fecha: {pub.fecha}</small>
                </div>

                {role === 'administrator' && (
                  <div className="acciones-admin">
                    <button onClick={() => editarPublicacion(pub._id)}>Editar</button>
                    <button onClick={() => eliminarPublicacion(pub._id)}>Eliminar</button>
                  </div>
                )}

                <div className="comentarios">
                  <h4>Comentarios:</h4>
                  {(comentarios[pub._id] || []).map((comentario) => (
                    <div key={comentario.id} className="comentario">
                      <strong>{comentario.autor}</strong>: {comentario.texto}
                      <br />
                      <small>{comentario.fecha}</small>
                    </div>
                  ))}

                  <textarea
                    placeholder="Escribe un comentario..."
                    value={nuevoComentario}
                    onChange={handleComentarioChange}
                    className="comentario-input"
                  ></textarea>
                  <button onClick={() => handleEnviarComentario(pub._id)} className="btn-comentar">
                    Comentar
                  </button>
                </div>
              </div>
            ))
          )}
        </main>
      </div>
    </>
  );
};

export default Foro;
