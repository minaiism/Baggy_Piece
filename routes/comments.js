let express = require("express");
let router = express.Router({
  mergeParams: true
});
let Artist = require("../models/artist");
let Comment = require("../models/comment");


//COMMENTS ROUTES
//Comments new
router.get("/new", isLoggedIn, function(req, res) {
  Artist.findById(req.params.id, function(err, artist) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {
        artist: artist
      });
    }
  });
});

//Comments create
router.post("/", function(req, res) {
  Artist.findById(req.params.id, function(err, artist) {
    if (err) {
      console.log(err);
      res.redirect("/artists");
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
        } else {
          artist.comments.push(comment);
          artist.save();
          res.redirect('/artists/' + artist._id);
        }
      });
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}


module.exports = router;