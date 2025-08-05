import React, { useEffect, useState } from 'react';
import '../styles/Foro.css';

import SidebarUsuario from '../components/SidebarUsuario';
import SidebarAdmin from '../components/SidebarAdmin';
import Navbar from '../components/Navbar';
import iconoEliminar from '../assets/eliminar.png'; // ajusta la ruta si está en otra subcarpeta
import iconoEditar from '../assets/editar.png';
import Calendario from '../components/Calendario.jsx';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/Calendario.css';


const Foro = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [comentarios, setComentarios] = useState({});
  const [nuevoComentario, setNuevoComentario] = useState({});
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [eventos, setEventos] = useState({});

  const [nuevaPublicacion, setNuevaPublicacion] = useState({
    titulo: '',
    contenido: '',
    tipo_de_publicacion: 'Educativos' // valor por defecto válido según tu enum
  });


  const user = JSON.parse(sessionStorage.getItem('user'));
  const role = user?.data?.role;
  const nombre = user?.data?.fullName;
  const token = user?.token;
  const [editandoId, setEditandoId] = useState(null);
  const [formularioEdicion, setFormularioEdicion] = useState({
  titulo: '',
  contenido: '',
  tipo_de_publicacion: '',
});

  //* PUBLICACIONES
  const comenzarEdicion = (publicacion) => {
  console.log("🛠️ Editar publicación:", publicacion);
  setEditandoId(publicacion._id || publicacion.id_publicacion);
  setFormularioEdicion({
    titulo: publicacion.titulo || '',
    contenido: publicacion.contenido || '',
    tipo_de_publicacion: publicacion.tipo_de_publicacion || publicacion.tipo || '',
  });
};

  const cancelarEdicion = () => {
  setEditandoId(null);
  setFormularioEdicion({ titulo: '', contenido: '', tipo_de_publicacion: '' });

};

const guardarEdicion = () => {
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
        prev.map((p) =>
          (p._id === editandoId || p.id_publicacion === editandoId)
            ? { ...p, ...formularioEdicion }
            : p
        )
      );
      cancelarEdicion();
      alert('✅ Publicación actualizada correctamente.');
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
      'Content-Type': 'application/json'
    }
  })
    .then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error HTTP ${res.status}: ${text}`);
      }
      return res.json();
    })
    .then((data) => {
  console.log("Publicaciones recibidas al cargar:", data);
  setPublicaciones(data.data);
})

    .catch((error) => {
      console.error('Error al cargar publicaciones:', error);
      
    });
};
  // 🔄 Cargar publicaciones reales desde el backend
 useEffect(() => {
  cargarPublicaciones();
}, []);


  // 📩 Crear publicación
  const abrirFormulario = () => setMostrarFormulario(true);
  const cerrarFormulario = () => setMostrarFormulario(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaPublicacion((prev) => ({
      ...prev,
      [name]: value
    }));
  };
const handleCrearPublicacion = async (e) => {
  e.preventDefault();

  console.log("Datos a enviar:", nuevaPublicacion); // Verifica que no esté vacío

  try {
    const res = await fetch('http://localhost:3000/api/publicaciones', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevaPublicacion)
    });

    const text = await res.text();
    if (!res.ok) {
      console.error("Respuesta error:", text);
      throw new Error(`Error HTTP ${res.status}: ${text}`);
    }

    const data = JSON.parse(text);
    setPublicaciones((prev) => [...prev, data.data]);
    console.log("Publicación recibida del backend:", data.data);

    cerrarFormulario();
    setNuevaPublicacion({
      titulo: '',
      contenido: '',
      tipo_de_publicacion: 'Educativos'
    });
  } catch (err) {
    console.error('Error al crear publicación:', err);
    alert(err.message);
  }
};

const eliminarPublicacion = (id) => {
  const confirmado = confirm('¿Estás seguro de eliminar esta publicación?');

  if (!confirmado) {
    alert('❌ Eliminación cancelada.');
    return; // Salimos de la función si el usuario cancela
  }

  fetch(`http://localhost:3000/api/publicaciones/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(() => {
      setPublicaciones((prev) =>
        prev.filter((p) => p._id !== id && p.id_publicacion !== id)
      );
      alert('✅ Publicación eliminada correctamente.');
    })
    .catch((err) => {
      console.error('Error al eliminar:', err);
      alert('⚠️ Hubo un error al eliminar la publicación.');
    });
};
//* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
//* COMENTARIOS

  // 🔄 Cargar publicaciones reales desde el backend
useEffect(() => {
  cargarPublicaciones();
}, []);

