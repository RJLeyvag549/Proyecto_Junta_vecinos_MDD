"use strict"
import Joi from "joi";

export const createTransactionValidation = Joi.object({
    amount: Joi.number()
        .required()
        .min(1)
        .max(100000000)
        .precision(2)
        .messages({
            "number.base": "El monto debe ser un número.",
            "number.min": "El monto mínimo es $1.",
            "number.max": "El monto máximo permitido es $100.000.000.",
            "number.precision": "El monto no puede tener más de 2 decimales.",
            "any.required": "El monto es obligatorio."
        }),
    description: Joi.string()
        .required()
        .min(5)
        .max(255)
        .messages({
            "string.base": "La descripción debe ser de tipo texto.",
            "any.required": "La descripción es obligatoria.",
            "string.min": "La descripción debe tener al menos 5 caracteres.",
            "string.max": "La descripción no puede exceder los 255 caracteres."
        }),
});

export const updateTransactionValidation = Joi.object({
    amount: Joi.number()
        .min(1)
        .max(100000000)
        .precision(2)
        .messages({
            "number.base": "El monto debe ser un número.",
            "number.min": "El monto mínimo es $1.",
            "number.max": "El monto máximo permitido es $100.000.000.",
            "number.precision": "El monto no puede tener más de 2 decimales."
        }),
    description: Joi.string()
        .min(5)
        .max(255)
        .messages({
            "string.base": "La descripción debe ser de tipo texto.",
            "string.min": "La descripción debe tener al menos 5 caracteres.",
            "string.max": "La descripción no puede exceder los 255 caracteres."
        }),
    status: Joi.string()
        .valid("pending", "completed", "rejected")
        .messages({
            "string.base": "El estado debe ser de tipo texto.",
            "any.only": "El estado debe ser uno de los siguientes: pending, completed, rejected."
        })
}).or("amount", "description", "status").messages({
    "object.missing": "Al menos uno de los campos (amount, description, status) debe ser proporcionado para actualizar."
});
