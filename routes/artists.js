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
router.post("/", function(req, res) {
  let name = req.body.name;
  let image = req.body.image;
  let description = req.body.description;
  let newArtist = {
    name: name,
    image: image,
    description: description
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
router.get("/new", function(req, res) {
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

module.exports = router;