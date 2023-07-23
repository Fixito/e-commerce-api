const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication.js');

const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController.js');

router.route('/').post(authenticateUser, createReview).get(getAllReviews);
router
  .route('/:id')
  .get(getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);

module.exports = router;
