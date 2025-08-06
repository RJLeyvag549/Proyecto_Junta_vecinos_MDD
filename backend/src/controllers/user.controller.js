//* CRUD DE USUARIOS

'use strict';

import User from '../entity/user.entity.js';
import { AppDataSource } from '../config/configDb.js';
import { sendEmail } from '../services/email.service.js';
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//* Busca y devuelve todos los usuarios registrados (aprobados) en la base de datos 
export async function getUsers(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const approvedUsers = await userRepository.find({
      where: { requestStatus: 'aprobado' },
    });

    const filteredUsers = approvedUsers.map((user) => ({
      id: user.id,
      role: user.role,
      fullName: user.fullName,
      rut: user.rut,
    }));

    res
      .status(200)
      .json({ message: 'Usuarios encontrados: ', data: filteredUsers });
  } catch (error) {
    console.error('Error en user.controller.js -> getUsers(): ', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//* Busca y devuelve un usuario específico según su id 
export async function getUserById(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { id } = req.params;

    const user = await userRepository.findOne({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const filteredUser = {
      id: user.id,
      role: user.role,
      fullName: user.fullName,
      rut: user.rut,
      email: user.email,
      contact: user.contact,
      homeAddress: user.homeAddress,
      docIdentity: user.docIdentity,
      docResidence: user.docResidence,
    };

    res
      .status(200)
      .json({ message: 'Usuario encontrado: ', data: filteredUser });
  } catch (error) {
    console.error('Error en user.controller.js -> getUserById(): ', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export async function updateUserById(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { id } = req.params;
    const { fullName, email, contact, homeAddress } = req.body;

    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    user.fullName = fullName;
    user.email = email;
    user.contact = contact;
    user.homeAddress = homeAddress;

    await userRepository.save(user);

    res.status(200).json({
      message: 'Usuario actualizado exitosamente!',
      data: user,
    });
  } catch (error) {
    console.error('Error en user.controller.js -> updateUserById(): ', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//* Elimina un usuario específico según su id.
export async function deleteUserById(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { id } = req.params;
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    await userRepository.remove(user);

    res.status(200).json({ message: 'Usuario eliminado exitosamente.' });
  } catch (error) {
    console.error('Error en user.controller.js -> deleteUserById(): ', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//* Busca y devuelve todos los usuarios pendientes en la base de datos 
export async function getPendingUsers(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const pendingUsers = await userRepository.find({
      where: { requestStatus: 'pendiente' },
    });

    console.log('Usuarios pendientes encontrados:', pendingUsers);

    const filteredUsers = pendingUsers.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      rut: user.rut,
      email: user.email,
      contact: user.contact,
      homeAddress: user.homeAddress,
      docIdentity: user.docIdentity,
      docResidence: user.docResidence,
    }));

    res
      .status(200)
      .json({ message: 'Usuarios encontrados: ', data: filteredUsers });
  } catch (error) {
    console.error('Error en user.controller.js -> getUsers(): ', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//* Actualiza estado de la solicitud
export async function updateRequestStatus(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { id } = req.params;
    const { requestStatus } = req.body;

    const allowedStatus = ['aprobado', 'rechazado'];
    if (!allowedStatus.includes(requestStatus)) {
      return res
        .status(400)
        .json({ message: 'Estado inválido! Debe ser: aprobado, rechazado' });
    }

    const user = await userRepository.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    if (user.requestStatus !== 'pendiente') {
      return res.status(400).json({
        message: `La solicitud ya fue procesada (${user.requestStatus}).`,
      });
    }

    user.requestStatus = requestStatus;
    await userRepository.save(user);

    //* NODEMAILER
    const subject =
      requestStatus === 'aprobado'
        ? '¡Tu solicitud fue aprobada!'
        : 'Tu solicitud fue rechazada';

//////////////////////////////////////////////////
    const messageText =
      requestStatus === 'aprobado'
        ? `Hola ${user.fullName},\n\n` +
          `¡Te damos la bienvenida a la Junta Vecinal Parque Ecuador!\n\n` +
          `Nos complace informarte que tu solicitud de registro ha sido aprobada exitosamente. A partir de ahora, puedes acceder al sistema y participar activamente en las actividades, solicitudes y gestiones vecinales que ofrecemos.\n\n` +
          `Tu participación es muy importante para fortalecer nuestra comunidad. No dudes en contactarnos si tienes dudas o necesitas apoyo.\n\n` +
          `Saludos cordiales,\nJunta Vecinal Parque Ecuador`
        : `Hola ${user.fullName},\n\n` +
          `Lamentamos informarte que tu solicitud de registro en la Junta Vecinal Parque Ecuador no ha sido aprobada.\n\n` +
          `Esto puede deberse a que los datos entregados no fueron suficientes o no cumplen con los requisitos actuales. Si consideras que se trata de un error o deseas volver a postular, te invitamos a revisar tu información y comunicarte con nosotros para más detalles.\n\n` +
          `Gracias por tu interés en ser parte de nuestra comunidad.\n\n` +
          `Atentamente,\nJunta Vecinal Parque Ecuador`;

    const messageHtml =
      requestStatus === 'aprobado'
        ? `
      <p>Hola ${user.fullName},</p>
      <p><strong>¡Te damos la bienvenida a la Junta Vecinal Parque Ecuador!</strong></p>
      <p>
        Nos complace informarte que tu solicitud de registro ha sido aprobada exitosamente.
        A partir de ahora, puedes acceder al sistema y participar activamente en las actividades,
        solicitudes y gestiones vecinales que ofrecemos.
      </p>
      <p>
        Tu participación es muy importante para fortalecer nuestra comunidad.
        No dudes en contactarnos si tienes dudas o necesitas apoyo.
      </p>
      <p>Saludos cordiales,<br><strong>Junta Vecinal Parque Ecuador</strong></p>
    `
        : `
      <p>Hola ${user.fullName},</p>
      <p>
        Lamentamos informarte que tu solicitud de registro en la <strong>Junta Vecinal Parque Ecuador</strong> no ha sido aprobada.
      </p>
      <p>
        Esto puede deberse a que los datos entregados no fueron suficientes o no cumplen con los requisitos actuales.
        Si consideras que se trata de un error o deseas volver a postular,
        te invitamos a revisar tu información y comunicarte con nosotros para más detalles.
      </p>
      <p>
        Gracias por tu interés en ser parte de nuestra comunidad.
      </p>
      <p>Atentamente,<br><strong>Junta Vecinal Parque Ecuador</strong></p>
    `;
    //////////////////////////////////////////////////

    if (requestStatus === 'rechazado') {
      await userRepository.remove(user);
    }

await sendEmail(user.email, subject, messageText, messageHtml);

    res.status(200).json({
      message: `Solicitud actualizada a: ${requestStatus}`,
      data: user,
    });
  } catch (error) {
    console.error(
      'Error en user.controller.js -> updateRequestStatus(): ',
      error
    );
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}





