const express = require("express");
const router = express.Router();

//  Article Models
let Articles = require("../models/articles");

// Add Route
router.get("/add", (req, res) => {
  res.render("add_articles", {
    title: "Add articles"
  });
});

// Add Submit POST Route
router.post("/add", (req, res) => {
  req.checkBody("title", "Title is required").notEmpty();
  req.checkBody("author", "Author is required").notEmpty();
  req.checkBody("body", "Body is required").notEmpty();

  let errors = req.validationErrors();

  if (errors) {
    res.render("add_articles", {
      title: "Add articles",
      errors: errors,
      titles: req.body.title,
      author: req.body.author,
      body: req.body.body
    });
  } else {
    let article = new Articles();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(error => {
      if (error) {
        console.log(error);
      } else {
        req.flash("success", "Articles Created");
        res.redirect("/");
      }
    });
  }
});

// Load edit form
router.get("/edit/:id", (req, res) => {
  Articles.findById(req.params.id, (error, article) => {
    res.render("edit_article", {
      title: "Edit article",
      article: article
    });
  });
});

// Update article
router.post("/edit/:id", (req, res) => {
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = { _id: req.params.id };

  Articles.update(query, article, error => {
    if (error) {
      console.log(error);
    } else {
      req.flash("success", "Articles Updated");
      res.redirect(`/articles/${req.params.id}`);
    }
  });
});

// Delete an article
router.delete("/:id", (req, res) => {
  let query = { _id: req.params.id };

  Articles.deleteOne(query, error => {
    if (error) {
      console.log(error);
    } else {
      res.send("Success");
    }
  });
});

// Get single article
router.get("/:id", (req, res) => {
    Articles.findById(req.params.id, (error, article) => {
      res.render("single_article", {
        article: article
      });
    });
  });

module.exports = router;
