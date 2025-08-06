"use strict";

import User from "../entity/user.entity.js";

import { AppDataSource } from "../config/configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

export async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const count = await userRepository.count();
    if (count > 0) return;
    const users = [
      {
        role: 'administrator',
        fullName: 'Señor Toreto Araya Retamal',
        rut: '19.157.881-3',
        email: 'toreto@gmail.com',
        password: await encryptPassword('toretoteamo'),
        contact: '20690318',
        homeAddress: 'Avenida Tori #21, Concepción',
        docIdentity: 'uploads/doc-admin-identity1.pdf',
        docResidence: 'uploads/doc-admin-residence1.pdf',
        requestStatus: 'aprobado',
      },
      
      {
        role: 'user',
        fullName: 'Moises Pirito Araya Retamal',
        rut: '5.345.876-k',
        email: 'moisepirito@gmail.com',
        password: await encryptPassword('moisesteamo'),
        contact: '82205439',
        homeAddress: 'Avenida Pirito #22, Concepción',
        docIdentity: 'uploads/doc-admin-identity2.pdf',
        docResidence: 'uploads/doc-admin-residence2.pdf',
        requestStatus: 'aprobado',
      },
      {
        role: 'user',
        fullName: 'Yumilda Gaturra Araya Retamal',
        rut: '19.345.654-7',
        email: 'yumilda@gmail.com',
        password: await encryptPassword('yumildateamo'),
        contact: '65476543',
        homeAddress: 'Avenida Yumilda #23, Concepción',
        docIdentity: 'uploads/doc-admin-identity3.pdf',
        docResidence: 'uploads/doc-admin-residence3.pdf',
        requestStatus: 'aprobado',
      },
      {
        role: 'user',
        fullName: 'Blanca Princesa Araya Retamal',
        rut: '7.654.786-9',
        email: 'coquilda@gmail.com',
        password: await encryptPassword('blancateamo'),
        contact: '56765434',
        homeAddress: 'Avenida Pirita #24, Concepción',
        docIdentity: 'uploads/doc-admin-identity4.pdf',
        docResidence: 'uploads/doc-admin-residence4.pdf',
        requestStatus: 'aprobado',
      },
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