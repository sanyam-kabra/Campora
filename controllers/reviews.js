const Review = require('../models/review'); //Review model
const Campground = require('../models/campground'); //Campground model

module.exports.createReview = async(req,res) => {
  const {id} = req.params;
  const review = new Review(req.body.review);
  review.author = req.user._id;
  const campground = await Campground.findById(id);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash('success', 'Successfully added the Review!');
  res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteReview = async(req,res)=>{
  const {id, reviewId} = req.params;
  await Campground.findByIdAndUpdate(id, {$pull : {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfully deleted the Review!');
  res.redirect(`/campgrounds/${id}`);
}
