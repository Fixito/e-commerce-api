const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions
} = require('../middleware/authentication.js');

const {
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  createProduct
} = require('../controllers/productController.js');
const {
  getSingleProductReviews
} = require('../controllers/reviewController.js');

router
  .route('/')
  .post([authenticateUser, authorizePermissions('admin')], createProduct)
  .get(getAllProducts);

router
  .route('/:id')
  .get(getSingleProduct)
  .patch([authenticateUser, authorizePermissions('admin')], updateProduct)
  .delete([authenticateUser, authorizePermissions('admin')], deleteProduct);

router
  .route('/uploadImage')
  .post([authenticateUser, authorizePermissions('admin')], uploadImage);

router.route('/reviews/:id').get(getSingleProductReviews);

module.exports = router;
