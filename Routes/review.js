const express = require("express");
const router = express.Router();
const Listing = require("../models/listings.js");
const Review = require("../models/reviews.js");

//reviews
router.post("/:id/reviews", async (req, res) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    console.log(req.body);

    let newReview = new Review(req.body.review);
    console.log(newReview);

    listing.reviews.push(newReview);
    console.log("pushed");
    await newReview.save();
    await listing.save();
    console.log("saved");
    res.redirect(`/listings/${listing._id}`);
  } catch (error) {
    console.log("error: review cannot add");
  }
});

//delete reviews
router.delete("/:id/reviews/:reviewId", async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
});

module.exports = router;
