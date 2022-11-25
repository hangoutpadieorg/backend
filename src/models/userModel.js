const {Schema, model} = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please provide a valid email address'],
  },
  phoneNumber: {
    type: String,
  },

  role: {
    type: String,
    enum: ['user', 'vendor', 'admin'],
    default: 'user',
    required: [true, 'Please provide user type']
  },
  gender: {
    type: String,
    //required: [true, 'Please provide gender']
  },
  image: {
    type: String,
    default:
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
  },

  verificationCode: {
    type: Number
  },
  isEmailVerified: {
    type: Boolean,
    defualt: false,
  },
  tokens:{type: Object,},
  createdAt: {
    type: Date,
    default: Date.now,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: false,
    
  },
});

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return this.passwordResetToken;
};

const User = model('User', userSchema);
module.exports = User;
