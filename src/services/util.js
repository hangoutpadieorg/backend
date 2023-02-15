const crypto = require('crypto');
const Jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { compile } = require('html-to-text');
const { UserDbQuery } = require('../repository/userRepository');
const multer = require('multer');
const path = require('path')
const {Request}= require('express')


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
  getFilePath(req) {
    let files = (req  ).files 
      const myFirstFile1 = String(files[0]?.path);
      const myFirstFile2 = String(files[1]?.path);
    const myFirstFile3 = String(files[2]?.path);
    return {
      file1: myFirstFile1,
      file2: myFirstFile2,
      file3: myFirstFile3
    }
  }
}

// type file = {
//   mimetype: string;
// }
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
      let dir = "./images";
      if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
      } cb(null, dir)
    
  },

  filename: (req, file, cb) => {
       cb(null, Date.now( ) + '--' + path.extname(file.originalname))
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
  } else if (file.mimetype === 'application/pdf') {
      cb(null, true);
  } else {
      cb({ message: `Unspported file format ${file.mimetype}` });
  }
};
const upload = multer({ storage: fileStorageEngine, limits: { fileSize: 4200 * 3800 }, fileFilter, })
module.exports = { Utilities,upload };
