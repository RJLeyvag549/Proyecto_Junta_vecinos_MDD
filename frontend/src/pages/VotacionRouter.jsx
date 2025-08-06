import React, { useEffect, useState } from 'react';
import Votacion from './Votacion';
import VotacionAdmin from './VotacionAdmin';

const VotacionRouter = () => {
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const userRole = user?.data?.role;

        console.log("ROL DEL USUARIO:", userRole); // 👈 Asegúrate de que esto muestra 'admin' o 'vecino'
        setRol(userRole);
      } catch (err) {
        console.error("Error al parsear user desde sessionStorage:", err);
      }
    }
  }, []);

  if (!rol) return <p>Cargando...</p>;

  return (
    <>
      {rol === "administrator" ? <VotacionAdmin /> : <Votacion />}
    </>
  );
};

export default VotacionRouter;
