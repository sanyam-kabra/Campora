const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');
const Review = require('../models/review');

//Adding reviews
router.post('/', catchAsync(async(req,res) => {
  const {id} = req.params;
  const review = new Review(req.body.review);
  const campground = await Campground.findById(id);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  res.redirect(`/campgrounds/${id}`);
}))

//deleting reviews
router.delete('/:reviewId', catchAsync(async(req,res)=>{
  const {id, reviewId} = req.params;
  await Campground.findByIdAndUpdate(id, {$pull : {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;

