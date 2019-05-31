//Set environment variables with dotenv
require("dotenv").config();

//Import the keys file and store it in a variable
var keys = require("./keys.js");

//spotify variable
var spotify = new spotify(keys.spotify);