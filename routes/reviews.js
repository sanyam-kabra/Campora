const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');
const Review = require('../models/review');
const {isLoggedIn, isReviewAuthor} = require('../middlewares');   

//Adding reviews
router.post('/', isLoggedIn, catchAsync(async(req,res) => {
  const {id} = req.params;
  const review = new Review(req.body.review);
  review.author = req.user._id;
  const campground = await Campground.findById(id);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash('success', 'Successfully added the Review!');
  res.redirect(`/campgrounds/${id}`);
}))

//deleting reviews
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async(req,res)=>{
  const {id, reviewId} = req.params;
  await Campground.findByIdAndUpdate(id, {$pull : {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfully deleted the Review!');
  res.redirect(`/campgrounds/${id}`);
}))
    
module.exports = router;

