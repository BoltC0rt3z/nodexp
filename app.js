const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

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

// Get single article
app.get("/article/:id", (req, res) => {
  Articles.findById(req.params.id, (error, article) => {
    res.render("single_article", {
     title: article.title,
     author: article.author,
     body: article.body
    });
  });
});

// Add Route
app.get("/articles/add", (req, res) => {
  res.render("add_articles", {
    title: "Add articles"
  });
});

// Add Submit POST Route
app.post("/articles/add", (req, res) => {
  let article = new Articles();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save(error => {
    if (error) {
      console.log(error);
    } else {
      res.redirect("/");
    }
  });
});

// configure PORT
PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
