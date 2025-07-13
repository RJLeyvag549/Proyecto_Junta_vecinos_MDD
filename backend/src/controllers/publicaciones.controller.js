"use strict";
import { publicacionesEntity } from "../entity/publicaciones.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { createValidation } from "../validations/publicaciones.validation.js";
import { updateValidation } from "../validations/publicaciones.validation.js";


export async function getPublicaciones(req,res) {
//&
    try{
        const publicacionesRepository = AppDataSource.getRepository(publicacionesEntity);
        const publicaciones = await publicacionesRepository.find();

        res.status(200).json({ message: "Publicaciones encontradas: ", data: publicaciones})
    }catch (error) {
        console.error(" Error al crear la publicación: ", error);
        res.status(500).json({ message: "Error al crear la publicación."});
    }
    
  }

export async function createPublicaciones(req, res) {
  try {
    const publicacionesRepository = AppDataSource.getRepository(publicacionesEntity);

    const { titulo, contenido, tipo_de_publicacion } = req.body;
    const { error } = createValidation.validate(req.body);
    if (error)
      return res.status(400).json({
        message: "Error al crear una publicación",
        error: error,
      });

    const newpublicacion = publicacionesRepository.create({
      titulo,
      contenido,
      tipo_de_publicacion,
    });

    await publicacionesRepository.save(newpublicacion);

    res.status(201).json({
      message: "Publicación creada exitosamente",
      data: newpublicacion,
    });

  } catch (error) {
    console.error("Error al crear publicación: ", error);
    res.status(500).json({
      message: "Error al crear publicación.",
      error: error.message,
      stack: error.stack,
    });
  }
}

// Editar
export async function updatePublicacion(req, res) {
  try {
    const { id_publicacion } = req.params;
    const repo = AppDataSource.getRepository(publicacionesEntity);

    const publicacion = await repo.findOneBy({ id_publicacion });
    if (!publicacion)
      return res.status(404).json({ message: "Publicación no encontrada" });

    const { error } = updatePublicacionValidation.validate(req.body);
    if (error)
      return res.status(400).json({ message: "Error de validación", detalle: error.details });

    repo.merge(publicacion, req.body);
    await repo.save(publicacion);

    res.status(200).json({ message: "Publicación actualizada", data: publicacion });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar", error: error.message });
  }
}

export async function getPublicacionConComentarios(req, res) {
  try {
    const { id_publicacion } = req.params;

    const repo = AppDataSource.getRepository(publicacionesEntity);

    const publicacion = await repo.findOne({
      where: { id_publicacion: parseInt(id_publicacion) },
      relations: ["comentarios"], // <--- Esto carga los comentarios asociados
    });

    if (!publicacion) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    res.status(200).json({
      message: "Publicación encontrada con comentarios",
      data: publicacion,
    });

  } catch (error) {
    console.error("Error al obtener publicación con comentarios:", error);
    res.status(500).json({ message: "Error interno", error: error.message });
  }
}

export async function deletePublicacion(req, res) {
  try {
    const { id_publicacion } = req.params;
    const publicacionesRepository = AppDataSource.getRepository(publicacionesEntity);

    const publicacion = await publicacionesRepository.findOneBy({ id_publicacion: parseInt(id_publicacion) });

    if (!publicacion) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    await publicacionesRepository.remove(publicacion);

    res.status(200).json({ message: "Publicación eliminada exitosamente" });

  } catch (error) {
    console.error("Error al eliminar publicación:", error);
    res.status(500).json({ message: "Error interno al eliminar publicación", error: error.message });
  }
}



