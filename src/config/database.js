require('dotenv').config();
const mongoose = require('mongoose');

let DB;
if (process.env.NODE_ENV === 'development') {
  DB = process.env.DB_LOCAL;
} else if (process.env.NODE_ENV === 'production') {
  DB = process.env.DB_HOST;
}
mongoose
  .connect(DB, {})
  .then(() => {
    console.log('DB connection established');
  })
  .catch(() => {
    console.log('error connecting');
  });

module.exports = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
};
