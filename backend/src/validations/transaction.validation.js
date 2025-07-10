"use strict";
import Joi from "joi";


export const createTransactionValidation = Joi.object({
  amount: Joi.number()
    .required()
    .min(1)
    .messages({
      "number.base": "El monto debe ser un número.",
      "number.min": "El monto debe ser mayor que 0.",
      "any.required": "El monto es obligatorio.",
      "number.empty": "El monto no puede estar vacío.",
    }),
    description: Joi.string()
    .min(1)
    .max(255)
    .required()
    .messages({
      "string.min": "La descripción debe tener al menos 1 carácter.",
      "string.max": "La descripción no puede exceder los 255 caracteres.",
      "string.base": "La descripción debe ser un texto.",
      "any.required": "La descripción es obligatoria.",
      "string.empty": "La descripción no puede estar vacía.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten campos adicionales",
  });


export const updateTransactionValidation = Joi.object({
  amount: Joi.number()
    .optional()
    .min(1)
    .messages({
      "number.base": "El monto debe ser un número.",
      "number.min": "El monto debe ser mayor que 0.",
      "number.empty": "El monto no puede estar vacío.",
    }),
  description: Joi.string()
    .min(1)
    .max(255)
    .optional()
    .messages({
      "string.min": "La descripción debe tener al menos 1 carácter.",
      "string.max": "La descripción no puede exceder los 255 caracteres.",
      "string.base": "La descripción debe ser un texto.",
      "string.empty": "La descripción no puede estar vacía.",
    }),
    state: Joi.string()
    .valid("pending", "completed", "rejected")
    .required()
    .messages({
        "any.only": "El estado debe ser uno de los siguientes: pending, completed, rejected.",
        "string.base": "El estado debe ser un texto.",
        "any.required": "El estado es obligatorio.",
        "string.empty": "El estado no puede estar vacío.",
        }),
})

  .unknown(false)
  .messages({
    "object.unknown": "No se permiten campos adicionales",
  });


export const transactionIdParamValidation = Joi.object({
  id: Joi.number()
    .required()
    .min(1)
    .messages({
      "number.min": "El ID debe ser mayor que 0.",  
      "number.base": "El ID debe ser un número.",
    }),
})
    .unknown(false)
    .messages({
        "object.unknown": "No se permiten propiedades adicionales.",
        "object.missing": "Debes proporcionar al menos el parametro id"
  });


