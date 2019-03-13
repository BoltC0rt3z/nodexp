const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const expressValidator = require("express-validator");
const config = require("./config/database");
const passport = require("passport");
const moment = require("moment");

// Configure Database
mongoose.connect(process.env.MONGODB_URI || config.database, { useNewUrlParser: true });
let db = mongoose.connection;

// Logger function
const logger = (req, res, next) => {
  console.log(
    `${req.method} : ${req.protocol}://${req.get("host")}${
      req.originalUrl
    } : ${moment().format("llll")}`
  );
  next();
};

// Check connections
db.once("open", () => {
  console.log("Connected to Mongodb");
});

// Check for db errors
db.on("error", error => {
  console.log(error);
});

// Init App
const app = express();

// Models sections
let Articles = require("./models/articles");

// date logger middleware
app.use(logger);

// View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Body parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set public folder
app.use(express.static(path.join(__dirname, "public")));

// Express Session Middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);

//  Express Messages Middleware
app.use(require("connect-flash")());
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Express Validator Middleware
app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

// Passport config
require("./config/passport")(passport);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//
app.get("*", (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Main Route
app.get("/", (req, res) => {
  Articles.find({})
    .populate("author", ["name"])
    .then((articles) => {
      if (!articles) {
        console.log(articles);
      } else {
        res.render("index", {
          title: "Articles",
          articles: articles,
          moment: moment
        });
      }
    });
});

// Route Files
// Article route
let articles = require("./routes/articles");
app.use("/articles", articles);

// User route
let users = require("./routes/users");
app.use("/users", users);

// configure PORT
PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
