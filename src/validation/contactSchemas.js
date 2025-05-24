import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Name must be a string.',
    'string.min': 'Name should have a minimum length of {#limit} characters.',
    'string.max': 'Name should have a maximum length of {#limit} characters.',
    'any.required': 'Name is a required field.',
  }),
  phoneNumber: Joi.string()
    .min(3)
    .max(20)
    .pattern(/^\+?\d{9,15}$/)
    .required()
    .messages({
      'string.base': 'Phone number must be a string.',
      'string.pattern.base':
        'Phone number is invalid. Please use a format like +XXXXXXXXXXXX or XXXXXXXXXX.',
      'any.required': 'Phone number is a required field.',
    }),
  email: Joi.string().min(3).max(20).email().optional().messages({
    'string.base': 'Email must be a string.',
    'string.email': 'Email must be a valid email address.',
  }),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .default('personal')
    .messages({
      'string.base': 'Contact type must be a string.',
      'any.only': 'Contact type must be "personal", "work", or "home".',
      'any.required': 'Contact type is a required field.',
    }),
  isFavourite: Joi.boolean().default(false).messages({
    'boolean.base': 'The "isFavourite" field must be a boolean (true/false).',
  }),
})
  .min(1)
  .messages({
    'object.min':
      'Request body cannot be empty for an update. Please provide at least one field to update.',
  });

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string()
    .min(3)
    .max(20)
    .pattern(/^[0-9]{10}$/),
  email: Joi.string().min(3).max(20).email(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
  isFavourite: Joi.boolean(),
}).min(1);
