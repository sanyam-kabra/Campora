const Campground = require('../models/campground'); //Campground model

module.exports.AllCampgrounds = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}

module.exports.renderNewCampForm = (req, res) => {
  res.render('campgrounds/new');
};

module.exports.AddNewCamp = (req, res) => async(req,res) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  req.flash('success', 'Succesfully created a campground!');
  res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.EditCamp = async(req,res) => {
  const {id} = req.params;
  const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground});
  req.flash('success', 'Successfully edited the Campground!')
  res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.renderEditCampForm = async (req, res) => {
  const {id} = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/edit', {campground});
}