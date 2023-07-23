const CustomError = require('../errors');

const checkPermissions = (requestUser, ressourceUserId) => {
  // console.log(requestUser);
  // console.log(ressourceUserId);
  // console.log(typeof ressourceUserId);

  if (requestUser.role === 'admin') return;
  if (requestUser.userId === ressourceUserId.toString()) return;
  throw new CustomError.Unauthorized('Not authorized to access this route');
};

module.exports = checkPermissions;
