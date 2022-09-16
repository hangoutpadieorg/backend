const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./CustomAPIError');

class Conflict extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
  }
}

module.exports = Conflict;
