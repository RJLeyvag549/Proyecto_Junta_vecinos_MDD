"use strict";

import Joi from "joi";

//* FUNCIÓN PARA VALIDAR ESTRUCTURA DEL EMAIL
const validateEmailStructure = (value, helpers) => {

  //* PRIMERO LA PARTE LOCAL (ANTES DEL @)
  const [localPart] = value.split("@");

  if (
    localPart.startsWith(".") ||
    localPart.endsWith(".") ||
    localPart.includes("..")
  ) {
    return helpers.message(
      "El correo electrónico tiene un formato incorrecto en la parte local."
    );
  }

  //* DOMINIO
  if (!value.endsWith("@gmail.com") && !value.endsWith("@gmail.cl")) {
    return helpers.message(
      "El correo electrónico debe finalizar en @gmail.com o @gmail.cl."
    );
  }

  return value;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//* VALIDACIÓN DE REGISTRO DE USUARIO
export const registerValidation = Joi.object({
  fullName: Joi.string()
    .min(10)
    .max(100)
    .required()
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/)
    .messages({
      "string.pattern.base": "Solo se permiten letras, espacios y tildes.",
      "string.min": "El Nombre completo debe tener al menos 5 caracteres.",
      "string.max": "El nombre completo no debe exceder los 100 caracteres.",
      "string.empty": "Este campo es obligatorio.",
    }),
  rut: Joi.string()
    .required()
    .pattern(/^\d{2}\.\d{3}\.\d{3}-[\dkK]$/)
    .messages({
      "string.empty": "Este campo es obligatorio.",
      "string.base": "El rut debe ser de tipo string.",
      "string.pattern.base": "Formato de RUT inválido. Debe tener el formato XX.XXX.XXX-X.",
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } }) // esto ya valida el formato general
    .min(15)
    .max(50)
    .required()
    .custom(validateEmailStructure)
    .messages({
      "string.email": "El correo electrónico no tiene un formato válido.",
      "string.min": "El correo electrónico debe tener al menos 15 caracteres.",
      "string.max": "El correo electrónico no puede exceder los 50 caracteres.",
      "string.empty": "Este campo es obligatorio.",
  }),
  password: Joi.string()
    .min(8)
    .max(26)
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .messages({
      "string.empty": "Este campo es obligatorio.",
      "any.required": "La contraseña es obligatoria.",
      "string.pattern.base": "Debe incluir una letra mayúscula, una minúscula, un número y un carácter especial (por ejemplo: @, #, $, etc.).",
      "string.min": "La contraseña debe tener al menos 8 caracteres.",
      "string.max": "La contraseña debe tener como máximo 26 caracteres.",
    }),
  contact: Joi.string()
  .pattern(/^\d{8}$/)
  .required()
  .messages({
    "string.pattern.base": "El contacto debe contener exactamente 8 dígitos numéricos.",
    "string.empty": "Este campo es obligatorio.",
    "any.required": "El contacto es obligatorio.",
  }),
  homeAddress: Joi.string()
  .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\#\.\,\-º]+$/)
  .min(10)
  .max(100)
  .required()
  .messages({
    "string.empty": "Este campo es obligatorio.",
    "any.required": "La dirección es obligatoria.",
    "string.min": "La dirección debe tener al menos 10 caracteres.",
    "string.max": "La dirección no puede exceder los 100 caracteres.",
    "string.pattern.base": "La dirección contiene caracteres inválidos.",
  }),
}) //*REVISAR ESTO DESPUÉS
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten campos adicionales",
  });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //* VALIDACIÓN DE ARCHIVOS SUBIDOS (CÉDULA Y RESIDENCIA)
  export function validateUploadedFiles(files) {
  if (!files?.docIdentity || !files?.docResidence) {
    return "Los documentos de cédula y residencia son obligatorios.";
  }
  return null; 
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//* VALIDACIÓN INICIO DE SESIÓN
export const loginValidation = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "El correo electrónico debe ser válido.",
      "string.empty": "El correo electrónico es obligatorio.",
      "any.required": "El correo electrónico es obligatorio.",
    })
    .custom(
      validateEmailStructure,
      "Validación de dominio de correo electrónico"
    ),
  password: Joi.string().min(8).max(26).required().messages({
      "string.empty": "La contraseña es obligatoria.",
      "any.required": "La contraseña es obligatoria.",
      "string.min": "La contraseña debe tener al menos 8 caracteres.",
      "string.max": "La contraseña debe tener como máximo 26 caracteres.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten campos adicionales",
  });
