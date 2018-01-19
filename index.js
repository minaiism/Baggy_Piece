let express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  Artist = require("./models/artist"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seeds");

//REQUIRING ROUTES
mongoose.connect("mongodb://localhost/baggypiece");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

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

app.get("/artists/:id/comments/new", isLoggedIn, function(req, res) {
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

//AUTH ROUTES

//show register form
app.get("/register", function(req, res) {
  res.render("register");
});

//handle sign up logic
app.post("/register", function(req, res) {
  let newUser = new User({
    username: req.body.username
  });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render("register");
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/artists");
      });
    }
  });
});

// show login form
app.get("/login", function(req, res) {
  res.render("login");
});
// handling login logic
app.post("/login", passport.authenticate("local", {
  successRedirect: "/artists",
  failureRedirect: "/login"
}), function(req, res) {});

// logic route
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/artists");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}


app.listen(8666, process.env.IP, function() {
  console.log("Server is running");
});

// mongod --dbpath d:\mongodb\data