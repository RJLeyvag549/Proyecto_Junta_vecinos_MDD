import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/SidebarAdmin';
import "../styles/HomeAdmin.css";
import "../styles/SidebarAdmin.css";
import "../styles/Navbar.css";

const HomeAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Definimos las funciones de hover
  const handleSidebarHover = () => setSidebarOpen(true);
  const handleSidebarLeave = () => setSidebarOpen(false);

  return (
    <div className="home-container-admin">
      <Navbar />

      <div
        className="sidebar-wrapper-admin"
        onMouseEnter={handleSidebarHover}
        onMouseLeave={handleSidebarLeave}
      >
        <Sidebar isOpen={sidebarOpen} />
      </div>

      <main className={`main-content-admin ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <section className="banner-section-admin">
          <h1 className="titulo-admin">
            Bienvenido <br />Administrador
          </h1>
          <h2 className="subtitulo-admin">
            Zona exclusiva para la gestión <br />administrativa de la comunidad.
          </h2>
        </section>

              <section className="contenido-extra-admin">
              <div className="servicios-contenido-admin">
                <h2 className="titulo-beneficios-admin">
                  COMO ADMINISTRADOR PUEDES:<br />
                  
                </h2>

                <ul className="beneficios-lista-admin">
                  <li>✅ Registrar / actualizar vecinos</li>
                  <li>✅ Aprobar o rechazar solicitudes de certificados de residencia</li>
                  <li>✅ Crear y difundir convocatorias a reuniones comprobante.</li>
                  <li>✅ Registrar asistencia a reuniones</li>
                  <li>✅ Generar y firmar actas de reuniones</li>
                  <li>✅ Registrar ingresos y egresos financieros</li>
                  <li>✅ Generar informes y gráficos financieros</li>
                  <li>✅ Registrar y editar acreditaciones de fondos públicos (con comprobante)</li>
                  <li>✅ Crear, editar y eliminar publicaciones del foro</li>
                  <li>✅ Eliminar comentarios de vecinos en el foro</li>
                  <li>✅ Crear y publicar actividades comunitarias</li>
                  <li>✅ Crear nuevas votaciones (con nombre, fechas y opciones)</li>
                  <li>✅ Ver votos emitidos de forma confidencial (no editar ni duplicar votos)</li>
              
                </ul>
              </div>
            </section>

      </main>
    </div>
  );
};

export default HomeAdmin;
