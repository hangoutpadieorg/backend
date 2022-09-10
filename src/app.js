const express = require('express');
const dotEnv = require('dotenv');
require('express-async-errors');
const errorHandlerMiddleWare = require('./api/middlewares/errorHandler');
const notFound = require('./api/middlewares/notFound');

const authRouter = require('./api/routes/auth');

// Application instance should be below the above require statements
const app = express();

app.use(express.json());

// Application routes are going to be here
app.use('/api/v1/auth', authRouter);

app.use(notFound);
app.use(errorHandlerMiddleWare);

module.exports = app;
