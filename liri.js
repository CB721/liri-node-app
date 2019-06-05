//require firebase
var firebase = require("firebase-admin");
//require service account key
var serviceAccount = require("./liri-app-7f053-firebase-adminsdk-eb2jv-c188b92616.json");
// Initialize Firebase
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://liri-app-7f053.firebaseio.com"
});
//variable for database
var database = firebase.database();

//Set environment variables with dotenv
require("dotenv").config();

//Import the keys file and store it in a variable
var keys = require("./keys.js");

//require spotify api
var Spotify = require("node-spotify-api");
//spotify variable
var spotify = new Spotify(keys.spotify);

//require Axios
var axios = require("axios");

//require Moment
var moment = require("moment");

//require fs
var fs = require("fs");

//get information from random.txt file
var doWhatItSays = function () {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return console.log(error);
    }
    //split text and put into an array
    var textArray = data.split(",");
    //run program with arguments from text file
    runLiri(textArray[0], textArray[1]);
  });
}

//get spotify function
var getSpotifyData = function (songTitle) {
  //if no song, default to "The Sign" by Ace of Base
  if (songTitle == null) {
    songTitle = "The Sign, Ace of Base";
  }
  spotify.search({ type: "track", query: songTitle }, function (err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    //capture results as values
    var artist = data.tracks.items[0].album.artists[0].name;
    var trackName = data.tracks.items[0].name;
    var songLink = data.tracks.items[0].album.external_urls.spotify;
    var albumName = data.tracks.items[0].album.name;
    //push data to the database
    database.ref().push({
      searchPlatform: "Spotify Search",
      artist: artist,
      trackName: trackName,
      songLink: songLink,
      albumName: albumName,
      timeAdded: moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
    });
    //array for logging to txt file
    var songsArr = [
      "Artist: " + artist,
      "Track name: " + trackName,
      "URL: " + songLink,
      "Album: " + albumName
    ]
    //artists
    console.log(songsArr[0]);
    //song's name
    console.log(songsArr[1]);
    //preview link of song from Spotify
    console.log(songsArr[2]);
    //album the song is from
    console.log(songsArr[3]);
    //write data to txt file
    fs.appendFile("log.txt", songsArr, function(err) {
      if (err) throw err;
      console.log("Data has been written to the file.");
    });
  });
}

//get omdb function
var getOmdbData = function (movieTitle) {
  //if user doesn't type movie in, default to the movie "Mr. Nobody"
  if (movieTitle == null) {
    movieTitle = "Mr. Nobody";
  }
  //create url
  var omdbUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&tomatoes=true&y=&plot=short&apikey=trilogy";
  axios.get(omdbUrl).then(
    function (response) {
      //capture results as values
      var title = response.data.Title;
      var releaseDate = response.data.Released;
      var IMDBRating = response.data.imdbRating;
      var rottenTomatoesRating = response.data.Ratings[1].Value;
      var prodCountry = response.data.Country;
      var language = response.data.Language;
      var plot = response.data.Plot;
      var actors = response.data.Actors;
      //push data to the database
      database.ref().push({
        searchPlatform: "Movie Search",
        title: title,
        releaseDate: releaseDate,
        IMDBRating: IMDBRating,
        rottenTomatoesRating: rottenTomatoesRating,
        prodCountry: prodCountry,
        language: language,
        plot: plot,
        actors: actors,
        timeAdded: moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
      });
      //array for logging to txt file
      var movieArr = [
        "Title: " + title,
        "Release Date: " + releaseDate,
        "IMDB Rating: " + IMDBRating,
        "Rotten Tomatoes Rating: " + rottenTomatoesRating,
        "Production Country: " + prodCountry,
        "Language(s): " + language,
        "Plot: " + plot,
        "Actors: " + actors
      ]
      //movie title
      console.log(movieArr[0]);
      //year movie came out
      console.log(movieArr[1]);
      //IMDB rating
      console.log(movieArr[2]);
      //Rotten Tomatoes rating
      console.log(movieArr[3]);
      //Country where movie was produced
      console.log(movieArr[4]);
      //Language of the movie
      console.log(movieArr[5]);
      //Plot of the movie
      console.log(movieArr[6]);
      //Actors in the movie
      console.log(movieArr[7]);
      //write data to txt file
      fs.appendFile("log.txt", movieArr, function(err) {
        if (err) throw err;
        console.log("Data has been written to the file.");
      });
    }
  );
}

//get bands in town function
var getBandsInTownData = function () {
  //create url
  var bandsUrl = "https://rest.bandsintown.com/artists/" + content + "/events?app_id=codingbootcamp";
  axios.get(bandsUrl).then(
    function (response) {
      //capture results as values
      var venue = response.data[0].venue.name;
      var location = response.data[0].venue.city + ", " + response.data[0].venue.region + ", " + response.data[0].venue.country;
      //get date and time
      var timeDate = response.data[0].datetime;
      //remove time
      var date = timeDate.slice(0, 10);
      //format date
      var concertDate = moment(date).format('MM/DD/YYYY');
      //push data to the database
      database.ref().push({
        searchPlatform: "Concert Search",
        artist: content,
        venue: venue,
        location: location,
        concertDate: concertDate,
        timeAdded: moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
      });
      //array for logging to txt file
      var bandsArr = [
        "Venue: " + venue,
        "Location: " + location,
        "Date: " + concertDate
      ]
      // Name of the venue
      console.log(bandsArr[0]);
      // Venue location
      console.log(bandsArr[1]);
      // Date of the Event (use moment to format this as "MM/DD/YYYY")
      console.log(bandsArr[2]);
      //write data to txt file
      fs.appendFile("log.txt", bandsArr, function(err) {
        if (err) throw err;
        console.log("Data has been written to the file.");
      });
    }
  );
}

//search platform variable
var searchType = process.argv[2];
//user input
var userInput = process.argv;
//empty array for user input
var inputArr = [];
//remove node, file name and searchType and push to empty array
for (var i = 3; i < userInput.length; i++) {
  //push to empty array
  inputArr.push(userInput[i]);
}
//join items in inputArr to create a new string
var content = inputArr.join(' ');

var runLiri = function (searchType, content) {
  //switch statement
  switch (searchType) {
    //spotify search
    case "spotify-this-song":
      getSpotifyData(content);
      break;
    //omdb search  
    case "movie-this":
      getOmdbData(content);
      break;
    //bands in town search  
    case "concert-this":
      getBandsInTownData(content);
      break;
    //do what it says search  
    case "do-what-it-says":
      //get text from random.txt file
      doWhatItSays();
      break;
    //if no search  
    default:
      console.log("Sorry, LIRI doesn't know how to do " + searchType + ". Please try again.");
      //log error and time to database
      database.ref().push({
        searchPlatform: "Error!",
        errorInput: searchType,
        timeAdded: moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
      });
  };
}
runLiri(searchType, content);