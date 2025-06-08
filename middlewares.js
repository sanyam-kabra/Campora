const Campground = require('./models/campground');
const Review = require('./models/review');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/expressError');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated())
    {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    console.log(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// to store the last page before login from session to locals
module.exports.storeReturnTo = (req, res, next) => {
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

//middleware fo authorization of campground
module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Cannot find that Campground')
        return res.redirect('/campgrounds');
    }
    if(!campground.author.equals(req.user._id)){
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/campgrounds/${id}`)
  }
  next();
}

//middleware fo authorization of reviews
module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review){
        req.flash('error', 'Cannot find that Review')
        return res.redirect(`/campgrounds/${id}`);
    }
    if(!review.author.equals(req.user._id)){
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/campgrounds/${id}`)
  }
  next();
}