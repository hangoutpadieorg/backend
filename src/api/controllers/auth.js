const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const User = require('../../models/userModel');
const sendMail = require('../../utils/sendMail');
const { registrationSchema } = require('../../utils/validations');
const { BadRequest, Conflict, NotFound } = require('../../errors');

const TOKEN_EXPIRATION = 15 * 60 * 1000;

const registerController = async (req, res) => {
  const validationResult = await registrationSchema.validateAsync(req.body);

  const foundUser = await User.findOne({ email: validationResult.email });

  if (foundUser)
    throw new Conflict(
      'A user with this email already exists, please choose another email'
    );

  const password = await bcrypt.hash(validationResult.password, 10);

  const role = req.vendors ? 'vendor' : 'user';

  const userObject = {
    name: validationResult.name,
    email: validationResult.email,
    password,
    role,
  };

  const message = `${role === 'user' ? 'User' : 'Vendor'} created`;

  await User.create(userObject);

  return res.status(StatusCodes.CREATED).json({ message });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new BadRequest('Email and Password fields cannot be empty');

  const foundUser = await User.findOne({ email }, 'password');

  if (!foundUser)
    throw new BadRequest('There is no user found with this email');

  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    const accessToken = jwt.sign(
      {
        UserInfo: {
          email: foundUser.email,
          role: foundUser.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );

    return res
      .status(StatusCodes.OK)
      .json({ accessToken, expiresIn: TOKEN_EXPIRATION });
  }

  return res
    .status(StatusCodes.UNAUTHORIZED)
    .json({ message: 'Invalid credentials' });
};

const forgotPasswordController = async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Email can not be empty' });

  const foundUser = await User.findOne({ email });

  if (!foundUser) throw new NotFound('No user found with this email');

  const token = foundUser.createPasswordResetToken();

  await foundUser.save();
  const url = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/reset-password/${foundUser.email}/${token}`;

  const data = { url };
  const text = ` Here is your reset password link: ${url} 
  If you did not make this request, kindly ignore. `;

  sendMail(
    'Your password reset link is only valid for 10 mins',
    email,
    text,
    'forgot-password.hbs',
    data
  );

  return res.status(StatusCodes.OK).json({
    message: 'A reset password mail has been sent to the provided email',
    // token: foundUser.passwordResetToken, // enable this when you are about to run tests
  });
};

const resetPasswordController = async (req, res) => {
  const { email, token } = req.params;
  const { password } = req.body;

  if (!email || !token) throw new BadRequest('required data not sent with url');

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new BadRequest('No user found with this token');

  if (!password) throw new BadRequest('Password field is needed');

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;

  await user.save();

  return res
    .status(StatusCodes.OK)
    .json({ message: 'The password has been changed.' });
};

module.exports = {
  registerController,
  forgotPasswordController,
  resetPasswordController,
  loginController,
};
