let express = require("express");
let app = express();
let bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");

let artists = [{
    name: "Lana del Rey",
    image: "http://lanadelrey.com/wp-content/themes/lanadelrey/assets/splash_lustforlife/images/photo2.jpg?v=1"
  },
  {
    name: "Kali Uchis",
    image: "http://www.latina.com/sites/default/files/articles/2017-01-20/Kali-Uchis-Promo.jpg"
  },
  {
    name: "Julia Pietrucha",
    image: "https://4.bp.blogspot.com/-ckGJ9l3_SMs/V8mHo274zCI/AAAAAAAAAug/PHXqwrtP8pkm2CUQ9FXz4XSOED7c0uJqACEw/s1600/julia%2Bpietrucha%2Bukulele.jpg"
  }
];

//LANDING PAGE
app.get("/", function(req, res) {
  res.render("landing");
});

//INDEX ROUTE
app.get("/artists", function(req, res) {
  res.render("artists", {
    artists: artists
  });
});

app.post("/artists", function(req, res) {
  let name = req.body.name;
  let image = req.body.image;
  let newArtist = {
    name: name,
    image: image
  };
  artists.push(newArtist);
  res.redirect("/artists");
});

//NEW ROUTE
app.get("/artists/new", function(req, res) {
  res.render("new");
});



app.listen(8666, process.env.IP, function() {
  console.log("Server is running");
});