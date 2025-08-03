import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaComments,
  FaCalendarAlt,
  FaFileAlt,
  FaClipboardCheck,
  FaUsers,
  FaVoteYea,
  FaSearch
} from "react-icons/fa";
import "../styles/SidebarUsuario.css";

const SidebarUsuario = ({ isOpen }) => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <aside className={`sidebar-usuario ${isOpen ? "open" : ""}`} onMouseLeave={() => setOpenSection(null)}>
    
      {/* Comunicación y Participación */}
      <div className="sidebar-usuario__section">
        <div className="sidebar-usuario__section-title" onClick={() => toggleSection("comunicacion")}>
          <div className="sidebar-usuario__icon-circle"><FaComments /></div>
          <span>Comunicación y<br /> Participación</span>
        </div>
        <div className={`sidebar-usuario__sub-links-wrapper ${openSection === "comunicacion" ? "open" : ""}`}>
          <div className="sidebar-usuario__sub-links">
            <NavLink to="/Foro">Foro de Vecinos</NavLink>
            <NavLink to="/calendario">Calendario</NavLink>
          </div>
        </div>
      </div>

      {/* Trámites y Solicitudes */}
      <div className="sidebar-usuario__section">
        <div className="sidebar-usuario__section-title" onClick={() => toggleSection("tramites")}>
          <div className="sidebar-usuario__icon-circle"><FaFileAlt /></div>
          <span>Trámites y<br /> Solicitudes</span>
        </div>
        <div className={`sidebar-usuario__sub-links-wrapper ${openSection === "tramites" ? "open" : ""}`}>
          <div className="sidebar-usuario__sub-links">
            <NavLink to="/certificado">Certificado de residencia</NavLink>
            <NavLink to="/padron">Actualización de padrón</NavLink>
          </div>
        </div>
      </div>

      {/* Participación Comunitaria */}
      <div className="sidebar-usuario__section">
        <div className="sidebar-usuario__section-title" onClick={() => toggleSection("participacion")}>
          <div className="sidebar-usuario__icon-circle"><FaVoteYea /></div>
          <span>Participación<br /> Comunitaria</span>
        </div>
        <div className={`sidebar-usuario__sub-links-wrapper ${openSection === "participacion" ? "open" : ""}`}>
          <div className="sidebar-usuario__sub-links">
            <NavLink to="/actividades">Actividades comunitarias</NavLink>
            <NavLink to="/votaciones">Votaciones vecinales</NavLink>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarUsuario;
