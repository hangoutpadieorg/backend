const crypto = require('crypto');
const Jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { compile } = require('html-to-text');
const { UserDbQuery } = require('../repository/userRepository');

dotenv.config();
const { FRO, TOKEN_EXPIRATION, SecretKey } = process.env;
const userDbQuery = new UserDbQuery();
class Utilities {
  code() {
    return crypto.randomInt(100000, 1000000);
  }
  convertEmail() {
    const convert = compile({
      wordwrap: 130,
    });
    return convert;
  }
  generateHash(email) {
    const SecretKey = String(process.env.SecretKey);
    let hashKey = crypto
      .createHmac('SHA256', SecretKey)
      .update(email)
      .digest('base64')
      .toString();
    return hashKey;
  }
  async generateAccessToken(user) {
    const jwsToken = String(process.env.SecretKey);
    const payload = await userDbQuery.findOneUser(user);
    let data = {
      user_id: payload._id,
      role: payload.role,
      email: payload.email,
      name: payload.firstName + ' ' + payload.lastName,
    };
    return Jwt.sign(data, SecretKey, { expiresIn: TOKEN_EXPIRATION });
  }
}

module.exports = { Utilities };
