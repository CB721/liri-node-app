console.log('this is loaded');

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

exports.omdb = {
  id: process.env.OMBD_ID,
  secret: process.env.OMBD_SECRET
};

exports.bandsInTown = {
  id: process.env.BANDSINTOWN_ID,
  secret: process.env.BANDSINTOWN_SECRET
}