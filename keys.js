//verify key file is loaded
console.log('this is loaded');
//export spotify env
exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};