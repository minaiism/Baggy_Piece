let express = require("express");
let router = express.Router();
let passport = require("passport");
let User = require("../models/user");

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
    username: req.body.username
  });
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

//middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;