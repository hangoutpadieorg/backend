const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./CustomAPIError');

class Unauthorized extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

module.exports = Unauthorized;
