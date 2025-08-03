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
              FUNCIONES DISPONIBLES PARA ADMINISTRADORES
            </h2>

            <div className="beneficios-lista-admin">
              <ul>
                <li>Gestión de usuarios y solicitudes</li>
                <li>Supervisión de eventos y actividades</li>
                <li>Control de presupuestos y pagos</li>
                <li>Revisión de documentos oficiales</li>
              </ul>
              <ul>
                <li>Acceso a reportes y estadísticas</li>
                <li>Notificaciones a vecinos</li>
                <li>Configuración de roles y permisos</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomeAdmin;
