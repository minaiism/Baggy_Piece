let express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  moment = require("moment"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  Artist = require("./models/artist"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seeds");

//REQUIRING ROUTES
let commentRoutes = require("./routes/comments"),
  artistRoutes = require("./routes/artists"),
  indexRoutes = require("./routes/index");

mongoose.connect(process.env.MONGO_URI);
console.log(process.env.MONGO_URI);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// seedDB(); //seed the DB
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");

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
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/artists", artistRoutes);
app.use("/artists/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
  console.log("Server is running");
});