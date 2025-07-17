//* SERVICIO PARA GUARDAR DOCUMENTOS DEL USUARIO (CÉDULA Y RESIDENCIA)

"use strict";

import { AppDataSource } from "../config/configDb.js";
import User from "../entity/user.entity.js";

export async function saveDocumentService(data) {  //* parámetro data: objeto que contiene la id del user y las rutas de los archivos
    try {
        const userRepository = AppDataSource.getRepository(User);

        //* Desestructuración para extraer esos tres valores desde el objeto data recibido por la función.
        const { userId, docIdentityPath, docResidencePath } = data;

        //* Aquí se busca al usuario en la base de datos cuyo id coincida con el userId
        const user = await userRepository.findOneBy({ id: userId });

        if (!user) {
            return [null, "Usuario no encontrado"];
    }

        //* Si el user existe se asignan las rutas de los archivos subidos 
        user.docIdentity = docIdentityPath;
        user.docResidence = docResidencePath;

        //* Se actualiza el usuario en la base de datos con las rutas
        const updatedUser = await userRepository.save(user);

        return [updatedUser, null];

      } catch (error) {
        console.error("Error al guardar documentos del usuario:", error);
        return [null, "Error interno del servidor"];
    }
}
