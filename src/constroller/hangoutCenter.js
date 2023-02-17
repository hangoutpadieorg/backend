const { StatusCodes } = require('http-status-codes');
const User = require('../models/userModel');
const {
  Validator,
  ErrorHandler,
} = require('../Validator/hangoutcenterValidator');
const { UserDbQuery } = require('../repository/userRepository');
const { HangoutCenter } = require('../repository/hangoutCenterRepository');
const AppError = require('../services/errorHandlers/errors');
const dotenv = require('dotenv');
const { Utilities } = require('../services/util');
const { SendMail } = require('../mailer/sendMail');


dotenv.config();

const validator = new Validator();
const userDbQuery = new UserDbQuery();
const Utility = new Utilities();
const hangoutcenter = new HangoutCenter();

class HangoutCenterController {
  async register(req, res, next) {
    try {
      const validationResult = await validator.registrationSchema.validateAsync(
        req.body
      );
      const validateHangoutcenterName =
        await hangoutcenter.findOneHangoutCenterByName(validationResult.name);
      const validateHangoutcenterEmail =
        await hangoutcenter.findOneHangoutCenterByMail(validationResult.email);
      const validateHangoutcenterPhoneNumber =
        await hangoutcenter.findOneHangoutCenterByPhoneNumber(
          validationResult.phoneNumber
        );

      if (
        validateHangoutcenterName.name == 'null' ||
        validateHangoutcenterName.name == validationResult.name
      ) {
        return next(
          new AppError(
            `A HangoutCenter with this name:${validationResult.name} already exists, please choose another name`,
            StatusCodes.CONFLICT
          )
        );
      }
      if (
        validateHangoutcenterEmail.email == validationResult.email ||
        validateHangoutcenterEmail.email == 'null'
      ) {
        return next(
          new AppError(
            `A HangoutCenter with this email:${validationResult.email} already exists, please choose another email`,
            StatusCodes.CONFLICT
          )
        );
      }
      if (
        validateHangoutcenterPhoneNumber.phoneNumber ==
          validationResult.phoneNumber ||
        validateHangoutcenterPhoneNumber.phoneNumber == 'null'
      ) {
        return next(
          new AppError(
            `A HangoutCenter with this phoneNumber:${validationResult.phoneNumber} already exists, please choose another phone number`,
            StatusCodes.CONFLICT
          )
        );
      }
      const filePath = Utility.getFilePath(req);
      const images = {
        image1: filePath.file1,
        image2: filePath.file2,
        image3: filePath.file3,
      };

      const create = {
        name: validationResult.name.toLowerCase(),
        openHours: validationResult.openHours,
        email: validationResult.email,
        address: validationResult.address,
        phoneNumber: validationResult.phoneNumber,
        description: validationResult.description,
        categories: validationResult.category,
        gateEntryFee: validationResult.gateEntryFee,
        bookingCategory: validationResult.bookingCategory,
        image: images,
      };

        const setup = await hangoutcenter.createOneCenter(create);
        if (!setup) {
            return next(
              new AppError(
                'Unable to register a new center',
                StatusCodes.EXPECTATION_FAILED
              )
            );
          }
      const htmls = [
        `<p>Welcome to Hangoutpadie Center Registration ${validationResult.name}</p>`,
        `<p>We are pleased to informed you that your center as been registered `,
      ];

      const texts = htmls.map(Utility.convertEmail());
      let subject = 'Hangoutpadie Center Registration';
      const mailOptions = {
        from: FRO,
        to: validationResult.email,
        text: `Hello ${validationResult.name}`,

        subject: `${subject}`,
        html: texts.join('  \n'),
      };
      sendMail.send(mailOptions);
      
      return res.status(StatusCodes.OK).json({
        success: true,
        data: setup,
      });
    } catch (error) {
      if (error.stack.includes('ValidationError') === true) {
        return ErrorHandler.ValidatorError(error, next);
      }
      return ErrorHandler.GeneralError(error, next);
    }
    }
    

    async getOneCenterByMail(req, res, next) {
       /**
         * To query  hangout center by email
         */
      try {
        const validationResult = await validator.getOneCenterByMailSchema.validateAsync(
            req.body
          );
      const data = await hangoutcenter.findOneHangoutCenterByMail(
        validationResult.email
      );
      
      if (!data || data == "null") {
        return next(
          new AppError('Unable to fetch data because the hangout center email does not exist', StatusCodes.EXPECTATION_FAILED)
        );
      }
      return res.status(StatusCodes.OK).json({
        success: true,
        data: data,
      });
    } catch (error) {
        if (error.stack.includes('ValidationError') === true) {
            return ErrorHandler.ValidatorError(error, next);
          }
          return ErrorHandler.GeneralQuerryError(error, next);
        }
    }
    

