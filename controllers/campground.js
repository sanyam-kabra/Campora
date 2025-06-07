const Campground = require('../models/campground'); //Campground model
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
const {cloudinary} = require('../cloudinary');

module.exports.AllCampgrounds = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}

module.exports.renderNewCampForm = (req, res) => {
  res.render('campgrounds/new');
};

module.exports.AddNewCamp = async(req,res) => {
  const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.features[0].geometry;
  campground.images = req.files.map( f => ({url: f.path, filename: f.filename}));
  campground.author = req.user._id;
  await campground.save();
  console.log(campground);
  req.flash('success', 'Succesfully created a campground!');
  res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.EditCamp = async(req,res) => {
  const {id} = req.params;
  deleteImages = req.body.deleteImages;
  const newImages = req.files.map( f => ({url: f.path, filename: f.filename}));
  const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
  const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
  campground.geometry = geoData.features[0].geometry;
  campground.images.push(...newImages);
  await campground.save();
  if(deleteImages){
    for(filename of deleteImages){
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({$pull: {images: {filename: {$in: deleteImages}}}});
  }
  req.flash('success', 'Successfully edited the Campground!')
  res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.renderEditCampForm = async (req, res) => {
  const {id} = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/edit', {campground});
}

module.exports.DeleteCamp = async (req, res) => {
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted the Campground!')
  res.redirect('/campgrounds');
}

module.exports.ShowCamp = async (req, res) => {
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
}