const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');
const Campground = require('../models/campground');
const {isLoggedIn, isAuthor} = require('../middlewares');   //Authentication middleware
const campgrounds = require('../controllers/campground');
const multer  = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

router.route('/')
    .get(catchAsync(campgrounds.AllCampgrounds))
    .post(isLoggedIn, upload.array('image'), catchAsync(campgrounds.AddNewCamp))

router.get('/new', isLoggedIn, campgrounds.renderNewCampForm)

router.route('/:id')
    .put(isLoggedIn, isAuthor, upload.array('image'), catchAsync(campgrounds.EditCamp))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.DeleteCamp))
    .get(catchAsync(campgrounds.ShowCamp))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditCampForm))

module.exports = router;