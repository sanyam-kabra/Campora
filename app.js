const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/expressError');
const Review = require('./models/review');

// connecting to mongoose
mongoose.connect('mongodb://localhost:27017/campora');
const db = mongoose.connection;
db.on('connected', () => {
  console.log('MongoDB connected successfully!');
});
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
db.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// middlewares
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//setting the view engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Home page
app.get('/', (req, res) => {
    res.render('home');
})

// All campgrounds page
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}))

// Adding new Camp page
app.post('/campgrounds', catchAsync(async(req,res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
}))

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
})

// Editing Campground 
app.put('/campgrounds/:id', catchAsync(async(req,res) => {
  const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground});
  res.redirect(`/campgrounds/${campground._id}`);
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', {campground});
}))

// Deleting Campground
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
}))

// Details page for a page
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate('reviews');
  res.render('campgrounds/show', {campground});
}))

//Adding reviews
app.post('/campgrounds/:id/reviews', catchAsync(async(req,res) => {
  const {id} = req.params;
  const review = new Review(req.body.review);
  const campground = await Campground.findById(id);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  res.redirect(`/campgrounds/${id}`);
}))

//deleting reviews
app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async(req,res)=>{
  const {id, reviewId} = req.params;
  await Campground.findByIdAndUpdate(id, {$pull : {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/campgrounds/${id}`);
}))

app.all(/(.*)/, (req,res, next) => {
  throw new ExpressError('Page not Found', 404);
})

app.use((err, req, res, next) => {
  const {statusCode = 500} = err;
  if(!err.message){
    err.message = "Something Went Wrong";
  }
  res.status(statusCode).render('error', {err});
})

app.listen(3000, () => {
    console.log("listening");
})