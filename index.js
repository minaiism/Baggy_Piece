let express = require("express");

let app = express();

app.get("/", function(req, res) {
  res.send("This will be my landing page soon");
});

app.listen(8666, process.env.IP, function() {
  console.log("Server is running");
});