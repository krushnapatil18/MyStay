const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

//create review route
module.exports.createReview = async(req, res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    newReview.listing = req.params.id; // Set the listing reference
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "Review added successfully");
    res.redirect(`/listings/${listing._id}`);
}

//delete review route
module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);

  // Only the author can delete
  if (!review || !review.author.equals(req.user._id)) {
    req.flash("error", "You are not authorized to delete this review");
    return res.redirect("/profile");
  }

  // Try to remove from listing if listing exists
  if (id) {
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  }
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted successfully");
  res.redirect("/profile");
};