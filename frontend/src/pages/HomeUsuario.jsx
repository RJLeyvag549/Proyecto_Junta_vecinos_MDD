import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/SidebarUsuario';
import "../styles/Home.css";
import "../styles/Sidebar.css";
import "../styles/Navbar.css";

const HomeUsuario = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="home-container">
      <Navbar />
      

      <Sidebar isOpen={sidebarOpen} />

      <main className="main-content">
        <section className="banner-section">
          <h1 className="titulo">
            Construyendo una <br /> comunidad más fuerte
          </h1>
          <h2 className="subtitulo">
            Donde el mar de Chiloé abraza nuestras costas y las tradiciones
            ancestrales cobran vida en cada rincón. Unidos construimos el
            futuro de nuestra querida ciudad.
          </h2>
        </section>

      <section className="contenido-extra">
  <div className="servicios-contenido">
  <h2 className="titulo-beneficios">
  SERVICIOS EXCLUSIVOS AL ASOCIARSE<br />
  A LA JUNTA DE VECINOS
</h2>

    <div className="beneficios-lista">
      <ul>
        <li>Monitoreo 24/7</li>
        <li>Auto de acompañamiento</li>
        <li>Patrullaje adicional para eventos</li>
        <li>Descuentos exclusivos para upgrade de sus alarmas</li>
      </ul>
      <ul>
        <li>Acceso a grabaciones de las cámaras de vigilancia</li>
        <li>Certificados de residencia sin costo para asociados</li>
        <li>Ejecutiva exclusiva</li>
      </ul>
    </div>
  </div>
</section>

      </main>
    </div>
  );
};

export default HomeUsuario;
