let Artist = require("../models/artist");
let Comment = require("../models/comment");

let middlewareObj = {};

middlewareObj.checkArtistOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Artist.findById(req.params.id, function(err, foundArtist) {
      if (err) {
        req.flash("error", "Artist not found");
        res.redirect("back");
      } else {
        if (foundArtist.author.id.equals(req.user._id)) {
          next();
        } else {
          res.flash("error", "You do not have permission to do that!");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        res.redirect("back");
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You need to be logged in to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("back");
  }
};


middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please Login First!");
  res.redirect("/login");
};

module.exports = middlewareObj;