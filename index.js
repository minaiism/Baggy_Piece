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
  image: String
});

let Artist = mongoose.model("Artist", artistSchema);

// Artist.create({
//   name: "Lana",
//   image: "http://lanadelrey.com/wp-content/themes/lanadelrey/assets/splash_lustforlife/images/photo2.jpg?v=1"
// }, function(err, artist) {
//   if (err) {
//     console.log("Something went wrong!");
//     console.log(err);
//   } else {
//     console.log("Newly created artist");
//     console.log(artist);
//   }
// });

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
      res.render("artists", {
        artists: allArtists
      });
    }
  });
});

app.post("/artists", function(req, res) {
  let name = req.body.name;
  let image = req.body.image;
  let newArtist = {
    name: name,
    image: image
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



app.listen(8666, process.env.IP, function() {
  console.log("Server is running");
});

// mongod --dbpath d:\mongodb\data