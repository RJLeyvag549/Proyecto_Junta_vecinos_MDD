
"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";

//* middleware de autorización. Su objetivo es restringir el acceso a ciertas rutas del backend únicamente 
//* a usuarios con el rol "administrator"

//*  Se ejecuta después de que el usuario fue autenticado con JWT  (después del middleware authenticateJwt).

export async function isAdmin(req, res, next) {
  try {
    // Buscar el usuario en la base de datos
    const userRepository = AppDataSource.getRepository(User);

    //* Busca al usuario por email porque ese dato se guardó en el payload del token JWT al iniciar sesión.
    const userFound = await userRepository.findOneBy({ email: req.user?.email, });

    if (!userFound) return res.status(404).json("Usuario no encontrado");

    // Verificar el rol del usuario
    const rolUser = userFound.role;

    // Si el rol no es administrador, devolver un error 403
    if (rolUser !== "administrator")
      return res
        .status(403)
        .json({
          message:
            "Error al acceder al recurso. Se requiere un rol de administrador para realizar esta acción.",
        });

    // Si el rol es administrador, continuar
    next();
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
}
