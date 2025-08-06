import React, { useEffect, useState } from 'react';
import '../styles/Foro.css';

import SidebarUsuario from '../components/SidebarUsuario';
import SidebarAdmin from '../components/SidebarAdmin';
import Navbar from '../components/Navbar';
import iconoEliminar from '../assets/eliminar.png';
import iconoEditar from '../assets/editar.png';
import iconoAnadir from '../assets/anadir.png';


const Foro = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [comentarios, setComentarios] = useState({});
  const [nuevoComentario, setNuevoComentario] = useState({});
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [editandoId, setEditandoId] = useState(null);


  const [nuevaPublicacion, setNuevaPublicacion] = useState({
    titulo: '',
    contenido: '',
    tipo_de_publicacion: ''
  });

  const [formularioEdicion, setFormularioEdicion] = useState({
    titulo: '',
    contenido: '',
    tipo_de_publicacion: '',
  });

  const user = JSON.parse(sessionStorage.getItem('user'));
  const role = user?.data?.role;
  const token = user?.token;

  const [comentarioEditandoId, setComentarioEditandoId] = useState(null);
  const [comentarioEditado, setComentarioEditado] = useState('');

  


  const comenzarEdicion = (publicacion) => {
    setEditandoId(publicacion._id || publicacion.id_publicacion);
    setFormularioEdicion({
      titulo: publicacion.titulo || '',
      contenido: publicacion.contenido || '',
      tipo_de_publicacion: publicacion.tipo_de_publicacion || '',
    });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setFormularioEdicion({ titulo: '', contenido: '', tipo_de_publicacion: '' });
  };

  const iniciarEdicionComentario = (comentario) => {
  setComentarioEditandoId(comentario.id_comentario);
  setComentarioEditado(comentario.contenido);
};


 const guardarEdicion = () => {
  if (!formularioEdicion.tipo_de_publicacion) {
    alert("⚠️ Por favor, selecciona un tipo de publicación.");
    return;
  }

  fetch(`http://localhost:3000/api/publicaciones/${editandoId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formularioEdicion),
  })
    .then((res) => res.json())
    .then((actualizada) => {
      setPublicaciones((prev) =>
        prev.map((p) => (p._id === editandoId || p.id_publicacion === editandoId ? { ...p, ...formularioEdicion } : p))
      );
      cancelarEdicion();
      alert('Publicación actualizada correctamente.');
    })
    .catch((err) => {
      console.error('Error al editar:', err);
      alert('⚠️ Error al guardar los cambios.');
    });
};


  const cargarPublicaciones = () => {
    fetch('http://localhost:3000/api/publicaciones', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => setPublicaciones(data.data))
      .catch((error) => console.error('Error al cargar publicaciones:', error));
  };

  useEffect(() => {
    cargarPublicaciones();
  }, []);

  const abrirFormulario = () => setMostrarFormulario(true);
  const cerrarFormulario = () => setMostrarFormulario(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaPublicacion((prev) => ({ ...prev, [name]: value }));
  };

 const handleCrearPublicacion = async (e) => {
  e.preventDefault();

  if (!nuevaPublicacion.tipo_de_publicacion) {
    alert("⚠️ Por favor, selecciona un tipo de publicación.");
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/publicaciones', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevaPublicacion),
    });

    const data = await res.json();

    if (res.ok) {
      setPublicaciones((prev) => [...prev, data.data]);
      cerrarFormulario();
      setNuevaPublicacion({ titulo: '', contenido: '', tipo_de_publicacion: '' });
    } else {
      throw new Error(data.message || 'Error desconocido al crear publicación');
    }
  } catch (err) {
    alert(err.message);
  }

  };

  const eliminarPublicacion = (id) => {
    if (!confirm('¿Estás seguro de eliminar esta publicación?')) return;

    fetch(`http://localhost:3000/api/publicaciones/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        setPublicaciones((prev) => prev.filter((p) => p._id !== id && p.id_publicacion !== id));
        alert('✅ Publicación eliminada correctamente.');
      })
      .catch((err) => {
        console.error('Error al eliminar:', err);
        alert('⚠️ Error al eliminar publicación.');
      });
  };

  useEffect(() => {
    if (publicaciones.length === 0) return;
    const cargarComentarios = async () => {
      for (const pub of publicaciones) {
        const id = pub.id_publicacion || pub._id;
        try {
          const res = await fetch(`http://localhost:3000/api/comentarios/publicacion/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          setComentarios((prev) => ({ ...prev, [id]: data.data }));
        } catch (err) {
          console.error(`Error al cargar comentarios de publicación ${id}:`, err);
        }
      }
    };
    cargarComentarios();
  }, [publicaciones]);

  const handleComentarioChange = (e, id) => {
    setNuevoComentario((prev) => ({ ...prev, [id]: e.target.value }));
  };

  const handleEnviarComentario = async (id) => {
  const texto = nuevoComentario[id];
  if (!texto?.trim()) return;

  try {
    const res = await fetch(`http://localhost:3000/api/comentarios/${id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contenido: texto }),
    });

    const data = await res.json();

    if (res.ok) {
      setComentarios((prev) => ({ ...prev, [id]: [data.data, ...(prev[id] || [])] }));
      setNuevoComentario((prev) => ({ ...prev, [id]: '' }));
    } else {
      const mensaje = data.detalle || data.message || 'Error al enviar comentario';
      alert(mensaje);
    }
  } catch (err) {
    console.error('Error al comentar:', err);
    alert('Error al comentar');
  }
};

const guardarEdicionComentario = async (idComentario, idPublicacion) => {
  if (!comentarioEditado.trim()) return;

  try {
    const res = await fetch(`http://localhost:3000/api/comentarios/${idComentario}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contenido: comentarioEditado }),
    });

    const data = await res.json();

    if (res.ok) {
      setComentarios((prev) => ({
        ...prev,
        [idPublicacion]: prev[idPublicacion].map((c) =>
          c.id_comentario === idComentario ? { ...c, contenido: comentarioEditado } : c
        ),
      }));
      setComentarioEditandoId(null);
      setComentarioEditado('');
    } else {
      alert(data.message || 'Error al actualizar comentario');
    }
  } catch (err) {
    console.error('Error al actualizar comentario:', err);
    alert('⚠️ Error al editar comentario');
  }
};



  const eliminarComentario = async (idComentario, idPublicacion) => {
    if (!confirm('¿Eliminar este comentario?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/comentarios/${idComentario}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setComentarios((prev) => ({
          ...prev,
          [idPublicacion]: prev[idPublicacion].filter((c) => c.id_comentario !== idComentario),
        }));
        alert('✅ Comentario eliminado.');
      }
    } catch (err) {
      console.error('Error al eliminar comentario:', err);
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

            {role === 'administrator' && (
              <button className="btn-flotante-crear" onClick={abrirFormulario}>
                <img
                  src="/src/assets/anadir.png"
                  alt="Crear publicación"
                  style={{ width: '40px', height: '40px', marginRight: '10px' }}
                />
                Crear publicación
              </button>
            )}

          <div className="foro-calendario-layout">
            <div className="foro-publicaciones">
              {publicaciones.length === 0 ? (
                <p className="sin-publicaciones"> ❌ No hay publicaciones aún.</p>

              ) : (
                [...publicaciones]
  .sort((a, b) => new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion))
  .map((pub) => {
    const id = pub._id || pub.id_publicacion;
    return (
                    <div key={id} className="publicacion">
                        <div className="cabecera-publicacion">
                          <div className="titulo-con-tipo">
                            <h2>{pub.titulo}</h2>
                            <span
                              className={`badge-tipo-publicacion ${
                                pub.tipo_de_publicacion === "Educativos"
                                  ? "badge-educativos"
                                  : pub.tipo_de_publicacion === "Medioambiente"
                                  ? "badge-medioambiente"
                                  : pub.tipo_de_publicacion === "Bienestar físico"
                                  ? "badge-bienestar"
                                  : pub.tipo_de_publicacion === "Arte y creatividad"
                                  ? "badge-arte"
                                  : pub.tipo_de_publicacion === "Entretenimiento"
                                  ? "badge-entretenimiento"
                                  : ""
                              }`}
                            >
                              {pub.tipo_de_publicacion}
                            </span>
                          </div>
                        </div>
                      <div className="contenido-publicacion-externo">
                        <div className="contenido-publicacion-interno">
                          <p>{pub.contenido}</p>
                        </div>
                      </div>
                      <div className="info-publicacion">
                        <div className="barra-inferior-publicacion">
                            <small className="publicado-por"> ✅ Publicado por: Directiva</small>
                            <small className="fecha-publicacion">
                              🕒 Fecha: {pub.fecha_publicacion ? new Date(pub.fecha_publicacion).toLocaleDateString() : 'Fecha no disponible'}
                            </small>
                          </div>
                      </div>
                      {role === 'administrator' && (
                        <div className="acciones-admin">
                          <button onClick={() => comenzarEdicion(pub)} className="btn-icono-admin" title="Editar">
                            <img src={iconoEditar} alt="Editar" />
                          </button>
                          <button onClick={() => eliminarPublicacion(id)} className="btn-icono-admin" title="Eliminar">
                            <img src={iconoEliminar} alt="Eliminar" />
                          </button>
                        </div>
                      )}
                      <div className="comentarios">
                      <h4 className="titulo-comentarios">Comentarios:</h4>

                    {(comentarios[pub.id_publicacion] || []).map((comentario) => {
  const esPropio = comentario.user?.id === user?.data?.id;


  const estaEditando = comentarioEditandoId === comentario.id_comentario;

  return (
    <div key={comentario.id_comentario} className="comentario">
      <div className="contenido-comentario">
        <div className="texto-comentario">
          <strong>{comentario.user?.fullName || 'Anónimo'}</strong>:
          {estaEditando ? (
            <>
              <textarea
                value={comentarioEditado}
                onChange={(e) => setComentarioEditado(e.target.value)}
                className="comentario-input"
              />
              <button
                className="btn-comentar"
                onClick={() =>
                  guardarEdicionComentario(comentario.id_comentario, pub.id_publicacion)
                }
              >
                Guardar
              </button>
              <button
                className="btn-cancelar-publicacion"
                onClick={() => setComentarioEditandoId(null)}
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              {' '}{comentario.contenido}
              <br />
              <small>{new Date(comentario.fecha_comentario).toLocaleDateString()}</small>
            </>
          )}
        </div>

        {/* CONTENEDOR DE BOTONES */}
        <div className="contenedor-botones-comentario">
          {/* Botón de editar SOLO si es su propio comentario */}
          {(esPropio || role === 'administrator') && !estaEditando && (
            <button
              className="btn-icono-editar"
              title="Editar"
              onClick={() => iniciarEdicionComentario(comentario)}
            >
              <img src={iconoEditar} alt="Editar" />
            </button>
          )}

          {/* Botón de eliminar SOLO si es admin */}
          {role === 'administrator' && (
            <button
              onClick={() =>
                eliminarComentario(comentario.id_comentario, pub.id_publicacion)
              }
              className="btn-icono-eliminar"
              title="Eliminar"
            >
              <img src={iconoEliminar} alt="Eliminar" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
})}
                        <textarea
                          placeholder="Escribe un comentario..."
                          value={nuevoComentario[pub.id_publicacion] || ''}
                          onChange={(e) => handleComentarioChange(e, pub.id_publicacion)}
                          className="comentario-input"
                        ></textarea>
                        <button onClick={() => handleEnviarComentario(pub.id_publicacion)} className="btn-comentar">
                          Comentar
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>

      {mostrarFormulario && (
        <div className="modal-formulario">
          <form className="formulario-publicacion" onSubmit={handleCrearPublicacion}>
            <h3>Nueva Publicación</h3>
            <label>Título:</label>
            <input type="text" name="titulo" value={nuevaPublicacion.titulo} onChange={handleInputChange} required />
            <label>Contenido:</label>
            <textarea name="contenido" value={nuevaPublicacion.contenido} onChange={handleInputChange} required />
            <label>Tipo de publicación:</label>
            <select
                name="tipo_de_publicacion"
                value={nuevaPublicacion.tipo_de_publicacion}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Selecciona un tipo</option>
                <option value="Bienestar físico">Bienestar físico</option>
                <option value="Medioambiente">Medioambiente</option>
                <option value="Educativos">Educativos</option>
                <option value="Arte y creatividad">Arte y creatividad</option>
                <option value="Entretenimiento">Entretenimiento</option>
              </select>
            <div className="botones-formulario">
              <button type="submit" className="btn-crear-publicacion">Publicar</button>
              <button type="button" className="btn-cancelar-publicacion" onClick={cerrarFormulario}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {editandoId !== null && (
        <div className="modal-formulario">
          <div className="formulario-publicacion">
            <h3>Editar Publicación</h3>
            <label>Título:</label>
            <input
              type="text"
              value={formularioEdicion.titulo}
              onChange={(e) => setFormularioEdicion((prev) => ({ ...prev, titulo: e.target.value }))}
              required
            />
            <label>Contenido:</label>
            <textarea
              value={formularioEdicion.contenido}
              onChange={(e) => setFormularioEdicion((prev) => ({ ...prev, contenido: e.target.value }))}
              required
            />
            <label>Tipo de publicación:</label>
            <select
              value={formularioEdicion.tipo_de_publicacion}
              onChange={(e) => setFormularioEdicion((prev) => ({ ...prev, tipo_de_publicacion: e.target.value }))}
              required
            >
              <option value="">Selecciona un tipo</option>
              <option value="Bienestar físico">Bienestar físico</option>
              <option value="Medioambiente">Medioambiente</option>
              <option value="Educativos">Educativos</option>
              <option value="Arte y creatividad">Arte y creatividad</option>
              <option value="Entretenimiento">Entretenimiento</option>
            </select>
            <div className="botones-formulario">
                <button type="button" className="btn-crear-publicacion" onClick={guardarEdicion}>
                  Guardar
                </button>
                <button type="button" className="btn-cancelar-publicacion" onClick={cancelarEdicion}>
                  Cancelar
                </button>
              </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Foro;
