"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isAdmin } from "../middleware/authorization.middleware.js";
import { createComentario } from "../controllers/comentarios.controller.js";
import { deletePublicacion } from "../controllers/publicaciones.controller.js";
import { getComentariosByPublicacion } from "../controllers/comentarios.controller.js";
import { updateComentario } from "../controllers/comentarios.controller.js";


const router = Router();

// Ruta para crear comentario: solo requiere usuario autenticado
    router.post("/:id_publicacion",authenticateJwt,createComentario);
    // Ruta para eliminar publicación: solo admins
    router.delete("/:id_publicacion",authenticateJwt,isAdmin,deletePublicacion);
    //Ver los comentarios de una publicacion
    router.get("/publicacion/:id_publicacion", authenticateJwt, getComentariosByPublicacion);
    router.put("/:id_comentario", authenticateJwt, updateComentario);


    


export default router;
