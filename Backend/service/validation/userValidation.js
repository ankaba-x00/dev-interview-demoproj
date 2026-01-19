const Joi = require('joi');

const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  location: Joi.string().min(2).max(100).required(),
  isActive: Joi.boolean(),
  isBlocked: Joi.boolean(),
});

const updateUserSchema = createUserSchema.fork(
  ['name', 'email', 'location'],
  field => field.optional(),
);

module.exports = {
  validateCreateUser: data => createUserSchema.validate(data, { abortEarly: false, allowUnknown: false }),
  validateUpdateUser: data => updateUserSchema.validate(data, { abortEarly: false, allowUnknown: false }),
};