"use strict";

import User from "../entity/user.entity.js";
//import FamilyGroup from "../entity/family.group.entity.js";

import { AppDataSource } from "../config/configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

// Función para crear usuarios por defecto
export async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);
    //const familyRepository = AppDataSource.getRepository(FamilyGroup);

    const count = await userRepository.count();
    if (count > 0) return;
    const users = [
      {
        role: "administrator",
        firstName: "toreto",
        lastName: "yumilda",
        rut: "77777777-7",
        email: "toreto@gmail.com",
        password: await encryptPassword("toretoteamo"),
        contact: "977777777",
        homeAddress: "avenida tori 34",
        docIdentity: "uploads/doc-admin-identity1.pdf", 
        docResidence: "uploads/doc-admin-residence1.pdf",
        requestStatus: "Aprobado"
      },
      {
        role: "user",
        firstName: "moise",
        lastName: "pirito",
        rut: "19157881-3",
        email: "moisepirito@gmail.com",
        password: await encryptPassword("blancateamo"),
        contact: "977777771",
        homeAddress: "avenida pirito 34",
        docIdentity: "uploads/doc-admin-identity2.pdf", 
        docResidence: "uploads/doc-admin-residence2.pdf",
        requestStatus: "Aprobado"
      }
    ];

        console.log("Creando usuarios...");

        for (const user of users) {
            await userRepository.save((
                userRepository.create(user)
            ));
            console.log(`Usuario '${user.username}' creado exitosamente.`);
        }
    } catch (error) {
        console.error("Error al crear usuarios: ", error);
        process.exit(1);
    }
}