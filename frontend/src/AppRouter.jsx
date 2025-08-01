import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const HomeRedirect = () => {
  const [redirectTo, setRedirectTo] = useState(null);
  const user = JSON.parse(sessionStorage.getItem("usuario"));

  useEffect(() => {
    if (!user) {
      setRedirectTo("/login");
    } else {
      const rol = user?.data?.rolName;
      if (rol === "administrador") {
        setRedirectTo("/home/admin");
      } else {
        setRedirectTo("/home/usuario");
      }
    }
  }, []);

  if (redirectTo) {
    return <Navigate to={redirectTo} />;
  }

  return null; // Mientras calcula redirección
};

export default HomeRedirect;
