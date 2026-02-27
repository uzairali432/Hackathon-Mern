import Joi from 'joi';

export const userValidators = {
  updateProfile: Joi.object({
    firstName: Joi.string().min(2).max(50),
    lastName: Joi.string().min(2).max(50),
    bio: Joi.string().max(500).allow(''),
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
      'any.only': 'Passwords do not match',
    }),
  }),

  updateRole: Joi.object({
    userId: Joi.string().required(),
    role: Joi.string().valid('user', 'admin').required(),
  }),
};
