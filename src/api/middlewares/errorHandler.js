const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong, please try again later.',
  };

  // This handles the error thrown by the Joi Validator
  if (err.isJoi) {
    customError.statusCode = 400;
  }

  // This handles the unique values constraint in email field
  if (err.code && err.code === 11000) {
    customError.statusCode = 400;
    customError.message = `Duplicate value entered for the ${Object.keys(
      err.keyValue
    )} field`;
  }

  return res
    .status(customError.statusCode)
    .json({ message: customError.message });
};

module.exports = errorHandlerMiddleware;
