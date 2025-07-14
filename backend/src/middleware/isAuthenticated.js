"use strict";
import jwt from "jsonwebtoken";

export function isAuthenticated(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) 
      return res.status(401).json({ message: "No autorizado. Token faltante." });

    const token = authHeader.split(" ")[1]; // Bearer TOKEN
    if (!token)
      return res.status(401).json({ message: "No autorizado. Token inválido." });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado.", error });
  }
}
