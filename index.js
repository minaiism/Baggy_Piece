let express = require("express");

let app = express();
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render("landing");
});

app.get("/artists", function(req, res) {
  res.render("artists");
});

app.listen(8666, process.env.IP, function() {
  console.log("Server is running");
});