const Joi = require('joi');
const { HangoutCenter } = require('../repository/hangoutCenterRepository.js');
const AppError = require('../services/errorHandlers/errors');
const { StatusCodes } = require('http-status-codes');

const hangoutcenter = new HangoutCenter();

class Validator{
    registrationSchema = Joi.object({
         name: Joi.string().required().min(3),
        email: Joi.string().email().required(),
        phoneNumber: Joi.string().required().min(11),
        category: Joi.string().required().valid('bar', 'lounge', 'cafe', 'restorant', 'cinemas', 'beach', 'gallery', 'tourist-center', 'park, gardens & reserves'),
        openHours: Joi.string(),
        gateEntryFee:Joi.string() ,
        bookingCategory: Joi.string().required().valid('regular', 'vip', 'vvip'),
        address:Joi.string() ,
        description:Joi.string()
    });
    getOneCenterByMailSchema = Joi.object({
        email: Joi.string().email().required(),
    })
    getOneCenterByNameSchema = Joi.object({
        name: Joi.string().required().min(3),
    })
    getOneCenterByPhoneNumberSchema = Joi.object({
        phoneNumber: Joi.string().required().min(11),
    })
    getOneCenterByBookingCategorySchema = Joi.object({
        bookingCategory: Joi.string().required().valid('regular', 'vip', 'vvip')
    })
    getOneCenterByCategorySchema = Joi.object({
        category: Joi.string().required().valid('bar', 'lounge', 'cafe', 'restorant', 'cinemas', 'beach', 'gallery', 'tourist-center', 'park, gardens & reserves')
    })
};



const ErrorHandler = {
    ValidatorError(error, next) {
            const message = error.message.split(":")[0];
            return next(new AppError(`Validation Error : ${message}`,StatusCodes.BAD_REQUEST))
        
        return
    },
    GeneralError(error, next) {
        /**
         * Registration Error message
         */
        return next(
            new AppError(`Unable to register user with error: ${error}`, 404)
          );
    },
    GeneralQuerryError(error, next) {
        /**
         * Registration Error message
         */
        return next(
            new AppError(`Unable to get data  with error: ${error}`, 404)
          );
    }
}

module.exports = {
    Validator,
    ErrorHandler
  };