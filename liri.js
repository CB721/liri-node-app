//Set environment variables with dotenv
require("dotenv").config();

//Import the keys file and store it in a variable
var keys = require("./keys.js");

//require spotify api
var Spotify = require("node-spotify-api");

//require Axios
var axios = require("axios");

//require Moment
var moment = require("moment");

//require fs
var fs = require("fs");

//spotify variable
var spotify = new Spotify(keys.spotify);

//get information from random.txt file
var doWhatItSays = function () {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return console.log(error);
    }
    //remove Spotify command
    var surpriseSong = data.slice(18, 38);
    //call spotify function
    getSpotifyData(surpriseSong);
  });
}

//get information from Spotify
var getSpotifyData = function (songTitle) {
  //if no song, default to "The Sign" by Ace of Base
  if (songTitle === " ") {
    songTitle = "The Sign, Ace of Base";
  }
  spotify.search({ type: "track", query: songTitle }, function (err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    //artists
    console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
    //song's name
    console.log("Track name: " + data.tracks.items[0].name);
    //preview link of song from Spotify
    console.log("URL: " + data.tracks.items[0].album.external_urls.spotify);
    //album the song is from
    console.log("Album: " + data.tracks.items[0].album.name);
  });
}

//omdb variable
var getOmdbData = function (movieTitle) {
  //if user doesn't type movie in, default to the movie "Mr. Nobody"
  if (movieTitle === " ") {
    movieTitle = "Mr. Nobody";
  }
  //create url
  var omdbUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&tomatoes=true&y=&plot=short&apikey=trilogy";
  axios.get(omdbUrl).then(
    function(response) {
      //movie title
      console.log("Title: " + response.data.Title);
      //year movie came out
      console.log("Release Date: " + response.data.Released);
      //IMDB rating
      console.log("IMDB Rating: " + response.data.imdbRating);
      //Rotten Tomatoes rating
      console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
      //Country where movie was produced
      console.log("Production Country: " + response.data.Country);
      //Language of the movie
      console.log("Language(s): " + response.data.Language);
      //Plot of the movie
      console.log("Plot: " + response.data.Plot);
      //Actors in the movie
      console.log("Actors: " + response.data.Actors);
    }
  );
}

//bands in town variable
var getBandsInTownData = function () {
  //create url
  var bandsUrl = "https://rest.bandsintown.com/artists/" + content + "/events?app_id=codingbootcamp";
  axios.get(bandsUrl).then(
    function(response) {
      // Name of the venue
      console.log("Venue: " + response.data[0].venue);
      // Venue location
      // console.log("Location: " + response.data[0].location);
      //get date and time
      var time = response.data[1].datetime;
      //remove time
      var removeTime = time.slice(0, 10);
      //format date
      var concertDate = moment(removeTime).format('MM/DD/YYYY');
      // Date of the Event (use moment to format this as "MM/DD/YYYY")
      console.log("Date: " + concertDate);
    }
  );
}

//search platform variable
var search = process.argv[2];
//content search variable
var content = process.argv[3];
//switch statement
switch (search) {
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
    // code block
    break;
  //do what it says search  
  case "do-what-it-says":
    //get text from random.txt file
    doWhatItSays();
    break;
  //if no search  
  default:
  console.log("Sorry, LIRI doesn't know that.  Please try again.");
}