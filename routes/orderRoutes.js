const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions
} = require('../middleware/authentication.js');

const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder
} = require('../controllers/orderController.js');

router.use(authenticateUser);

router
  .route('/')
  .post(createOrder)
  .get(authorizePermissions('admin'), getAllOrders);

router.route('/showAllMyOrders/:id').get(getCurrentUserOrders);

router.route('/:id').get(getSingleOrder).patch(updateOrder);

module.exports = router;
