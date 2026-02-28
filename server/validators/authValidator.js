import Joi from 'joi';

const emailSchema = Joi.string()
  .email()
  .required()
  .messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  });

const passwordSchema = Joi.string()
  .min(6)
  .required()
  .messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  });

const nameSchema = Joi.string()
  .min(2)
  .max(50)
  .required()
  .messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 50 characters',
    'any.required': 'Name is required',
  });

export const authValidators = {
  signup: Joi.object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    role: Joi.string().valid('admin', 'doctor', 'receptionist', 'patient', 'user').optional(),
  }),

  login: Joi.object({
    email: emailSchema,
    password: passwordSchema,
  }),

  refreshToken: Joi.object({
    refreshToken: Joi.string().required().messages({
      'any.required': 'Refresh token is required',
    }),
  }),
};
