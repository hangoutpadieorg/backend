const { StatusCodes } = require('http-status-codes');
const User = require('../models/userModel');
const { Validator } = require('../Validator/userValidator');
const { UserDbQuery } = require('../repository/userRepository');
const AppError = require('../services/errorHandlers/errors');
const dotenv = require('dotenv');
const { Utilities } = require('../services/util');
const { SendMail } = require('../mailer/sendMail');
//const {SendMail} = require('../mailer/mailchimpMailer')
const bcrypt = require('bcrypt');

dotenv.config();
const { FRO, TOKEN_EXPIRATION } = process.env;

const validator = new Validator();
const userDbQuery = new UserDbQuery();
const Utility = new Utilities();
const sendMail = new SendMail();
const otp = Utility.code();

const signUp = async (req, res, next) => {
  try {
    const validationResult = await validator.registrationSchema.validateAsync(
      req.body
    );
  
    const foundUser = await userDbQuery.findOneUser(validationResult.email);
    
    if (foundUser) {
      return next(
        new AppError(
          'A user with this email already exists, please choose another email',
          StatusCodes.CONFLICT
        )
      );
    }
   
    const password = Utility.generateHash(validationResult.password);
    const code = Utility.code();
    let role = validationResult.role;
    const userObject = {
      name: validationResult.name,
      email: validationResult.email,
      // phoneNumber: validationResult.phoneNumber,
      // gender: validationResult.gender,
      verificationCode: code,
      password,
      role,
    };
    await userDbQuery.creatOneUser(userObject);
    const htmls = [
      `<p>Welcome to Hangoutpadie ${validationResult.name}</p>`,
      `<p>To activate your account use this code ${code}`,
    ];

    const texts = htmls.map(Utility.convertEmail());
    let subject = 'Hangoutpadie Registration';
    const mailOptions = {
      from: FRO,
      to: validationResult.email,
      text: `Hello ${validationResult.name}`,

      subject: `${subject}`,
      html: texts.join('  \n'),
    };
    sendMail.send(mailOptions);

    const message = `${role === 'user' ? 'User' : 'Vendor'} created`;
    return res.status(StatusCodes.CREATED).json({ message, User });
  } catch (err) {
    if (err.stack.includes("ValidationError")=== true) {
      const message = err.message.split(":")[0];
      return next(new AppError(`Validation Error : ${message}`,StatusCodes.BAD_REQUEST))
    }
    return next(
      new AppError(`Unable to register user with error: ${err}`, 404)
    );
  }
};

const signIn = async (req, res, next) => {
  try {
    const validationResult = await validator.signInSchema.validateAsync(
      req.body
    );
    const foundUser = await userDbQuery.findOneUser(validationResult.email);
    if (!foundUser) {
      return next(
        new AppError(
          'There is no user found with this email',
          StatusCodes.NOT_FOUND
        )
      );
    }
    const hashedPassword = Utility.generateHash(validationResult.password);
    if (hashedPassword != foundUser.password) {
      return next(
        new AppError('Password is not correct', StatusCodes.NOT_ACCEPTABLE)
      );
    }
    const checkisActive = await validator.isActive(validationResult.email);
    if (checkisActive === 'isNotVerified') {
      return next(
        new AppError(
          'User account is not active, Kindly activate account',
          StatusCodes.BAD_REQUEST
        )
      );
    }
    const token = await Utility.generateAccessToken(validationResult.email);

    await userDbQuery.updateUserToken(foundUser.email, token);
    return res
      .status(StatusCodes.OK)
      .json({ token, expiresIn: TOKEN_EXPIRATION });
  } catch (err) {
    if (err.stack.includes("ValidationError")=== true) {
      const message = err.message.split(":")[0];
      return next(new AppError(`Validation Error : ${message}`,StatusCodes.BAD_REQUEST))
    }
    return next(new AppError(`Unable to signIn user with error: ${err}`, 404));
  }
};

