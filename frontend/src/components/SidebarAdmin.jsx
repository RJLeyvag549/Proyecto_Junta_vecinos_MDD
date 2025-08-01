import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUsers, FaHome, FaSignOutAlt } from 'react-icons/fa';
import '../styles/Sidebar.css';

const SidebarAdmin = ({ isOpen }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <ul>
        <li>
          <NavLink to="/home" activeClassName="active">
            <FaHome /> Inicio
          </NavLink>
        </li>
        <li>
          <NavLink to="/users" activeClassName="active">
            <FaUsers /> Gestión de Usuarios
          </NavLink>
        </li>
        <li>
          <button
            className="boton-cerrar"
            onClick={() => {
              sessionStorage.removeItem("usuario");
              window.location.href = "/login";
            }}
          >
            <FaSignOutAlt /> Cerrar sesión
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SidebarAdmin;
