const express = require("express");
const router = express.Router();
const User = require("../models/userModel.js");

router.get("/", (req, res) => {
  try {
    res.render("signup.ejs");
  } catch (err) {
    req.flash("error", "signup failed");
    res.redirect("/signup");
  }
});

router.post("/", async (req, res) => {
  let { username, email, password } = req.body;
  console.log("details",req.body);
  try {
    console.log("entered");
    const newUser = new User({ username, email });
    console.log(newUser);
    let registerUser = await User.register(newUser, password);
    console.log("register details",registerUser);
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "successfully signuped");
      res.redirect("/listings"); // Redirect to login page after successful registration
    });
  } catch (error) {
    req.flash("error", `${error.message}`);
    res.redirect("/signup");
  }
});

module.exports = router;
