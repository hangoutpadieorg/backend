const dotEnv = require('dotenv');

dotEnv.config({ path: `${__dirname}/src/config/.env` });

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});

module.exports = server;
