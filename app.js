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
const session = require('express-session');
const flash = require('connect-flash');

// Routers
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

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

//middleware for public folder
app.use(express.static(path.join(__dirname, 'public')));

//configuring the session
const sessionConfig = {
  secret: 'justatemporarykey',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000*60*60*24*7, // expires after 1 week
    maxAge: 1000*60*60*24*7
  }
}
app.use(session(sessionConfig));

//configuring flash
app.use(flash());

app.use((req,res, next) => {
  res.locals.success = req.flash('success');
  next();
})

//express Router middleware
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

// Home page
app.get('/', (req, res) => {
    res.render('home');
})

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