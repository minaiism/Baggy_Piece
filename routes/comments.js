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
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          artist.comments.push(comment);
          artist.save();
          console.log(comment);
          res.redirect('/artists/' + artist._id);
        }
      });
    }
  });
});

//COMMENT EDIT ROUTE
router.get("/:comment_id/edit", function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if (err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", {
        artist_id: req.params.id,
        comment: foundComment
      });
    }
  });
});

//COMMENT UPDATE ROUTE
router.put("/:comment_id", function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/artists/" + req.params.id);
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