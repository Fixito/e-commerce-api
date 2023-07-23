const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions
} = require('../middleware/authentication.js');

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword
} = require('../controllers/userController.js');

router.use(authenticateUser);

router.route('/').get(authorizePermissions('admin'), getAllUsers);

router.route('/showMe').get(showCurrentUser);
router.route('/updateUser').post(updateUser);
router.route('/updateUserPassword').post(updateUserPassword);

router.route('/:id').get(getSingleUser);

module.exports = router;
