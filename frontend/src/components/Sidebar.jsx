import { NavLink } from "react-router-dom";
import { LiaFileAlt } from "react-icons/lia";

const Sidebar = () => {
  const usuario = JSON.parse(sessionStorage.getItem("usuario"));
  const isAdmin = usuario?.role === "admin"; // <-- ajusta el campo según tu backend
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink to="/home" className={({ isActive }) => isActive ? 'active' : ''}>
          Inicio
        </NavLink>

        {isAdmin && (
          <NavLink to="/planilla" className={({ isActive }) => isActive ? 'active' : ''}>
            <LiaFileAlt className="icon" /> Planilla
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;

