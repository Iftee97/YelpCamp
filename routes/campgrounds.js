const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateCampground, isLoggedIn, isAuthor } = require("../middlewares");
const {
    index,
    renderNewForm,
    showCampground,
    createCampground,
    renderEditForm,
    updateCampground,
    deleteCampground,
} = require("../controllers/campgrounds");

const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

// routers
router
    .route("/")
    .get(index)
    .post(
        isLoggedIn,
        upload.array("image"),
        validateCampground,
        createCampground
    );

router.get("/new", isLoggedIn, renderNewForm);

router
    .route("/:id")
    .get(showCampground)
    .put(
        isLoggedIn,
        isAuthor,
        upload.array("image"),
        validateCampground,
        updateCampground
    )
    .delete(isLoggedIn, isAuthor, deleteCampground);

router.get("/:id/edit", isLoggedIn, isAuthor, renderEditForm);

// ----------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------

// // get all campgrounds
// router.get("/", index);

// // new campground form
// router.get("/new", isLoggedIn, renderNewForm);

// get single campground
// router.get("/:id", showCampground);

// // create a new campground
// router.post("/", isLoggedIn, validateCampground, createCampground);

// // edit form
// router.get("/:id/edit", isLoggedIn, isAuthor, renderEditForm);

// // edit a campground
// router.put("/:id", isLoggedIn, isAuthor, validateCampground, updateCampground);

// // delete campground
// router.delete("/:id", isLoggedIn, isAuthor, deleteCampground);

module.exports = router;
