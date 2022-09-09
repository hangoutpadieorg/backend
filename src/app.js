const express = require('express');
const dotEnv = require('dotenv');
require('express-async-errors');
const errorHandlerMiddleWare = require('./api/middlewares/errorHandler');
const notFound = require('./api/middlewares/notFound');

// Application instance should be below the above require statements
const app = express();

// Application routes are going to be here

// app.use(notFound)
// app.use(errorHandlerMiddleWare)

module.exports = app;
