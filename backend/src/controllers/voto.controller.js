/*
"use strict";

import { AppDataSource } from "../config/configDb.js";
import Voto, { VotoEntity } from "../entity/voto.entity.js";
import VotacionEntity from "../entity/votacion.entity.js";
import { Equal } from "typeorm";

//Emitir voto (usuario autenticado)
export async function emitirVoto(req, res) {
    try {
        const votoRepo = AppDataSource.getRepository(VotoEntity);
        const votacionRepo = AppDataSource.getRepository(VotacionEntity);

        // Extrae los datos del cuerpo de la solicitud
        const { id_votacion, opcion_elegida } = req.body; 
        const rut_usuario = req.user.rut; // Asumiendo que el middleware de autenticación agrega el usuario al request

        // Verifica si la votación existe
        const votacion = await votacionRepo.findOne({ where: { id: id_votacion } });

        if (!votacion) {
            return res.status(404).json({ message: "Votación no encontrada" });
        }

        // Verifica si la votación está disponible
        // Compara la fecha actual con las fechas de inicio y fin de la votación
        const ahora = new Date();
        if (ahora < votacion.fecha_inicio || ahora > votacion.fecha_fin) { // Verifica si la votación está disponible
            return res.status(400).json({ message: "La votación no está disponible en este momento" });
        }

        // Verifica si el usuario ya votó en esta votación
        const yaVoto = await votoRepo.findOne({
            where: {
                votacion: Equal(id_votacion),
                votante: Equal(rut_usuario),
            },
        });
        // Si ya votó, no permite votar de nuevo
        if(yaVoto) {
            return res.status(400).json({ message: "Ya has votado en esta votación" });
        }

        // Crea un nuevo voto
        const nuevoVoto = votoRepo.create ({
            opcion_elegida,
            votacion: { id: id_votacion },
            votante: rut_usuario,
        })
        // Guarda el nuevo voto en la base de datos
        await votoRepo.save(nuevoVoto);
        res.status(201).json({ message: "Voto emitido con éxito", data: nuevoVoto });
    } catch (error) {
    console.error ("Error en voto.controller.js -> emitirVoto(): ", error);
    res.status(500).json({ message: "Error al emitir el voto" });  
    }
}
    */