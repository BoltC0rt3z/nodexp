const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

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

// Main route
app.get("/", (req, res) => {
  res.render("index", {
    title: "Hello guys"
  });
});

app.get("/articles/add", (req, res) => {
  Articles.find({}, (error, articles) => {
    if (error) {
      console.log(error);
    } else {
      res.render("add_articles", {
        title: "Add articles",
        articles: articles
      });
    }
  });
});

// configure PORT
PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
