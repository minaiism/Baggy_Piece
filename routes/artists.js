let express = require("express");
let router = express.Router();
let Artist = require("../models/artist");
let middleware = require("../middleware");

//INDEX ROUTE
router.get("/", function(req, res) {
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Artist.find({
      name: regex
    }, function(err, allArtists) {
      if (err) {
        console.log(err);
      } else {
        res.render("artists/index", {
          artists: allArtists,
          loggedIn: req.isAuthenticated()
        });
      }
    });
  } else {
    Artist.find({}, function(err, allArtists) {
      if (err) {
        console.log(err);
      } else {
        res.render("artists/index", {
          artists: allArtists,
          loggedIn: req.isAuthenticated()
        });
      }
    });
  }
});

//CREATE - add new artist to DB
router.post("/", middleware.isLoggedIn, function(req, res) {

  let newArtist = {
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    youtube: req.body.youtube,
    spotify: req.body.spotify,
    facebook: req.body.facebook,
    twitter: req.body.twitter,
    instagram: req.body.instagram,
    pinterest: req.body.pinterest,
    author: {
      id: req.user._id,
      username: req.user.username
    }
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
router.get("/new", middleware.isLoggedIn, function(req, res) {
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
        artist: foundArtist,
        loggedIn: req.isAuthenticated()
      });
    }
  });
});

//EDIT ROUTE

router.get("/:id/edit", middleware.checkArtistOwnership, function(req, res) {
  Artist.findById(req.params.id, function(err, foundArtist) {
    res.render("artists/edit", {
      artist: foundArtist
    });
  });
});

//UPDATE ROUTE
router.put("/:id", middleware.checkArtistOwnership, function(req, res) {
  Artist.findByIdAndUpdate(req.params.id, req.body.artist, function(err, updatedArtist) {
    if (err) {
      res.redirect("/artists");
    } else {
      res.redirect("/artists/" + req.params.id);
    }
  });
});

//DELETE ROUTES

router.delete("/:id", middleware.checkArtistOwnership, function(req, res) {
  Artist.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/artists");
    } else {
      res.redirect("/artists");
    }
  });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;