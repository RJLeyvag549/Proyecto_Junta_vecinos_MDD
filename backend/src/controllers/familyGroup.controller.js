"use strict";

import { AppDataSource } from "../config/configDb.js";
import User from "../entity/user.entity.js";
import FamilyGroup from "../entity/family.group.entity.js";

//* FUNCIÓN PARA AÑADIR MIEMBROS AL GRUPO FAMILIAR
export async function addFamilyMember(req, res) {
  try {
		//* DEL BODY SE EXTRAE: userId = ID del usuario que se está registrando, members = array de objetos con los datos de los miembros a registrar
    const { userId, members } = req.body;

		//* VALIDACIÓN: si no se proporciona un userId o si members no es un array o está vacío, se devuelve un error
    if (!userId || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ message: "Datos incompletos o inválidos!" });
    }

    const userRepository = AppDataSource.getRepository(User);
    const familyRepository = AppDataSource.getRepository(FamilyGroup);

		//* Se busca a userId en la base
    const user = await userRepository.findOneBy({ id: userId });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado!" });

		//* Se recorre el array de miembros y se extrae el nombre, apellido y rut 
    for (const member of members) {
      const { firstName, lastName, rut } = member;
			//* si falta alguno de esos campos se omite a ese miembro
      if (!firstName || !lastName || !rut) continue;

			//* se crea objeto nuevo para el miembro del grupo familiar 
      const newMember = familyRepository.create({
        firstName,
        lastName,
        rut,
        mainUser: user, //* establece la relación entre el miembro del grupo y el usuario que lo registra
      });

      await familyRepository.save(newMember);
    }

    return res.status(201).json({ message: "Grupo familiar creado exitosamente!" });

  } catch (error) {
    console.error("Error en familyGroup.controller.js -> addFamilyMember(): ", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
}