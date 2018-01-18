let express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  Artist = require("./models/artist"),
  Comment = require("./models/comment"),
  seedDB = require("./seeds");


mongoose.connect("mongodb://localhost/baggypiece");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
seedDB();

//LANDING PAGE
app.get("/", function(req, res) {
  res.render("landing");
});

//INDEX ROUTE
app.get("/artists", function(req, res) {
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
app.post("/artists", function(req, res) {
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
app.get("/artists/new", function(req, res) {
  res.render("artists/new");
});

//SHOW ROUTE
app.get("/artists/:id", function(req, res) {
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

//COMMENTS ROUTES

app.get("/artists/:id/comments/new", function(req, res) {
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

app.post("/artists/:id/comments", function(req, res) {
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

app.listen(8666, process.env.IP, function() {
  console.log("Server is running");
});

// mongod --dbpath d:\mongodb\data