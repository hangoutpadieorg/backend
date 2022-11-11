const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../services/errorHandlers/errors');
const { StatusCodes } = require('http-status-codes');
const dotenv = require('dotenv');
const { UserDbQuery } = require('../repository/userRepository');


dotenv.config()
const { SecretKey } = process.env;
const userDbQuery = new UserDbQuery()
const isAuthenticated = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        const token = (authorization || "").split(" ")[1];
        if (token == null) return next(new AppError("Authorization token can not be empty",StatusCodes.NOT_ACCEPTABLE)) 
        const decode= jwt.verify(token, SecretKey)
        const user= await userDbQuery.findOneUser(decode.email)
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(new AppError("Unauthenticated! Expired Token", StatusCodes.UNAUTHORIZED))
        };
        return next(new AppError(`Unable to Authenticate user with error: ${error}`, StatusCodes.SERVICE_UNAVAILABLE));
    }
}

const isAuthorized = async(req, res, next) => {
    try {
        const user = req.user;
        const token= req.token
        if (user.tokens.newToken !== token) {
            if (user.tokens.newToken === false) {
                return next(new AppError("Invalid Token, Please login", StatusCodes.UNAUTHORIZED))
            }
            return next(new AppError("Unauthorized Access, Please login", StatusCodes.UNAUTHORIZED))
        }
        next();
        //await userDbQuery.findOneUser(user.email)
    } catch (error) {
        return next(new AppError(`Unable to Authenticate user with error: ${error}`, StatusCodes.SERVICE_UNAVAILABLE));
    }
}

module.exports = {isAuthenticated,isAuthorized}