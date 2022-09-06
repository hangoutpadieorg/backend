require('express-async-errors')
const errorHandlerMiddleWare = require('./middlewares/errorHandler')
const notFound = require('./middlewares/notFound')

// Application instance should be below the above require statements

// Application routes are going to be here

// app.use(notFound)
// app.use(errorHandlerMiddleWare)