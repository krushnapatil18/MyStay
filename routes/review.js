const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {reviewSchema} = require("../schema.js");
const {isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../contollers/reviews.js");

const validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error.message);
    }
    next();
}
//reviews
//post route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId", isLoggedIn, wrapAsync(reviewController.destroyReview));

module.exports = router;