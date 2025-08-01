import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Home.css";
import comunicacionIcon from "../assets/comunicacion-icon.png";
import tramitesIcon from "../assets/tramites-icon.png";
import usuarioIcon from "../assets/usuario-icon.png";
import lupaIcon from "../assets/lupa-icon.png";

const Sidebar = ({ isOpen }) => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}
     onMouseLeave={() => setOpenSection(null)}>
      <nav className="sidebar-nav">

        {/* Buscador */}
        <div className="search-container">
          <div className="icon-circle">
            <img src={lupaIcon} alt="Buscar" className="section-icon" />
          </div>
          <input type="text" placeholder="Buscar..." />
        </div>

        {/* Comunicación */}
        <div className="section">
          <div className="section-title" onClick={() => toggleSection("comunicacion")}>
            <div className="icon-circle">
              <img src={comunicacionIcon} alt="" className="section-icon" />
            </div>
            <span>
              Comunicación y<br /> Participación
            </span>
          </div>

          <div className={`sub-links-wrapper ${openSection === "comunicacion" ? "open" : ""}`}>
            <div className="sub-links">
              <NavLink to="/foro">Foro de Vecinos</NavLink>
              <NavLink to="/calendario">Calendario</NavLink>
            </div>
          </div>
        </div>

        {/* Trámites */}
        <div className="section">
          <div className="section-title" onClick={() => toggleSection("tramites")}>
            <div className="icon-circle">
              <img src={tramitesIcon} alt="" className="section-icon" />
            </div>
            <span>
              Trámites y<br /> Solicitudes
            </span>
          </div>

          <div className={`sub-links-wrapper ${openSection === "tramites" ? "open" : ""}`}>
            <div className="sub-links">
              <NavLink to="/certificado">Certificado de residencia</NavLink>
              <NavLink to="/padron">Actualización de padrón</NavLink>
            </div>
          </div>
        </div>

        {/* Participación */}
        <div className="section">
          <div className="section-title" onClick={() => toggleSection("participacion")}>
            <div className="icon-circle">
              <img src={usuarioIcon} alt="" className="section-icon" />
            </div>
            <span>
              Participación<br /> Comunitaria
            </span>
          </div>

          <div className={`sub-links-wrapper ${openSection === "participacion" ? "open" : ""}`}>
            <div className="sub-links">
              <NavLink to="/actividades">Actividades comunitarias</NavLink>
              <NavLink to="/votaciones">Votaciones vecinales</NavLink>
            </div>
          </div>
        </div>

      </nav>
    </aside>
  );
};

export default Sidebar;
