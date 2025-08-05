//* ESTE ARCHIVO ES PARA PROTEGER LAS RUTAS 

"use strict";

import { SESSION_SECRET } from "../config/configEnv.js";
import { AppDataSource } from "../config/configDb.js";
import jwt from "jsonwebtoken";

export async function authenticateJwt(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "Token no proporcionado" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SESSION_SECRET);
    
    const userRepository = AppDataSource.getRepository("User");
    const user = await userRepository.findOneBy({ id: decoded.id });
    
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }
    
    req.user = user; 
    next();
    
  } catch (error) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
}
