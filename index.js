let express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  Artist = require("./models/artist"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seeds"),
  methodOverride = require("method-override");

//REQUIRING ROUTES

let commentRoutes = require("./routes/comments"),
  artistRoutes = require("./routes/artists"),
  indexRoutes = require("./routes/index");


mongoose.connect("mongodb://localhost/baggypiece");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();
app.use(methodOverride("_method"));

//PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "BaggyPiece is almost done",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", indexRoutes);
app.use("/artists", artistRoutes);
app.use("/artists/:id/comments", commentRoutes);

app.listen(8666, process.env.IP, function() {
  console.log("Server is running");
});

// mongod --dbpath d:\mongodb\data