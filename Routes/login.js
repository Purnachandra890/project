const express = require("express");
const router = express.Router();
const { savedRedirectUrl } = require("../middleware.js");
const passport = require("passport");

router.get("/", (req, res) => {
  res.render("login.ejs");
});

router.post(
  "/",
  savedRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "login successfully");
    let url = res.locals.redirectUrl || "/listings";
    res.redirect(url);
  }
);

module.exports = router;
