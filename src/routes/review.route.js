const express = require('express');
const reviewController = require('../controllers/review.controller');
const router = express.Router();

router.post('/', reviewController.createReview);

module.exports = router;