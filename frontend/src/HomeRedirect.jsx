import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

const HomeRedirect = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔁 Redireccionando desde HomeRedirect...");
    console.log("🧠 Usuario desde sessionStorage:", user);

    if (!user) {
      console.warn("⚠️ No hay usuario, redirigiendo a login");
      navigate("/login");
      return;
    }

    const role = user?.data?.role; // 👈 DEBE ser "data.role"
    console.log("✅ Rol detectado:", role);

    if (role === "administrator") {
      navigate("/home/admin");
    } else if (role === "user") {
      navigate("/home/usuario");
    } else {
      console.warn("⚠️ Rol desconocido, redirigiendo a login");
      navigate("/login");
    }
  }, [navigate]);

  
const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("user"); // 👈 Limpia la sesión
    navigate("/login", { replace: true }); // 👈 Navega directo al login
  };

  return (
    <button onClick={handleLogout}>Cerrar sesión</button>
  );
};
  return null;
};

export default HomeRedirect;
