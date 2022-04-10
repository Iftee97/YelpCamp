const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken =
  "pk.eyJ1IjoiaWZ0ZWU5NyIsImEiOiJja3FrMXdvYnkxeDdmMnBwZXQ1MGloNWQzIn0._2k1mSb1MzX9lavu-nFpjA";
const geocoder = mbxGeocoding({ accessToken: mapboxToken });

const index = catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

const renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

const showCampground = catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } }) // populating campground with reviews and thier corresponding author
    .populate("author"); // populating campground with author of the campground
  // console.log(campground);
  if (!campground) {
    req.flash("error", "cannot find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
});

const createCampground = catchAsync(async (req, res) => {
  const geoData = await geocoder
    .forwardGeocode({
      // query: "Paris, France",
      query: req.body.campground.location, // comment this line of code when testing
      limit: 1,
    })
    .send();
  // console.log(geoData.body.features[0].geometry.coordinates); // // [longitude, latitude]
  // res.send(geoData.body.features[0].geometry);

  const campground = new Campground(req.body.campground);
  campground.author = req.user._id; // saving the campground author as a user id when creating a campground
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.geometry = geoData.body.features[0].geometry;
  await campground.save();
  console.log(campground);
  req.flash("success", "Successfully created a new campground");
  res.redirect(`/campgrounds/${campground._id}`);
});

const renderEditForm = catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "cannot find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
});

const updateCampground = catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(
    id,
    req.body.campground
  );
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.images.push(...imgs);
  await campground.save();

  // for deleting images
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename); // deleting from cloudinary database
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } }, // deleting from mongo
    });
  }
  req.flash("success", "Successully updated campground");
  res.redirect(`/campgrounds/${id}`);
});

const deleteCampground = catchAsync(async (req, res) => {
  const { id } = req.params;
  const deletedCampground = await Campground.findByIdAndDelete(id);
  req.flash("success", "Successully deleted campground");
  res.redirect("/campgrounds");
});

module.exports = {
  index,
  renderNewForm,
  showCampground,
  createCampground,
  renderEditForm,
  updateCampground,
  deleteCampground,
};
