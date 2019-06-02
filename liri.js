//Set environment variables with dotenv
require("dotenv").config();

//Import the keys file and store it in a variable
var keys = require("./keys.js");

//require spotify api
var Spotify = require('node-spotify-api');

//spotify variable
var spotify = new Spotify(keys.spotify);
console.log(spotify);

spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
   
  console.log(data); 
  });

//omdb variable
// var omdb = new omdb(keys.omdb);

// //bands in town variable
// var bandsInTown = new bandsInTown(keys.bandsInTown);

//node liri.js concert-this <artist/band name here>
//search Bands in Town API ("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp") for an artist and render the following information about each event to the terminal:

// Name of the venue
// Venue location
// Date of the Event (use moment to format this as "MM/DD/YYYY")

//node liri.js spotify-this-song '<song name here>'
//show the following info about the song in terminal

//artists
//song's name
//preview link of song from Spotify
//album the song is from
//if no song, default to "The Sign" by Ace of Base

//node liri.js movie-this '<movie name here>'
//output the following info in terminal
//movie title
//year movie came out
//IMDB rating
//Rotten Tomatoes rating
//Country where movie was produced
//Language of the movie
//Plot of the movie
//Actors in the movie
//if user doesn't type movie in, default to the movie "Mr. Nobody"