// 💬 Cargar comentarios después de que se cargan las publicaciones
useEffect(() => {
  const cargarComentarios = async () => {
    for (const pub of publicaciones) {
      const id_publicacion = pub.id_publicacion || pub._id;

      try {
        const res = await fetch(`http://localhost:3000/api/comentarios/publicacion/${id_publicacion}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setComentarios((prev) => ({
          ...prev,
          [id_publicacion]: data.data,
        }));
      } catch (error) {
        console.error(`Error al cargar comentarios de publicación ${id_publicacion}:`, error);
      }
    }
  };

  if (publicaciones.length > 0) {
    cargarComentarios();
  }
}, [publicaciones]);
  // 💬 Manejo de comentarios (locales)
  const handleComentarioChange = (e, publicacionId) => {
    setNuevoComentario((prev) => ({
      ...prev,
      [publicacionId]: e.target.value
    }));
  };

const handleEnviarComentario = async (publicacionId) => {
  const comentarioTexto = nuevoComentario[publicacionId];
  if (!comentarioTexto?.trim()) return;

  try {
    const res = await fetch(`http://localhost:3000/api/comentarios/${publicacionId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`, // Asegúrate de tener el token del usuario
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contenido: comentarioTexto }),
    });

    const data = await res.json();

    if (res.ok) {
      setComentarios((prev) => ({
        ...prev,
        [publicacionId]: [data.data, ...(prev[publicacionId] || [])],
      }));

      setNuevoComentario((prev) => ({
        ...prev,
        [publicacionId]: '',
      }));
    } else {
      console.error("Error al enviar comentario:", data.message);
    }
  } catch (error) {
    console.error("Error al enviar comentario:", error);
  }
};

const eliminarComentario = async (idComentario, idPublicacion) => {
  const confirmar = confirm("¿Estás seguro de eliminar este comentario?");
  if (!confirmar) return;

  try {
    const res = await fetch(`http://localhost:3000/api/comentarios/${idComentario}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setComentarios((prev) => ({
        ...prev,
        [idPublicacion]: prev[idPublicacion].filter((c) => c.id_comentario !== idComentario),
      }));
      alert("✅ Comentario eliminado.");
    } else {
      const data = await res.json();
      console.error("Error al eliminar comentario:", data.message);
      alert("⚠️ No se pudo eliminar el comentario.");
    }
  } catch (err) {
    console.error("Error al eliminar comentario:", err);
    alert("❌ Error inesperado.");
  }
};

useEffect(() => {
  const token = user?.token;

  const cargarReunionesConActa = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/meetings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      const reuniones = data.data || [];

      const reunionesConActa = [];

      for (const reunion of reuniones) {
        const resActa = await fetch(`http://localhost:3000/api/meetings/${reunion.id_reunion || reunion._id}/act`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (resActa.ok) {
          const fecha = reunion.fecha?.split('T')[0];
          if (fecha) {
            reunionesConActa.push({ fecha, title: 'Reunión Directiva' });
          }
        }
      }

      // Agrupar por fecha
      const eventosAgrupados = {};
      reunionesConActa.forEach(({ fecha, title }) => {
        if (!eventosAgrupados[fecha]) eventosAgrupados[fecha] = [];
        eventosAgrupados[fecha].push({ title });
      });

      // Llama a Calendario.jsx con estos eventos agrupados
      setEventos(eventosAgrupados);
    } catch (error) {
      console.error("Error al cargar reuniones con acta:", error);
    }
  };

  cargarReunionesConActa();
}, []);

