const Joi = require('joi');
const { UserDbQuery } = require('../repository/userRepository');

const userDbQuery = new UserDbQuery();
class Validator {
  registrationSchema = Joi.object({
    name: Joi.string().required().min(3),
    email: Joi.string().email().required(),
    password: Joi.string()
      .required()
      .min(8),
      //.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    confirmPassword: Joi.ref('password'),
    role: Joi.string().required().valid('vendor', 'user'),
    //phoneNumber: Joi.number().required().min(11),
    //gender: Joi.string().required().valid('male', 'female')
  });
  signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  codeSchema = Joi.object({
    OTP: Joi.number().required().min(6),
  });

  async isActive(email) {
    const user = await userDbQuery.findOneUser(email);
    if (user.active === false) {
      const invalid = 'isNotVerified';
      return invalid;
    } else {
      const valid = 'isverified';
      return valid;
    }
  }
  forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
  });
  resetPasswordSchema = Joi.object().keys({
    OTP: Joi.number().required().min(6),
    password: Joi.string()
      .required()
      .min(8),
      //.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    confirmPassword: Joi.ref('password'),
  });
  changePasswordSchema = Joi.object({
    password: Joi.string()
      .required()
      .min(8),
      //.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    confirmPassword: Joi.ref('password'),
  });
}

module.exports = {
  Validator,
};
