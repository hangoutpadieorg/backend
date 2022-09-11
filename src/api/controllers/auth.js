const bcrypt = require('bcrypt');
const { StatusCodes } = require('http-status-codes');
const User = require('../../models/userModel');
const { registrationSchema } = require('../../utils/validations');

const registerController = async (req, res) => {
  const validationResult = await registrationSchema.validateAsync(req.body);

  const foundUser = await User.findOne({ email: validationResult.email });

  if (foundUser)
    return res.status(StatusCodes.CONFLICT).json({
      message: 'This email already exists, please choose another email',
    });

  const password = await bcrypt.hash(validationResult.password, 10);

  const userObject = {
    name: validationResult.name,
    email: validationResult.email,
    password,
  };

  const user = await User.create(userObject);

  return res.status(StatusCodes.CREATED).json({ message: 'User created' });
};

module.exports = {
  registerController,
};
