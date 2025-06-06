const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');
const Campground = require('../models/campground');
const {isLoggedIn, isAuthor} = require('../middlewares');   //Authentication middleware
const campgrounds = require('../controllers/campground');


// All campgrounds page
router.get('/', catchAsync(campgrounds.AllCampgrounds))

// Adding new Camp page
router.get('/new', isLoggedIn, campgrounds.renderNewCampForm)
router.post('/', isLoggedIn, catchAsync(campgrounds.AddNewCamp))

// Editing Campground 
router.put('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.EditCamp))
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditCampForm))


// Deleting Campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted the Campground!')
  res.redirect('/campgrounds');
}))


// Details page for a page
router.get('/:id', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
      path: 'author'
    }
  }).populate('author');
  console.log(campground);
  if(!campground){
    req.flash('error', 'Cannot find that Campground')
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', {campground});
}))

module.exports = router;