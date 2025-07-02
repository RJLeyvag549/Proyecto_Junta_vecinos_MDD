"use strict";
import Meeting from "../entity/meeting.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { generateAttendanceForMeeting } from "./attendance.controller.js";

export async function createMeeting(req, res) {
  try {
    // Obtener el repositorio de reuniones y validar los datos de entrada
    const meetingRepository = AppDataSource.getRepository(Meeting);
    const { lugar, fecha, hora, modalidad } = req.body;

    // Verificar si el usuario ya existe verificando email, rut y username
    const existingFechaMeeting = await meetingRepository.findOne({
      where: { fecha },
    });
    if (existingFechaMeeting)
      return res.status(409).json({ message: "Reunion ya registrado." });

    const newMeeting = meetingRepository.create({
      lugar,
      fecha,
      hora,
      modalidad
    });
    await meetingRepository.save(newMeeting);
    await generateAttendanceForMeeting(newMeeting.id);

    res
      .status(201)
      .json({ message: "Reunion creada exitosamente!", data: newMeeting });
  } catch (error) {
    console.error("Error en meeting.controller.js -> create(): ", error);
    return res.status(500).json({ message: "Error al crear la reunion" });
  }
}

export async function getMeetings(req, res) {
  try {
    // Obtener el repositorio de reuniones y buscar todas las reuniones
    const meetingRepository = AppDataSource.getRepository(Meeting);
    const meetings = await meetingRepository.find();

    res.status(200).json({ message: "Reuniones encontradas: ", data: meetings });
  } catch (error) {
    console.error("Error en meeting.controller.js -> getMeetings(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function getMeetingById(req, res) {
  try {
    // Obtener el repositorio de reuniones y buscar una reunion por ID
    const meetingRepository = AppDataSource.getRepository(Meeting);
    const { id } = req.params;
    const meeting = await meetingRepository.findOne({ where: { id } });

    // Si no se encuentra la reunion, devolver un error 404
    if (!meeting) {
      return res.status(404).json({ message: "Reunion no encontrada." });
    }

    res.status(200).json({ message: "Reunion encontrada: ", data: meeting });
  } catch (error) {
    console.error("Error en meeting.controller.js -> getMeetingById(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function updateMeetingById(req, res) {
  try {
    // Obtener el repositorio de reuniones y buscar una reunion por ID
    const meetingRepository = AppDataSource.getRepository(Meeting);
    const { id } = req.params;
    const { lugar, fecha, hora, modalidad} = req.body;
    const meeting = await meetingRepository.findOne({ where: { id } });

    // Si no se encuentra la reunion, devolver un error 404
    if (!meeting) {
      return res.status(404).json({ message: "Reunion no encontrada." });
    }

    // Validar que al menos uno de los campos a actualizar esté presente
    meeting.lugar = lugar || meeting.lugar;
    meeting.fecha = fecha || meeting.fecha;
    meeting.hora = hora || meeting.hora;
    meeting.modalidad = modalidad || meeting.modalidad;

    // Guardar los cambios en la base de datos
    await meetingRepository.save(meeting);

    res
      .status(200)
      .json({ message: "Reunion actualizado exitosamente.", data: meeting });
  } catch (error) {
    console.error("Error en meeting.controller.js -> updateMeetingById(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function deleteMeetingById(req, res) {
  try {
    // Obtener el repositorio de reuniones y buscar la reunion por ID
    const meetingRepository = AppDataSource.getRepository(Meeting);
    const { id } = req.params;
    const meeting = await meetingRepository.findOne({ where: { id } });

    // Si no se encuentra la reunion, devolver un error 404
    if (!meeting) {
      return res.status(404).json({ message: "Reunion no encontrado." });
    }

    // Eliminar la Reunion de la base de datos
    await meetingRepository.remove(meeting);

    res.status(200).json({ message: "Reunion eliminada exitosamente." });
  } catch (error) {
    console.error("Error en meeting.controller.js -> deleteMeetingById(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function getMeeting(req, res) {
  try {
    // Obtener el repositorio de reuniones y buscar la reunion
    const meetingRepository = AppDataSource.getRepository(Meeting);
    const meetingFecha = req.Meeting.fecha;
    const meeting = await meetingRepository.findOne({ where: { fecha: meetingFecha } });
    
    // Si no se encuentra la reunion, devolver un error 404
    if (!meeting) {
      return res.status(404).json({ message: "Reunion no encontrada." });
    }

    // Formatear la respuesta excluyendo la fecha de creacion y actualizacion en el sistema
    const formattedMeeting = {
      id: meeting.id,
      lugar: meeting.lugar,
      fecha: meeting.fecha,
      hora: meeting.hora,
      modalidad: meeting.modalidad
    };

    res.status(200).json({ message: "Reunion encontrado: ", data: formattedMeeting });
  } catch (error) {
    console.error("Error en meeting.controller -> getMeeting(): ", error);
    res.status(500).json({ message: "Error interno del servidor"})
  }
}