const { StatusCodes } = require('http-status-codes');
const User = require('../models/userModel');
const { Validator,ErrorHandler } = require('../Validator/hangoutcenterValidator');
const { UserDbQuery } = require('../repository/userRepository');
const { HangoutCenter } = require('../repository/hangoutCenterRepository');
const AppError = require('../services/errorHandlers/errors');
const dotenv = require('dotenv');
const { Utilities } = require('../services/util');
const { SendMail } = require('../mailer/sendMail');
const { registerDecorator } = require('handlebars');

dotenv.config();

const validator = new Validator();
const userDbQuery = new UserDbQuery();
const Utility = new Utilities();
const hangoutcenter = new HangoutCenter();

class HangoutCenterController{

    async register(req, res, next) {
        try {
            const { namee, phoneNumber, address } = req.body;
            console.log(namee,phoneNumber,address, req.body.namee,)
            const validationResult = await validator.registrationSchema.validateAsync(req.body);
            const filePath = Utility.getFilePath(req);
            const images = {
                image1: filePath.file1,
                image2: filePath.file2,
                image3: filePath.file3,
            };
        const create = {
            name:validationResult.name,
            openHours:validationResult.openHours,
            email: validationResult.email,
            address: validationResult.address,
            phoneNumber:validationResult.phoneNumber,
            description:validationResult.description,
            categories: validationResult.category,
            gateEntryFee:validationResult.gateEntryFee,
            bookingCategory:validationResult.bookingCategory,
            image:images,
        };
            console.log(create);
        // const setup = await hangoutcenter.createOneCenter(create)
        // console.log(setup)
        if (!create) {
            return next(new AppError('Unable to register a new center', StatusCodes.EXPECTATION_FAILED))
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            data:create
        })
        } catch (error) {
            if (error.stack.includes("ValidationError") === true) { 
                return   ErrorHandler.ValidatorError(error, next)
            }
            return ErrorHandler.GeneralError(error, next)
            
        }
    }
 

    async getOne(req, res, next) {
        try {
            const data = await hangoutcenter.findOneHangoutCenterByMail(req.body.email)
        console.log(data)
        if (!data || data==null) {
            throw next(new AppError('Unable to fetch data', StatusCodes.EXPECTATION_FAILED))
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            data:data
        })
        } catch (error) {
            return next(
                new AppError(`Unable to get data with error: ${error}`, 404)
              );
        }
    };
}

module.exports = {HangoutCenterController}