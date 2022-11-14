/* eslint-disable prettier/prettier */
//const { NextFunction, Request, Response } = require('express');
const dotenv = require('dotenv');
const AppError = require('../services/errorHandlers/errors');
const { StatusCodes } = require('http-status-codes');

dotenv.config();


const sendErrorDev = (err, res) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    status: err.statusCode,
    message:err.message,
    error: err,
    stack: err.stack,
    name: err.name,
  });
};

const sendErrorProd = (err, res) => {
  const statusCode = err.statusCode || 500;
  if (err.isOperational) {
    res.status(statusCode).json({
      success: false,
      message: err.message,
      // stack: err.stack,
      // name: err.name,
      // operation: err.isOperational,
    });
    };
};

const errorController = (err, req, res, next) => {
    err.statusCode = err.statusCode || 400;
  err.status = err.status || 'error';
  if (process.env.ENV === 'dev') {
    sendErrorDev(err, res);
  }
  if (process.env.ENV === 'prod') {
    sendErrorProd(err, res);
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const error = { ...err };
    if (error.name === 'ExpiredCodeException') {
      const {message} = error;
      const status = error.statusCode || 401;

      return res.status(status).json({
        success: false,
        message,
      });
    }
    if (error.name === 'Error') {
      res.status(error.status || 401);
      return res.json({
        success: false,
        message: error.message,
      });
    }
    if (error.name === 'NotAuthorizedException') {
      const status = error.statusCode || 401;
      return res.status(status).json({
        success: false,
        error: error.message,
      });
    }
    if (error.name === 'TokenExpiredError') {
      const status = error.statusCode || 401;
      return res.status(status).json({
        success: false,
        error: error.message,
      });
    };

    // if (err.stack.includes("ValidationError")=== true) {
    //   const message = err.message.split(":")[0];
    //   return next(new AppError(`Validation Error : ${message}`,StatusCodes.BAD_REQUEST))
    // }
  } else {
    return res.status(err.statusCode || 400).json({
      success: false,
      error: err.message,
      message: 'Something went wrong, please contact Admin',
    });
  }
};

 module.exports = errorController;
