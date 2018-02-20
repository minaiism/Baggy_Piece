let Artist = require("../models/artist");
let Comment = require("../models/comment");

let middlewareObj = {};

middlewareObj.checkArtistOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Artist.findById(req.params.id, (err, foundArtist) => {
            if (err) {
                req.flash("error", "Artist not found");
                res.redirect("back");
            } else {
                if (foundArtist.author.id.equals(req.user._id) || req.user.isAdmin) {
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

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
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


middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
};

module.exports = middlewareObj;