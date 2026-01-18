const Joi = require("joi");

const createAuthUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(25).required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Passwords do not match"
    }),
});

module.exports = data => 
  createAuthUserSchema.validate(data, {
    abortEarly: false, 
    allowUnknown: false 
  })