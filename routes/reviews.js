const express = require("express");
const router = express.Router({ mergeParams: true });
const {
    validateReview,
    isLoggedIn,
    isReviewAuthor,
} = require("../middlewares");
const { createReview, deleteReview } = require("../controllers/reviews");

// // create a review
router.post("/", validateReview, isLoggedIn, createReview);

// // delete a review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, deleteReview);

module.exports = router;