return (
  <>
  <Navbar />

<div className="foro-layout">
  {/* Sidebar */}
  <aside className="foro-sidebar">
    {role === 'administrator' ? <SidebarAdmin /> : <SidebarUsuario />}
  </aside>

  <main className="foro-container">
    <h1 className="foro-titulo">Foro Comunitario</h1>

    {role === 'administrator' && (
      <button className="btn-flotante-crear" onClick={abrirFormulario}>
        <img src="/src/assets/anadir.png" alt="Crear publicación" style={{ width: '50px', height: '50px' }} />
      </button>
    )}

    {/* Layout del foro y calendario */}
    <div className="foro-calendario-layout">
  <div className="foro-publicaciones">
    {/* Aquí van tus publicaciones */}
  </div>

  <div className="calendario-container">
    <Calendario eventos={eventos} />
  </div>



      <div className="foro-publicaciones">
        {publicaciones.length === 0 ? (
          <div className="sin-publicaciones">
            <p>No hay publicaciones aún.</p>
          </div>

          
        ) : (
          publicaciones.map((pub) => {
            const id = pub._id || pub.id_publicacion;
            return (
              <div key={id} className="publicacion">
                <div className="cabecera-publicacion">
                  <h2>{pub.titulo}</h2>
                  <span className="badge-tipo-publicacion">{pub.tipo_de_publicacion}</span>
                </div>

                <div className="contenido-publicacion-externo">
                  <div className="contenido-publicacion-interno">
                    <p>{pub.contenido}</p>
                  </div>
                </div>

                <div className="info-publicacion">
                  <small>
                    Publicado por: Directiva
                    <div className="fecha-publicacion">
                      Fecha: {pub.fecha_publicacion ? new Date(pub.fecha_publicacion).toLocaleDateString() : 'Fecha no disponible'}
                    </div>
                  </small>
                </div>

                {role === 'administrator' && (
                  <div className="acciones-admin">
                    <button
                      onClick={() => comenzarEdicion(pub)}
                      className="btn-icono-admin"
                      title="Editar"
                    >
                      <img src="/src/assets/editar.png" alt="Editar" />
                    </button>

                    <button
                      onClick={() => eliminarPublicacion(id)}
                      className="btn-icono-admin"
                      title="Eliminar"
                    >
                      <img src="/src/assets/eliminar.png" alt="Eliminar" />
                    </button>
                  </div>
                )}

                <div className="comentarios">
                  <h4>Comentarios:</h4>
                  {(comentarios[pub.id_publicacion] || []).map((comentario) => (
                    <div key={comentario.id_comentario} className="comentario">
                      <div className="contenido-comentario">
                        <div className="texto-comentario">
                          <strong>{comentario.user?.fullName || 'Anónimo'}</strong>: {comentario.contenido}
                          <br />
                          <small>{new Date(comentario.fecha_comentario).toLocaleDateString()}</small>
                        </div>

                        {role === 'administrator' && (
                          <button
                            onClick={() => eliminarComentario(comentario.id_comentario, pub.id_publicacion)}
                            className="btn-icono-eliminar"
                            title="Eliminar"
                          >
                            <img src="/src/assets/eliminar.png" alt="Eliminar" style={{ width: '20px', height: '20px' }} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <textarea
                    placeholder="Escribe un comentario..."
                    value={nuevoComentario[pub.id_publicacion] || ''}
                    onChange={(e) => handleComentarioChange(e, pub.id_publicacion)}
                    className="comentario-input"
                  ></textarea>
                  <button
                    onClick={() => handleEnviarComentario(pub.id_publicacion)}
                    className="btn-comentar"
                  >
                    Comentar
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div> {/* Cierre de foro-publicaciones */}
    </div> {/* Cierre de foro-calendario-layout */}
  </main>
</div>

    {/* Modal Crear Publicación */}
    {mostrarFormulario && (
      <div className="modal-formulario">
        <form className="formulario-publicacion" onSubmit={handleCrearPublicacion}>
          <h3>Nueva Publicación</h3>

          <label>Título:</label>
          <input
            type="text"
            name="titulo"
            value={nuevaPublicacion.titulo}
            onChange={handleInputChange}
            required
          />

          <label>Contenido:</label>
          <textarea
            name="contenido"
            value={nuevaPublicacion.contenido}
            onChange={handleInputChange}
            required
          />

          <label>Tipo de publicación:</label>
          <select
            name="tipo_de_publicacion"
            value={nuevaPublicacion.tipo_de_publicacion}
            onChange={handleInputChange}
            required
          >
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

{/* Modal Editar Publicación */}
{editandoId !== null && (
  <div className="modal-formulario">
    <div className="formulario-publicacion">
      <h3>Editar Publicación</h3>

      <label>Título:</label>
      <input
        type="text"
        value={formularioEdicion.titulo}
        onChange={(e) =>
          setFormularioEdicion((prev) => ({
            ...prev,
            titulo: e.target.value,
          }))
        }
        required
      />

      <label>Contenido:</label>
      <textarea
        value={formularioEdicion.contenido}
        onChange={(e) =>
          setFormularioEdicion((prev) => ({
            ...prev,
            contenido: e.target.value,
          }))
        }
        required
      />

      <label>Tipo de publicación:</label>
      <select
        value={formularioEdicion.tipo_de_publicacion}
        onChange={(e) =>
          setFormularioEdicion((prev) => ({
            ...prev,
            tipo_de_publicacion: e.target.value,
          }))
        }
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
        <button type="button" onClick={guardarEdicion}>Guardar</button>
        <button type="button" onClick={cancelarEdicion}>Cancelar</button>
      </div>
    </div>
  </div>
)}



  </>
);
};

export default Foro;