    async getAllHangoutCenters(req, res, next) {
       /**
         * To get all hangout center
         */
    try {
      const data = await hangoutcenter.findHangoutCenter();
      if (!data || data == null) {
        throw next(
          new AppError('Unable to fetch data', StatusCodes.EXPECTATION_FAILED)
        );
      }
      return res.status(StatusCodes.OK).json({
        success: true,
        data: data,
      });
    } catch (error) {
        if (error.stack.includes('ValidationError') === true) {
            return ErrorHandler.ValidatorError(error, next);
          }
          return ErrorHandler.GeneralQuerryError(error, next);
        }
    }


    async getCenterByName(req, res, next) {
        try {
             /**
         * To find  hangout center by name
         */
            const validationResult = await validator.getOneCenterByNameSchema.validateAsync(
                req.body
            );
            const data = await hangoutcenter.findOneHangoutCenterByName(validationResult.name.toLowerCase());
            if (!data || data == "null") {
                return  next(
                    new AppError(`Unable to fetch data because hangout center name does not exist`, StatusCodes.EXPECTATION_FAILED)
                  );
            }
            return res.status(StatusCodes.OK).json({
                success: true,
                data: data
            });
            
        } catch (error) {
            if (error.stack.includes('ValidationError') === true) {
                return ErrorHandler.ValidatorError(error, next);
              }
              return ErrorHandler.GeneralQuerryError(error, next);
            
        }
    }


    async getCenterByCategory(req, res, next) {
         /**
         * To find  hangout center by category
         */
        try {
            const validationResult = await validator.getOneCenterByCategorySchema.validateAsync(
                req.body
            );
            const data = await hangoutcenter.findOneHangoutCenterByCategory(validationResult.Category);
            if (!data || data == "null") {
                return  next(
                    new AppError(`Unable to fetch data because hangout center category does not exist`, StatusCodes.EXPECTATION_FAILED)
                  );
            }
          
            return res.status(StatusCodes.OK).json({
                success: true,
                data: data
            });

            
        } catch (error) {
            if (error.stack.includes('ValidationError') === true) {
                return ErrorHandler.ValidatorError(error, next);
              }
              return ErrorHandler.GeneralQuerryError(error, next);
            
        }
    }

    
    async getCenterByBookingCategory(req, res, next) {
         /**
         * To find  hangout center by booking category
         */
        try {
            const validationResult = await validator.getOneCenterByBookingCategorySchema.validateAsync(
                req.body
            );
            const data = await hangoutcenter.findOneHangoutCenterByBookingCategory(validationResult.bookingCategory);
            if (!data || data == "null") {
                return  next(
                    new AppError(`Unable to fetch data because hangout center booking category does not exist`, StatusCodes.EXPECTATION_FAILED)
                  );
            };
          
            return res.status(StatusCodes.OK).json({
                success: true,
                data: data
            });

            
        } catch (error) {
            if (error.stack.includes('ValidationError') === true) {
                return ErrorHandler.ValidatorError(error, next);
              }
              return ErrorHandler.GeneralQuerryError(error, next);
            
        }
    }

    async getCenterByPhoneNumber(req, res, next) {
        /**
        * To find  hangout center by booking category
        */
       try {
           const validationResult = await validator.getOneCenterByPhoneNumberSchema.validateAsync(
               req.body
           );
           const data = await hangoutcenter.findOneHangoutCenterByPhoneNumber(validationResult.phoneNumber);
           if (!data || data == "null") {
               return  next(
                   new AppError(`Unable to fetch data because hangout center phone number does not exist`, StatusCodes.EXPECTATION_FAILED)
                 );
           };
         
           return res.status(StatusCodes.OK).json({
               success: true,
               data: data
           });

           
       } catch (error) {
           if (error.stack.includes('ValidationError') === true) {
               return ErrorHandler.ValidatorError(error, next);
             };
             return ErrorHandler.GeneralQuerryError(error, next);
           
       }
   }

  async test(req, res, next) {
    const filePath = Utility.getFilePath(req);
    const { name, phoneNumber, address } = req.body;
    const images = {
      name,
      phoneNumber,
      address,
      image1: filePath.file1,
      image2: filePath.file2,
      //             image3: filePath.file3,
    };
    
  }
};

module.exports = { HangoutCenterController };
