const Joi = require('joi')

const userValidation = (data, all = true) => {
  const schema = Joi.object({
    //TODO
  })
  var errors = schema.validate(data, { abortEarly: false, allowUnknown: false })['error']
  return errors ? errors.details : errors
}

module.exports.userValidation = userValidation
