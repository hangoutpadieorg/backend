const Joi = require('joi');
const { HangoutCenter } = require('../repository/hangoutCenterRepository.js');
const AppError = require('../services/errorHandlers/errors');
const { StatusCodes } = require('http-status-codes');

const hangoutcenter = new HangoutCenter();

class Validator{
    registrationSchema = Joi.object({
        // name: Joi.string().required().min(3),
        // email: Joi.string().email().required(),
        // phoneNumber: Joi.string().required().min(11),
        // categories: Joi.string().required().valid('bar', 'lounge', 'cafe', 'restorant', 'cinemas',  'beach', 'gallery','tourist-center','park, gardens & reserves'),
        


        //   //.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        // confirmPassword: Joi.ref('password'),
        // role: Joi.string().required().valid('vendor', 'user'),
        // //phoneNumber: Joi.number().required().min(11)    ,
        // //gender: Joi.string().required().valid('male', 'female')
      });
};

const ErrorHandler = {
    ValidatorError(error,  next) {
            const message = error.message.split(":")[0];
            return next(new AppError(`Validation Error : ${message}`,StatusCodes.BAD_REQUEST))
        
        return
    },
    GeneralError(error, next) {
        return next(
            new AppError(`Unable to register user with error: ${error}`, 404)
          );
    }
}

module.exports = {
    Validator,
    ErrorHandler
  };