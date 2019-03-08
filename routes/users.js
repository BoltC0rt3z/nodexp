const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// User Model
let User = require("../models/user");

// register form
router.get("/register", (req, res) => {
  res.render("register");
});

// register user
router.post("/register", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const confirm_password = req.body.confirm_password;

  req.checkBody("name", "Name is required").notEmpty();
  req.checkBody("email", "Email is not valid").isEmail();
  req.checkBody("username", "Username is required").notEmpty();
  req.checkBody("password", "Password is required").notEmpty();
  req.checkBody("confirm_password", "Passwords don't match").equals(password);

  let errors = req.validationErrors();

  if (errors) {
    res.render("register", {
      errors: errors,
      name: name,
      email: email,
      username: username,
      password: password
    });
  } else {
    let user = new User({
      name: name,
      email: email,
      username: username,
      password: password
    });

    bcrypt.genSalt(10, function(error, salt) {
      bcrypt.hash(user.password, salt, function(error, hash) {
        if (error) {
          console.log(error);
          return;
        }
        user.password = hash;
        user.save(error => {
          if (error) {
            console.log(error);
          } else {
            req.flash("success", "Successfully registered");
            res.redirect("/users/login");
          }
        });
      });
    });
  }
});

// Login user
router.get("/login", (error, res) => {
    res.render("login");
  });

module.exports = router;
