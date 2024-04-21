const Listing = require("./models/listings.js")

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // console.log(req.originalUrl, "..",req.path);
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logIn ");
    return res.redirect("/login");
  }
  next();
};

module.exports.savedRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner=async (req,res,next)=>{
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currentUser._id)) {
    req.flash("error", "You don't have premission to edit");
    return res.redirect(`/listings/${id}`);
  }
  next();
}