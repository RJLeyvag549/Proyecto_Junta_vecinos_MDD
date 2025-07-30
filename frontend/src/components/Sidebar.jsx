import { NavLink } from "react-router-dom";
import SearchIcon from "../assets/searchIcon.svg"; // Asegúrate de que esta ruta sea correcta

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="search-container">
        <input type="text" placeholder="Buscar..." />
        <img src={SearchIcon} alt="Buscar" />
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/home">Inicio</NavLink>
        {/* Agrega más links aquí */}
      </nav>
    </aside>
  );
};

export default Sidebar;

