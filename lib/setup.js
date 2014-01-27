module.exports = function () {
    var open = require('open');
    var config = require('./config');
    var REDIRECT_URI = 'https://rogeriopvl.github.com/downstagram';

    console.log('\n********** DOWNSTAGRAM OAUTH SETUP **********');
    console.log('\n To use downstagram you need to authorize it to access your instagram account.');
    console.log('Your browser will open for you to authorize the app...');

    var authURI = [
        'https://instagram.com/oauth/authorize/?',
        'client_id=' + config.auth.client_id,
        '&redirect_uri=' + REDIRECT_URI,
        '&response_type=token'
    ].join('');

    console.log('\n If your browser does not open up, you can stil open it manually:');
    console.log(authURI, ' \n');

    open(authURI);

    console.log('Now according to the intructions in the App page, insert your access token here:');

    var stdin = process.openStdin();
    stdin.on('data', function(chunk) {
        var token = chunk.toString().trim();
        config.auth.access_token = token;
        config.save(config.auth);
        process.exit(0);
    });
};
