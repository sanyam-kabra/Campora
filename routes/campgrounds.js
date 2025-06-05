const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');
const Campground = require('../models/campground');

// All campgrounds page
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}))

// Adding new Camp page
router.post('/', catchAsync(async(req,res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  req.flash('success', 'Succesfully created a campground!');
  res.redirect(`/campgrounds/${campground._id}`);
}))

router.get('/new', (req, res) => {
  res.render('campgrounds/new');
})

// Editing Campground 
router.put('/:id', catchAsync(async(req,res) => {
  const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground});
  req.flash('success', 'Successfully edited the Campground!')
  res.redirect(`/campgrounds/${campground._id}`);
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if(!campground){
    req.flash('error', 'Cannot find that Campground')
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', {campground});
}))

// Deleting Campground
router.delete('/:id', catchAsync(async (req, res) => {
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted the Campground!')
  res.redirect('/campgrounds');
}))

// Details page for a page
router.get('/:id', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate('reviews');
  if(!campground){
    req.flash('error', 'Cannot find that Campground')
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', {campground});
}))

module.exports = router;