const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

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
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
})

// Adding new Camp page
app.post('/campgrounds', async(req,res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
})

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
})

// Editing Campground 
app.put('/campgrounds/:id', async(req,res) => {
  const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground});
  res.redirect(`/campgrounds/${campground._id}`);
})

app.get('/campgrounds/:id/edit', async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', {campground});
})

// Deleting Campground
app.delete('/campgrounds/:id', async (req, res) => {
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
})

// Details page for a page
app.get('/campgrounds/:id', async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/show', {campground});
})

app.listen(3000, () => {
    console.log("listening");
})