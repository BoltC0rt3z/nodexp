const express = require("express");
const router = express.Router();

//  Article Models
let Articles = require("../models/articles");

//  User Models
let User = require("../models/user");

// Add Route
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("add_articles", {
    title: "Add articles"
  });
});

// Add Submit POST Route
router.post("/add", (req, res) => {
  req.checkBody("title", "Title is required").notEmpty();
  req.checkBody("body", "Body is required").notEmpty();

  let errors = req.validationErrors();

  if (errors) {
    res.render("add_articles", {
      title: "Add articles",
      errors: errors,
      titles: req.body.title,
      body: req.body.body
    });
  } else {
    let article = new Articles();
    article.title = req.body.title;
    article.author = req.user.id;
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
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Articles.findById(req.params.id, (error, article) => {
    if (article.author != req.user._id) {
      req.flash("danger", "Not Authorized");
      res.redirect("/");
    } else {
      res.render("edit_article", {
        title: "Edit article",
        article: article
      });
    }
  });
});

// Update article
router.post("/edit/:id", ensureAuthenticated, (req, res) => {
  let article = {};
  article.title = req.body.title;
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
  if (!req.user._id) {
    res.status(500).send();
  }
  let query = { _id: req.params.id };

  Article.findById(req.params.id, (error, article) => {
    if (article.author != req.user._id) {
      res.status(500).send();
    } else {
      Articles.deleteOne(query, error => {
        if (error) {
          console.log(error);
        } else {
          res.send("Success");
        }
      });
    }
  });
});

// Get single article
router.get("/:id", (req, res) => {
  Articles.findById(req.params.id, (error, article) => {
    User.findById(article.author, (error, user) => {
      res.render("single_article", {
        article: article,
        author: user.name
      });
    });
  });
});

// Access control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("danger", "Please login");
    res.redirect("/users/login");
  }
}

module.exports = router;
