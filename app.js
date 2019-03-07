const express = require("express");
const path = require("path");

// Init App
const app = express();

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
  let articles = [
    {
      id: 1,
      title: "some title",
      author: "BoltC0rt3z",
      body: "this a body"
    },
    {
      id: 2,
      title: "some title 2",
      author: "jane",
      body: "this a body 2"
    },
    {
      id: 3,
      title: "some title 3",
      author: "John",
      body: "this a body 3"
    }
  ]
  res.render("add_articles", {
    title: "Add articles",
    articles: articles
  });
});

// configure PORT
PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
