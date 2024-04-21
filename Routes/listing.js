const express = require("express");
const router = express.Router();
const Listing = require("../models/listings.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

router.get("/", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("index.ejs", { allListings });
});

//New Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("new.ejs");
});

//Show Route
router.get("/:id", async (req, res) => {
  let { id } = req.params;
  try {
    const listing = await Listing.findById(id)
      .populate("reviews")
      .populate("owner"); // Populate the owner field
    console.log(listing);
    res.render("show.ejs", { listing });
  } catch (error) {
    console.error("Error fetching listing:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Create Route
router.post("/", isLoggedIn, async (req, res) => {
  try {
    // Assuming req.user contains the authenticated user's information
    const ownerId = req.user._id; // Get the ID of the authenticated user
    const listingData = req.body.listing;

    // Add the owner property to the listing data
    listingData.owner = ownerId;

    // Create a new listing with the provided data
    const newListing = new Listing(listingData);

    // Save the new listing to the database
    await newListing.save();

    res.redirect("/listings");
  } catch (error) {
    console.error("Error creating listing:", error);
    req.flash("error", "Failed to create listing");
    res.redirect("/listings/new");
  }
});

//Edit Route
router.get("/:id/edit", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("edit.ejs", { listing });
});

//Update Route
router.put("/:id", isLoggedIn, isOwner, async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

//Delete Route
router.delete("/:id", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  // console.log(deletedListing);
  res.redirect("/listings");
});

module.exports = router;
