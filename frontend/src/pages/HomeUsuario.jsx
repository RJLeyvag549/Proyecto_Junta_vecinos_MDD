import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/SidebarUsuario';
import "../styles/HomeUsuario.css";
import "../styles/SidebarUsuario.css";
import "../styles/Navbar.css";

const HomeUsuario = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Manejar el hover manualmente
  const handleSidebarHover = () => setSidebarOpen(true);
  const handleSidebarLeave = () => setSidebarOpen(false);

  return (
    <div className="home-container-usuario">
      <Navbar />

      {/* Detecta hover para manejar el estado */}
      <div
        className="sidebar-wrapper-usuario"
        onMouseEnter={handleSidebarHover}
        onMouseLeave={handleSidebarLeave}
      >
        <Sidebar isOpen={sidebarOpen} />
      </div>

      <main className={`main-content-usuario ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <section className="banner-section-usuario">
          <h1 className="titulo-usuario">
            Construyendo una <br /> comunidad más fuerte
          </h1>
          <h2 className="subtitulo-usuario">
            Donde el mar de Chiloé abraza nuestras costas y las tradiciones
            ancestrales cobran vida en cada rincón. Unidos construimos el
            futuro de nuestra querida ciudad.
          </h2>
        </section>

      <section className="contenido-extra-usuario">
  <div className="servicios-contenido-usuario">
    <h2 className="titulo-beneficios-usuario">
      SERVICIOS EXCLUSIVOS AL ASOCIARSE<br />
      A LA JUNTA DE VECINOS
    </h2>

    <ul className="beneficios-lista-usuario">
      <li>✅ Monitoreo 24/7</li>
      <li>✅ Auto de acompañamiento</li>
      <li>✅ Patrullaje adicional para eventos</li>
      <li>✅ Descuentos exclusivos para upgrade de sus alarmas</li>
      <li>✅ Acceso a grabaciones de las cámaras de vigilancia</li>
      <li>✅ Certificados de residencia sin costo para asociados</li>
      <li>✅ Ejecutiva exclusiva</li>
    </ul>
  </div>
</section>





      </main>
    </div>
  );
};

export default HomeUsuario;
