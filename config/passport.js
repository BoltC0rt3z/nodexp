const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const config = require("../config/database");
const bcrypt = require("bcryptjs");

module.exports = function(passport) {
  // local Strategy
  passport.use(
    new LocalStrategy(function(username, password, done) {
      // Match username
      let query = { username: username };
      User.findOne(query, (error, user) => {
        if (error) {
          return done(error);
        }
        if (!user) {
          return done(null, false, { message: `User ${username} not found` });
        }

        // match password
        bcrypt.compare(password, user.password, (error, isMatch) => {
          if (error) {
            return done(error);
          }
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Wrong Password" });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(error, user) {
      done(error, user);
    });
  });
};
