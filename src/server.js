const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const swaggerDoc = require('swagger-ui-express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const  AppError = require('./services/errorHandlers/errors');
const errorController = require('./middleware/errorHandler');
const catchAsync = require('./services/errorHandlers/catchAsync');
const connect = require('mongoose');
const users = require('../src/routes/users');
const swaggerDocumentation= require('./documentation/swagger-doc')


dotenv.config();
mongoose.set('debug', true);
mongoose.Promise = global.Promise;

const dbUrl = String(process.env.DB_URL);
const PORT = process.env.PORT || 5000;
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use("/documentations", swaggerDoc.serve);
app.use("/documentations", swaggerDoc.setup(swaggerDocumentation));


app.use('/api', users);

app.get('/hangoutPadie', async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message:
        `welcome to HangoutPadie api, our sweat documentation is on this url endpoint : http://localhost:${PORT}/documentations `,
      note: 'should you need any assistance kindly contact our surport ',
    });
  } catch (err) {
    return new AppError(`something when wrong here is the error: ${err}!`, 404);
  }
});

app.all('*', ( req, res, next) => {
 
    next(new AppError(`Requested URL ${req.path} not found!, `, 404));
});

app.use(errorController);

app.listen(PORT, async () => {
  async function run() {
    try {
      await mongoose.connect(dbUrl);
      console.log(`Successfully connected to database ${dbUrl}`);
      console.log(
        `Server started successfulyy on PORT https://localhost:${PORT}`
      );
    } catch (error) {
      console.log(`Trouble connecting to Database with error: ${error}`);
    }
  }
  run().catch(console.dir);
});
module.exports = app;
