const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    req.logOut((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "you are logout");
      res.redirect("/listings");
    });
  });
  
  module.exports=router;

