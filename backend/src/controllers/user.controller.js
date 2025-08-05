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

    const message =
      requestStatus === 'aprobado'
        ? `Hola ${user.fullName}, tu solicitud de registro ha sido aprobada. Ya puedes ingresar al sistema.`
        : `Hola ${user.fullName}, lamentamos informarte que tu solicitud de registro fue rechazada.`;

    if (requestStatus === 'rechazado') {
      await userRepository.remove(user);
    }

    await sendEmail(user.email, subject, message, `<p>${message}</p>`);

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