const activateAccount = async (req, res, next) => {
  try {
    const validationResult = await validator.codeSchema.validateAsync(req.body);
    const foundUser = await userDbQuery.findUserByCode(validationResult.OTP);
    if (foundUser === 'isNotValid') {
      return next(new AppError('Invalid OTP', StatusCodes.NOT_ACCEPTABLE));
    }
    if (foundUser.active != false) {
      return next(new AppError('Email already verified', StatusCodes.CONFLICT));
    }
    await userDbQuery.updateIsEmailVerifiedToTrue(validationResult.OTP);
    const htmls = [
      ` <p>Welcome to Hangoutpadie ${foundUser.name} </p>`,
      '<h3>Message  </h3>',
      '<p>Welcome to Hangoutpadie , your account have been activated</p>',
    ];
    const texts = htmls.map(Utility.convertEmail());
    const mailOptions = {
      from: FRO,
      to: foundUser.email,
      text: `Hello ${foundUser.name}, Activation Notice`,

      subject: 'Account Activated',
      html: texts.join(' \n'),
    };
    sendMail.send(mailOptions);
    return res.status(StatusCodes.ACCEPTED).json({
      message: 'Email verification success',
      success: true,
    });
  } catch (err) {
    if (err.stack.includes("ValidationError")=== true) {
      const message = err.message.split(":")[0];
      return next(new AppError(`Validation Error : ${message}`,StatusCodes.BAD_REQUEST))
    }
    return next(
      new AppError(`Unable to activate user with error: ${err}`, 404)
    );
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const validationResult = await validator.forgotPasswordSchema.validateAsync(
      req.body
    );
    const user = await userDbQuery.findOneUser(validationResult.email);
    if (!user)
      return next(
        new AppError('No user found with this email', StatusCodes.NOT_FOUND)
      );
    await userDbQuery.updateVerificationCode(user.email, otp);

    const htmls = [
      ` <p>Welcome to Hangoutpadie ${user.name}. \n 
            `,
      `To reset your password use this code ${otp}.  \n `,
      `You have requested for your password to be reset. Please  input the code above to reset your password.  \n
            `,
      `<br/>If you didn’t make this request or you experienced any issues,please email us: Hangoutpadie2021@gmail.com
            </p>`,
    ];
    const texts = htmls.map(Utility.convertEmail());
    const mailOptions = {
      from: FRO,
      to: user.email,
      text: `Hello ${user.name}, Reset code Notice`,

      subject: 'Reset Password',
      html: texts.join('  <br/>'),
    };
    sendMail.send(mailOptions);
    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'Please check your email.' });
  } catch (error) {
    const message = error.message.split(':')[0];
    if (error.name === 'ValidationError')
      return next(
        new AppError(`Validation Error : ${message}`, StatusCodes.BAD_REQUEST)
      );
    return next(
      new AppError(
        `Unable to signIn user with error: ${error}`,
        StatusCodes.SERVICE_UNAVAILABLE
      )
    );
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const validationResult = await validator.resetPasswordSchema.validateAsync(
      req.body
    );
    const verifyOtp = await userDbQuery.findUserByCode(validationResult.OTP);
    if (verifyOtp === 'isNotValid')
      return next(new AppError('Invalid OTP', StatusCodes.NOT_ACCEPTABLE));
    const hashedPassword = Utility.generateHash(validationResult.password);
    if(verifyOtp.password===hashedPassword)return next(new AppError("Password already set", StatusCodes.CONFLICT))
     await userDbQuery.updateUserPassword(
      verifyOtp.email,
      hashedPassword
    );
    return res
      .status(StatusCodes.ACCEPTED)
      .json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    if (error.stack.includes("ValidationError")=== true) {
      const message = error.message.split(":")[0];
      return next(new AppError(`Validation Error : ${message}`,StatusCodes.BAD_REQUEST))
    }
    return next(
      new AppError(
        `Unable to signIn user with error: ${error}`,
        StatusCodes.SERVICE_UNAVAILABLE
      )
    );
  }
};

const changePassword = async (req, res, next) => {
  try {
    const validationResult = await validator.changePasswordSchema.validateAsync(
      req.body
    );
    const user = req.user;
    const hashedPassword = Utility.generateHash(validationResult.password);
    if (user.password === hashedPassword)
      return next(
        new AppError(
          "New password and old password can't be same",
          StatusCodes.CONFLICT
        )
      );
    const updateUserPassword = await userDbQuery.updateUserPassword(
      user.email,
      hashedPassword
    );
    const htmls = [
      ` <p>Welcome to Hangoutpadie ${user.name}. \n 
            `,
      `Password reset notification  \n `,
      `Your password was recently change at ${Date.now()}  \n
            `,
      `<br/>If you didn’t make this request or you experienced any issues,please email us: Hangoutpadie2021@gmail.com
            </p>`,
    ];
    const texts = htmls.map(Utility.convertEmail());
    const mailOptions = {
      from: FRO,
      to: user.email,
      text: `Hello ${user.name}, Password Reset `,

      subject: 'Password Notification',
      html: texts.join('  <br/>'),
    };
    sendMail.send(mailOptions);
    return res
      .status(StatusCodes.ACCEPTED)
      .json({ success: true, message: 'Password successfully updated' });
  } catch (error) {
    if (error.stack.includes("ValidationError")=== true) {
      const message = error.message.split(":")[0];
      return next(new AppError(`Validation Error : ${message}`,StatusCodes.BAD_REQUEST))
    }
    return next(
      new AppError(
        `Unable to signIn user with error:  ${error}`,
        StatusCodes.SERVICE_UNAVAILABLE
      )
    );
  }
};

const signOut = async (req, res, next) => {
  try {
    const token = req.token;
    const user = req.user;
    const newTokens = user.tokens.newToken !== token;
    await userDbQuery.updateUserToken(user.email, newTokens);
    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'Sign out successfully' });
  } catch (error) {
    return next(
      new AppError(
        `Unable to signIn user with error: ${error}`,
        StatusCodes.SERVICE_UNAVAILABLE
      )
    );
  }
};

const mailtest = async (req, res, next) => {
  try {

    const mailOptions = {
      from: FRO,
      to: 'samlaja1292@gmail.com',
      text: `Hello `,

      subject: `subject Test`,
      html: 'testing mail',
    };
    const mail = await sendMail.send(mailOptions)
    console.log(mail)
    // if (!mail) {
    //   return res.status(StatusCodes.EXPECTATION_FAILED).json({
    //     succes: false,
    //     data: "failed"
    //   })
    // }
    //const mail =await sendMail.mail({name:'my template'})
    //const mail =await sendMail.senders()
    return res.status(StatusCodes.OK).json({
      success: true,
      mail
    })
  } catch (error) {
    return next(new AppError(`failed to send mail with error: ${error}`, StatusCodes.EXPECTATION_FAILED))
  }
};
module.exports = {
  signUp,
  signIn,
  activateAccount,
  signOut,
  forgotPassword,
  resetPassword,
  changePassword,
  mailtest
};
