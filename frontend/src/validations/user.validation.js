'use strict';

import Joi from 'joi';

//* FUNCIÓN PARA VALIDAR ESTRUCTURA DEL EMAIL
const validateEmailStructure = (value, helpers) => {
  const [localPart] = value.split('@');

//* LOCAL
  if (
    localPart.startsWith('.') ||
    localPart.endsWith('.') ||
    localPart.includes('..')
  ) {
    return helpers.message(
      'La parte antes del @ no puede comenzar o terminar con punto, ni tener puntos seguidos.'
    );
  }

//* DOMINIO
  if (!value.endsWith('@gmail.com') && !value.endsWith('@gmail.cl')) {
    return helpers.message(
      'Solo se permiten correos que terminen en @gmail.com o @gmail.cl.'
    );
  }

  return value;
};

export const updateUserByIdValidation = Joi.object({
  fullName: Joi.string()
    .min(10)
    .max(100)
    .required()
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/)
    .messages({
      'string.pattern.base':
        'En el nombre solo se permiten letras, espacios y tildes.',
      'string.min': 'El Nombre completo debe tener al menos 10 caracteres.',
      'string.max': 'El nombre completo no debe exceder los 100 caracteres.',
      'string.empty': 'El nombre es obligatorio',
    }),
  email: Joi.string()
    .email({ tlds: false })
    .required()
    .min(15)
    .max(50)
    .custom(validateEmailStructure, 'Validación personalizada')
    .messages({
      'string.email': 'Ingresa un correo electrónico válido.',
      'string.min': 'El correo electrónico debe tener al menos 15 caracteres.',
      'string.max':
        'El correo electrónico no puede tener más de 50 caracteres.',
      'string.empty': 'El correo electrónico es obligatorio.',
      'any.required': 'El correo electrónico es obligatorio.',
    }),
  contact: Joi.string()
    .pattern(/^\d{8}$/)
    .required()
    .messages({
      'string.pattern.base':
        'El contacto debe contener exactamente 8 dígitos numéricos.',
      'string.empty': 'El contacto es obligatorio.',
      'any.required': 'El contacto es obligatorio.',
      'string.base': 'Solo se permiten números en el contacto.',
    }),
  homeAddress: Joi.string()
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s#.,\-º]+$/)
    .min(10)
    .max(100)
    .required()
    .messages({
      'string.empty': 'La dirección es obligatoria.',
      'any.required': 'La dirección es obligatoria.',
      'string.min': 'La dirección debe tener al menos 10 caracteres.',
      'string.max': 'La dirección no puede exceder los 100 caracteres.',
      'string.pattern.base': 'La dirección contiene caracteres inválidos.',
    }),
})
  .unknown(false)
  .messages({
    'object.unknown': 'No se permiten campos adicionales.',
  });
