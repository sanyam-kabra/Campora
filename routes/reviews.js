const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');
const Review = require('../models/review');
const reviews = require('../controllers/reviews')
const {isLoggedIn, isReviewAuthor, validateReview} = require('../middlewares');   

//Adding reviews
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

//deleting reviews
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))
    
module.exports = router;

