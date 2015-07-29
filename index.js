var config = require('./lib/config.js');
var pkg = require('./package.json');
var Downstagram = require('./lib/downstagram.js');
var pace = require('pace');

module.exports = function (argv) {
  var progressBar = null;

  if (argv.version) {
    showVersion();
  } else if (argv._.length === 1) {
    if (!config.get('access_token')) {
      require('./lib/setup')(config.get('client_id'), function (err, token) {
        config.set('access_token', token);
        run();
      });
    } else {
      run();
    }
  } else {
    showHelp();
    if (!argv.help) {
      process.exit(1);
    }
  }

  function run() {
    var d = new Downstagram(argv._[0], { keepMetadata: argv.metadata });
    d.start();

    d.addListener('total', function (num) {
      progressBar = pace(num);
    });

    d.addListener('fetched', function () {
      progressBar.op();
    });
  }
};

function showHelp() {
  console.log('Usage: downstagram [-m|--metadata] <username>');
}

function showVersion() {
    console.log('Downstagram v' + pkg.version);
}
