import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUsers, FaCalendarAlt, FaComments, FaUserCheck, FaClipboardList, FaFileAlt, FaMoneyCheckAlt, FaFileInvoiceDollar, FaUniversity, FaBox, FaChartBar, FaSearch } from 'react-icons/fa';
import '../styles/SidebarAdmin.css';

const SidebarAdmin = ({ isOpen }) => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <aside className={`sidebar-admin ${isOpen ? 'open' : ''}`} onMouseLeave={() => setOpenSection(null)}>
      {/* Buscador */}
      <div className="sidebar-admin__search-container">
        <div className="sidebar-admin__icon-circle">
          <FaSearch className="sidebar-admin__search-icon" />
        </div>
        <input type="text" placeholder="Buscar..." />
      </div>

      {/* Comunicación y Participación */}
      <div className="sidebar-admin__section">
        <div className="sidebar-admin__section-title" onClick={() => toggleSection("comunicacion")}>
          <div className="sidebar-admin__icon-circle"><FaComments /></div>
          <span>Comunicación y<br /> Participación</span>
        </div>
        <div className={`sidebar-admin__sub-links-wrapper ${openSection === "comunicacion" ? "open" : ""}`}>
          <div className="sidebar-admin__sub-links">
            <NavLink to="/foro">Foro de Vecinos</NavLink>
            <NavLink to="/calendario">Calendario</NavLink>
          </div>
        </div>
      </div>

      {/* Padrón de Vecinos */}
      <div className="sidebar-admin__section">
        <div className="sidebar-admin__section-title" onClick={() => toggleSection("padron")}>
          <div className="sidebar-admin__icon-circle"><FaUsers /></div>
          <span>Padrón de<br /> Vecinos</span>
        </div>
        <div className={`sidebar-admin__sub-links-wrapper ${openSection === "padron" ? "open" : ""}`}>
          <div className="sidebar-admin__sub-links">
            <NavLink to="/tabla">Tabla de Vecinos</NavLink>
            <NavLink to="/solicitudes">Solicitudes Pendientes</NavLink>
          </div>
        </div>
      </div>

      {/* Gestión de Reuniones */}
      <div className="sidebar-admin__section">
        <div className="sidebar-admin__section-title" onClick={() => toggleSection("reuniones")}>
          <div className="sidebar-admin__icon-circle"><FaClipboardList /></div>
          <span>Gestión de<br /> Reuniones</span>
        </div>
        <div className={`sidebar-admin__sub-links-wrapper ${openSection === "reuniones" ? "open" : ""}`}>
          <div className="sidebar-admin__sub-links">
            <NavLink to="/actas">Actas de Reuniones</NavLink>
            <NavLink to="/gestion-reuniones">Gestión de reuniones</NavLink>
          </div>
        </div>
      </div>

      {/* Gestión de Finanzas */}
      <div className="sidebar-admin__section">
        <div className="sidebar-admin__section-title" onClick={() => toggleSection("finanzas")}>
          <div className="sidebar-admin__icon-circle"><FaMoneyCheckAlt /></div>
          <span>Gestión de<br /> Finanzas</span>
        </div>
        <div className={`sidebar-admin__sub-links-wrapper ${openSection === "finanzas" ? "open" : ""}`}>
          <div className="sidebar-admin__sub-links">
            <NavLink to="/Transacciones">Registro de Transacciones</NavLink>
            <NavLink to="/inventario">Inventario</NavLink>
            <NavLink to="/fondos">Acreditación a Fondos Públicos</NavLink>
            <NavLink to="/graficos">Gráficos Financieros</NavLink>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarAdmin;
