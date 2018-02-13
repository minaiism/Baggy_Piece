let express = require("express");
let router = express.Router();
let passport = require("passport");
let User = require("../models/user");
let Artist = require("../models/artist");

setupAdmin();

//LANDING PAGE
router.get("/", (req, res) =>{
  res.render("landing");
});

//AUTH ROUTES
//show register form
router.get("/register", (req, res)=> {
  res.render("register");
});

//handle sign up logic
router.post("/register", (req, res)=> {
  let newUser = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    avatar: req.body.avatar
  });
  // if (req.body.adminCode === "secretcode") {
  //   newUser.isAdmin = true;
  // }
  User.register(newUser, req.body.password, (err, user) =>{
    if (err) {
      console.log(err);
      req.flash("error", err.message);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function() {
        req.flash("success", "Welcome to BaggyPiece" + " " + user.username);
        res.redirect("/artists");
      });
    }
  });
});

// show login form
router.get("/login", (req, res) =>{
  res.render("login");
});
// handling login logic
router.post("/login", passport.authenticate("local", {
  successRedirect: "/artists",
  failureRedirect: "/login"
}), (req, res) =>{});

// logic route
router.get("/logout", (req, res) =>{
  req.logout();
  req.flash("success", "You logged out successfully!");
  res.redirect("/artists");
});

//USER PROFILES
router.get("/users/:id", (req, res)=> {
  User.findById(req.params.id, (err, foundUser) =>{
    if (err) {
      req.flash("error", "Something went wrong.");
      return res.redirect("/");
    }
    Artist.find().where('author.id').equals(foundUser._id).exec(function(err, artists) {
      if (err) {
        req.flash("error", "Something went wrong.");
        return res.redirect("/");
      }
      res.render("users/show", {
        user: foundUser,
        artists: artists
      });
    });
  });
});

function setupAdmin() {
  User.findByUsername("admin", (err, user) =>{
    if (user) {} else {
      User.register({
        username: "admin",
        isAdmin: true
      }, "admin", (err, user)=>{
        if (err) {
          console.log(err);
        } else {
          console.log("added admin");
          //create a comment on each campground
        }
      });
    }
  });
}

module.exports = router;