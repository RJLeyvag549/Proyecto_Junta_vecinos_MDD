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
                  SERVICIOS EXCLUSIVOS AL ASOCIARSE<br />
                  A LA JUNTA DE VECINOS
                </h2>

                <ul className="beneficios-lista-admin">
                  <li>✅ Formulario de creación con campos dinámicos y validación de archivos.</li>
                  <li>✅ Subida de comprobante obligatorio para confirmar acreditación.</li>
                  <li>✅ Tabla de gestión con acciones de editar, eliminar y visualizar <br></br>comprobante.</li>
                  <li>✅ Mensajes dinámicos de confirmación y error.</li>
                  <li>✅ Botón para descargar todas las acreditaciones.</li>
                </ul>
              </div>
            </section>

      </main>
    </div>
  );
};

export default HomeAdmin;
