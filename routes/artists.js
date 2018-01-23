let express = require("express");
let router = express.Router();
let Artist = require("../models/artist");

//INDEX ROUTE
router.get("/", function(req, res) {
  Artist.find({}, function(err, allArtists) {
    if (err) {
      console.log(err);
    } else {
      res.render("artists/index", {
        artists: allArtists
      });
    }
  });
});

//CREATE - add new artist to DB
router.post("/", isLoggedIn, function(req, res) {
  let name = req.body.name;
  let image = req.body.image;
  let description = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username
  };
  let newArtist = {
    name: name,
    image: image,
    description: description,
    author: author
  };
  Artist.create(newArtist, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/artists");
    }
  });
});

//NEW ROUTE
router.get("/new", isLoggedIn, function(req, res) {
  res.render("artists/new");
});

//SHOW ROUTE
router.get("/:id", function(req, res) {
  Artist.findById(req.params.id).populate("comments").exec(function(err, foundArtist) {
    if (err) {
      console.log(err);
    } else {
      console.log(foundArtist);
      res.render("artists/show", {
        artist: foundArtist
      });
    }
  });
});

//EDIT ROUTE

router.get("/:id/edit", checkArtistOwnership, function(req, res) {
  Artist.findById(req.params.id, function(err, foundArtist) {
    res.render("artists/edit", {
      artist: foundArtist
    });
  });
});

//UPDATE ROUTE
router.put("/:id", checkArtistOwnership, function(req, res) {
  Artist.findByIdAndUpdate(req.params.id, req.body.artist, function(err, updatedArtist) {
    if (err) {
      res.redirect("/artists");
    } else {
      res.redirect("/artists/" + req.params.id);
    }
  });
});

//DELETE ROUTES

router.delete("/:id", checkArtistOwnership, function(req, res) {
  Artist.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/artists");
    } else {
      res.redirect("/artists");
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkArtistOwnership(req, res, next) {
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
}

module.exports = router;