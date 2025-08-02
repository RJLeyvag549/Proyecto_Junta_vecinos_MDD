import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/SidebarAdmin';
import "../styles/Home.css";
import "../styles/Sidebar.css";
import "../styles/Navbar.css";

const HomeAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="home-container">
      <Navbar />

      <Sidebar isOpen={sidebarOpen} />

      <main className="main-content">
        <section className="banner-section">
          <h1 className="titulo">
            EN MANTENCION AUN
          </h1>
          <h2 className="subtitulo">
            Admin puto
          </h2>
        </section>

        <section className="contenido-extra">
          <div className="servicios-contenido">
            <h2 className="titulo-beneficios">
              FUNCIONES DISPONIBLES PARA ADMINISTRADORES
            </h2>

            <div className="beneficios-lista">
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
