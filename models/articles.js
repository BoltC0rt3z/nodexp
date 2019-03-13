let mongoose = require("mongoose");
const Schema = mongoose.Schema

// Article schema
let articleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  image_url: {
    type: String
  },
  body: {
    type: String,
    required: true
  },
  created_on: {
    type: Date,
    default: Date.now
  }
});

let Articles = (module.exports = mongoose.model("Articles", articleSchema));
