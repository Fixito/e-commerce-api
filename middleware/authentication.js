const CustomError = require('../errors');
const { isTokenValid } = require('../utils');

const authenticateUser = async (req, _res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new CustomError.UnauthenticatedError('Authentication invalid');
  }

  try {
    const { name, userId, role } = isTokenValid({ token });
    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication invalid');
  }
};

const authorizePermissions = (...roles) => {
  return (req, _res, next) => {
    console.log(req.user);
    if (!roles.includes(req.user.role)) {
      throw new CustomError.Unauthorized('Unauthorized to access this route');
    }

    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
