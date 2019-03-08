const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const expressValidator = require("express-validator");

// Configure Database
mongoose.connect("mongodb://localhost/nodexp", { useNewUrlParser: true });
let db = mongoose.connection;

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

// Main Route
app.get("/", (req, res) => {
  Articles.find({}, (error, articles) => {
    if (error) {
      console.log(error);
    } else {
      res.render("index", {
        title: "Articles",
        articles: articles
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
