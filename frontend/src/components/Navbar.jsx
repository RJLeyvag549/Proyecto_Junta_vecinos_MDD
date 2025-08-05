// src/components/Navbar.jsx
import { useNavigate } from "react-router-dom";
import { logout } from '../services/auth.service.js';
import '../styles/Navbar.css'; 

const Navbar = () => {
  const navigate = useNavigate();

  const logoutSubmit = async () => {
    try {
      await logout(); 
      navigate('/login', { replace: true }); // 🔁 no volver a HomeRedirect
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="navbar">
      <ul>
        <li className="logo-section">
          <img
            src="/family.png"
            alt="Logo metodología de desarrollo"
          />
          <h1>Junta Vecinal Parque Ecuador</h1>
        </li>

        <li>
          <button onClick={logoutSubmit} className="boton-cerrar">
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
