import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomeRedirect = () => {
  const user = JSON.parse(sessionStorage.getItem("usuario"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const role = user?.data?.role;
    console.log("Rol detectado:", role);

    if (role === "administrator") {
      navigate("/home/admin");
    } else {
      navigate("/home/usuario");
    }
  }, [navigate, user]);

  return null; // Puedes agregar un loader si quieres
};

export default HomeRedirect;
