let express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/baggypiece");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");

//SCHEMA SETUP
let artistSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

let Artist = mongoose.model("Artist", artistSchema);

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
      res.render("index", {
        artists: allArtists
      });
    }
  });
});

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
  res.render("new");
});

//SHOW ROUTE
app.get("/artists/:id", function(req, res) {
  Artist.findById(req.params.id, function(err, foundArtist) {
    if (err) {
      console.log(err);
    } else {
      res.render("show", {
        artist: foundArtist
      });
    }
  });
});

app.listen(8666, process.env.IP, function() {
  console.log("Server is running");
});

// mongod --dbpath d:\mongodb\data