const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const expressValidator = require("express-validator");
const config = require("./config/database");
const passport = require("passport");
const moment = require("moment");
const faker = require("faker");

// Configure Database
mongoose.connect(process.env.MONGODB_URI || config.database, {
  useNewUrlParser: true
});
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

// Set Page Limit Middleware
app.all(function(req, res, next) {
  if (req.query.limit <= 9) req.query.limit = 9;
  next();
});

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
app.get("/", function(req, res, next) {
  var perPage = 9;
  var page = req.params.page || 1;

  Articles.find({})
    .populate("author", ["name"])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec(function(err, articles) {
      Articles.count().exec(function(err, count) {
        if (err) return next(err);
        res.render("index", {
          title: "Articles",
          articles: articles,
          moment: moment,
          current: page,
          pages: Math.ceil(count / perPage)
        });
      });
    });
});

app.get("/generate-fake-data", function(req, res, next) {
  for (var i = 0; i < 90; i++) {
    var article = new Articles();

    article.title = faker.commerce.department();
    article.image_url = faker.image.imageUrl();
    article.author = req.user.id;
    article.body = faker.commerce.productName();

    article.save(function(err) {
      if (err) throw err;
    });
  }
  res.redirect("/");
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
