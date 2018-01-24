let Artist = require("../models/artist");
let Comment = require("../models/comment");

let middlewareObj = {};

middlewareObj.checkArtistOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Artist.findById(req.params.id, function(err, foundArtist) {
      if (err) {
        res.redirect("back");
      } else {
        if (foundArtist.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
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
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};


middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

module.exports = middlewareObj;