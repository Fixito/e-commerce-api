const User = require('../models/User.js');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions
} = require('../utils');

const getAllUsers = async (req, res) => {
  console.log(req.user);
  const user = await User.find({ role: 'user' }).select('-password');
  res.status(StatusCodes.OK).json({ user });
};

const getSingleUser = async (req, res) => {
  // throw ErrorCast si pas de correspondance
  const user = await User.findById(req.params.id).select('-password');

  //! inutile
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${req.params.id}`);
  }

  console.log(user);
  checkPermissions(req.user, user._id);

  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

// update user with findOneAndUpdate
// const updateUser = async (req, res) => {
//   const { name, email } = req.body;

//   if (!name || !email) {
//     throw new CustomError.BadRequestError('Please provide name and email');
//   }

//   const user = await User.findOneAndUpdate(
//     { _id: req.user.userId },
//     { name, email },
//     { new: true, runValidators: true }
//   );
//   const tokenUser = createTokenUser(user);
//   attachCookiesToResponse({ res, user: tokenUser });
//   res.status(StatusCodes.OK).json({ user: tokenUser });
// };

// update user with user.save()
const updateUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new CustomError.BadRequestError('Please provide name and email');
  }

  const user = await User.findById(req.user.userId);
  user.name = name;
  user.email = email;
  await user.save();
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError('Please provide both values');
  }

  const user = await User.findById(req.user.userId);
  const isPasswordcorrect = await user.comparePassword(oldPassword);

  if (!isPasswordcorrect) {
    throw new CustomError.UnauthenticatedError('Invalid credentials');
  }

  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: 'Success! Password updated' });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword
};
