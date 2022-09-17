const bcrypt = require('bcrypt');
const { StatusCodes } = require('http-status-codes');
const User = require('../../models/userModel');
const sendMail = require('../../utils/sendMail');
const { registrationSchema } = require('../../utils/validations');
const { BadRequest, Conflict, NotFound } = require('../../errors');

const registerController = async (req, res) => {
  const validationResult = await registrationSchema.validateAsync(req.body);

  const foundUser = await User.findOne({ email: validationResult.email });

  if (foundUser)
    throw new Conflict(
      'A user with this email already exists, please choose another email'
    );

  const password = await bcrypt.hash(validationResult.password, 10);

  const userObject = {
    name: validationResult.name,
    email: validationResult.email,
    password,
  };

  const user = await User.create(userObject);

  return res.status(StatusCodes.CREATED).json({ message: 'User created' });
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

  const result = await foundUser.save();
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
    // token: foundUser.passwordResetToken, // This is only for testing
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

  const result = await user.save();

  return res
    .status(StatusCodes.OK)
    .json({ message: 'The password has been changed.' });
};

module.exports = {
  registerController,
  forgotPasswordController,
  resetPasswordController,
};
