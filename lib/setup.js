var open = require('open');

module.exports = function (clientID, cb) {
  var REDIRECT_URI = 'https://rogeriopvl.github.com/downstagram';

  console.log('\n********** DOWNSTAGRAM OAUTH SETUP **********');
  console.log('\n To use downstagram you need to authorize it to access your instagram account.');
  console.log('Your browser will open for you to authorize the app...');

  var authURI = [
    'https://instagram.com/oauth/authorize/?',
    'client_id=' + clientID,
    '&redirect_uri=' + REDIRECT_URI,
    '&response_type=token'
  ].join('');

  console.log('\n If your browser does not open up, you can stil open it manually:');
  console.log(authURI, ' \n');

  open(authURI);

  console.log('Now according to the intructions in the App page, insert your access token here:');

  process.stdin.resume();
  process.stdin.on('data', function (chunk) {
    var token = chunk.toString().trim();
    process.stdin.pause();
    cb(null, token);
  });
};
