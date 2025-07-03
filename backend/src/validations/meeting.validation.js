"use strict";
import Joi from "joi";

export const createMeetingValidation = Joi.object({
    lugar: Joi.string().max(30).required().messages({
        "string.max": "El lugar no puede exceder los 30 caracteres.",
        "string.empty": "El lugar de usuario es obligatorio.",
    }),
    fecha: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .required()
        .messages({
            "string.pattern.base": "La fecha debe tener el formato AAAA-MM-DD.",
            "string.empty": "La fecha es obligatoria.",
        }),

    hora: Joi.string()
        .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .required()
        .messages({
            "string.pattern.base": "La hora debe tener el formato HH:mm.",
            "string.empty": "La hora es obligatoria.",
        }),
    modalidad: Joi.string()
        .valid("presencial", "virtual")
        .messages({
            "string.base": "La modalidad debe ser un texto.",
            "any.only": "La modalidad debe ser 'presencial' o 'virtual'.",
        })
})
    .unknown(false)
    .messages({
        "object.unknown": "No se permiten campos adicionales",
    });

export const updateMeetingValidation = Joi.object({
    lugar: Joi.string().max(30).messages({
        "string.max": "El lugar no puede exceder los 30 caracteres.",
    }),
    fecha: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .messages({
            "string.pattern.base": "La fecha debe tener el formato AAAA-MM-DD.",
        }),
    hora: Joi.string()
        .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .messages({
            "string.pattern.base": "La hora debe tener el formato HH:mm.",
        }),
    modalidad: Joi.string().valid("presencial", "virtual").messages({
        "string.base": "La modalidad debe ser un texto.",
        "any.only": "La modalidad debe ser 'presencial' o 'virtual'.",
    }),
})
    .unknown(false)
    .messages({
        "object.unknown": "No se permiten campos adicionales",
    });

export const getMeetingByIdValidation = Joi.object({
  id: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": "El ID debe ser un número.",
      "any.required": "El ID es obligatorio.",
    }),
});
    