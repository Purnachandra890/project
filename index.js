const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/userModel.js");
const mongoose = require("mongoose");
var session = require("express-session");
const MongoStore = require('connect-mongo');
var flash = require("connect-flash");
require("dotenv").config();

const listings = require("./Routes/listing.js");
const review = require("./Routes/review.js");
const signup = require("./Routes/signup.js");
const login = require("./Routes/login.js");
const logout = require("./Routes/logout.js");

const methodOverride = require("method-override");
(engine = require("ejs-mate")), app.engine("ejs", engine);
main().catch((err) => console.log(err));

async function main() {
  // await mongoose.connect("mongodb://127.0.0.1:27017/password");
  await mongoose.connect(process.env.ATLASDB_URL);
  console.log("Connected to MongoDB");
}
// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


const store= MongoStore.create({
  mongoUrl:process.env.ATLASDB_URL,
  crypto:{
    secret:process.env.SECRET
  },
  touchAfter:24*3600
})

const sessionOptions = {
  store:store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expries: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  console.log(req.user);
  next();
});

// Routes
app.get("/", (req, res) => {
  res.render("home.ejs");
});
app.get("/home", (req, res) => {
  res.render("home.ejs");
});
app.use("/signup", signup);
app.use("/login", login);
app.use("/logout", logout);
app.use("/listings", listings);
app.use("/listings", review);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
