let express = require("express");
let router = express.Router({
  mergeParams: true
});
let Artist = require("../models/artist");
let Comment = require("../models/comment");
let middleware = require("../middleware");

//COMMENTS ROUTES
//Comments new
router.get("/new", middleware.isLoggedIn, function(req, res) {
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
          req.flash("error", "Something went wrong!");
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
          req.flash("success", "Comment added successfully");
          res.redirect('/artists/' + artist._id);
        }
      });
    }
  });
});

//COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
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
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/artists/" + req.params.id);
    }
  });
});

//COMMENT DELETE ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted");
      res.redirect("/artists/" + req.params.id);
    }
  });
});

module.exports = router;