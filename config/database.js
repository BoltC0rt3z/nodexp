// Environment Setup
var env = process.env.NODE_ENV || "development";

// Get environment settings from config
var config = require("./mongo")[env];

mongoURL = () => {
  // Production mongodb url setup
  var envUrl = process.env[config.use_env_variable];

  // Development(local) mongodb url setup
  var localUrl = `mongodb://${config.host}/${config.database}`;

  // Set the connection URL depending on the environment
  var mongoURL = envUrl ? envUrl : localUrl;

  return mongoURL;
};

module.exports = {
  database: mongoURL(),
  secret: "qwertyuiop"
};
