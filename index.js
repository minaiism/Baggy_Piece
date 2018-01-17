let express = require("express");

let app = express();
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render("landing");
});

app.get("/artists", function(req, res) {
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
  res.render("artists", {
    artists: artists
  });
});

app.listen(8666, process.env.IP, function() {
  console.log("Server is running");
});