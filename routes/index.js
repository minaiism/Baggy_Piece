let express = require("express");
let router = express.Router();
let passport = require("passport");
let User = require("../models/user");

setupAdmin();

//LANDING PAGE
router.get("/", function(req, res) {
  res.render("landing");
});

//AUTH ROUTES
//show register form
router.get("/register", function(req, res) {
  res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res) {
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
  User.register(newUser, req.body.password, function(err, user) {
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
router.get("/login", function(req, res) {
  res.render("login");
});
// handling login logic
router.post("/login", passport.authenticate("local", {
  successRedirect: "/artists",
  failureRedirect: "/login"
}), function(req, res) {});

// logic route
router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "You logged out successfully!");
  res.redirect("/artists");
});

//USER PROFILES
router.get("/users/:id", function(req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    if (err) {
      req.flash("error", "Something went wrong!");
      res.redirect("/");
    } else {
      res.render("users/show", {
        user: foundUser
      });
    }
  });
});

function setupAdmin() {
  User.findByUsername("admin", function(err, user) {
    if (user) {} else {
      User.register({
        username: "admin",
        isAdmin: true
      }, "admin", function(err, user) {
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