"use strict";
import Joi from "joi"; //Este se suele usar para las validaciones


export const createValidation = Joi.object({
    titulo: Joi.string()
    .min(3)
    .max(50)
    .required()// Que no este (que no haya puesto nada)
    .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        .messages({
            "string.pattern.base": "El titulo solo puede contener letras y numeros",
            //El mensaje que salga cuando no cumpla con el minimo de caracteres
            "string.min": "El titulo debe tener mas de 3 caracteres",
            "string.max": "EL titulo debe tener menos de 50 caracteres",
            "string.empty": "El titulo es obligatorio ",
        }),
    contenido: Joi.string()
        .min(3)
        .max(300)
        .required()
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,;:¡!¿?'"()\-\n\s]+$/)
        .messages({
                    "string.patter.base": "El contenido solo puede contener letras y numeros",
                    //El mensaje que salga cuando no cumpla con el minimo de caracteres
                    "string.min": "El contenido debe tener mas de 3 caracteres",
                    "string.max": "EL contenido debe tener menos de 50 caracteres",
                    "string.empty": "El contenido es obligatorio ",
        }),
    tipo_de_publicacion: Joi.string()
    .valid ("Bienestar físico", "Medioambiente", "Educativos", "Arte y creatividad", "Entretenimiento")
    .required()
    .messages({
        "any.only": " La opcion debe ser uno de los siguientes: Bienestar físico, Medioambiente, Educativos, Arte y creatividad, Entretenimiento",
        "string.empty": "Es obligatorio poner le tipo"
    }),

});

  export const updateValidation = Joi.object({
      titulo: Joi.string()
      .min(3)
      .max(50)
      .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
      .messages({
        "string.pattern.base": "El título solo puede contener letras y espacios",
        "string.min": "El título debe tener más de 3 caracteres",
        "string.max": "El título debe tener menos de 50 caracteres",
      }),

    contenido: Joi.string()
      .min(3)
      .max(300)
      .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,;:¡!¿?'"()\-\n\s]+$/)
      .messages({
        "string.pattern.base": "El contenido solo puede contener texto y puntuación válida",
        "string.min": "El contenido debe tener más de 3 caracteres",
        "string.max": "El contenido debe tener menos de 300 caracteres",
      }),

    tipo_de_publicacion: Joi.string()
      .valid(
        "Bienestar físico",
        "Medioambiente",
        "Educativos",
        "Arte y creatividad",
        "Entretenimiento"
      )
      .messages({
        "any.only": "La opción debe ser una de las categorías válidas",
      }),
});


