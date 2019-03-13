const express = require("express");
const router = express.Router();
const moment = require("moment");

//  Article Models
let Articles = require("../models/articles");

//  User Models
let User = require("../models/user");

// Pagination Route
router.get("/pages/:page", function(req, res, next) {
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


// Add Route
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("add_articles", {
    title: "Add articles"
  });
});

// Add Submit POST Route
router.post("/add", (req, res) => {
  req.checkBody("title", "Title is required").notEmpty();
  req.checkBody("image_url", "Image_Url is required").notEmpty();
  req.checkBody("body", "Body is required").notEmpty();

  let errors = req.validationErrors();

  if (errors) {
    res.render("add_articles", {
      title: "Add articles",
      errors: errors,
      titles: req.body.title,
      image_url: req.body.image_url,
      body: req.body.body
    });
  } else {
    let article = new Articles();
    article.title = req.body.title;
    article.image_url = req.body.image_url;
    article.author = req.user.id;
    article.body = req.body.body;

    article.save((error, article) => {
      if (error) {
        console.log(error);
      } else {
        req.flash("success", "Article Created");
        res.redirect(`/articles/${article._id}`);
      }
    });
  }
});

// Load edit form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  let query = { _id: req.params.id };

  if (query) {
    Articles.findById(query, (error, article) => {
      if (article.author && req.user_id && article.author != req.user._id) {
        req.flash("danger", "Not Authorized");
        res.redirect(`/articles/${article.id}`);
      } else {
        res.render("edit_article", {
          title: "Edit article",
          article: article
        });
      }
    });
  }
});

// Update article
router.post("/edit/:id", ensureAuthenticated, (req, res) => {
  let article = {};
  article.title = req.body.title;
  article.image_url = req.body.image_url;
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

  Articles.findById(req.params.id, (error, article) => {
    if (article.author && req.user_id && article.author != req.user._id) {
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
        image_url: article.image_url,
        author: user.name,
        date: moment(article.created_on).fromNow()
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
