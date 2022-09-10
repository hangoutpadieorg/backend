const Joi = require('joi');

const registrationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8),
});

module.exports = {
  registrationSchema,
};
