var test = require('tape');
var path = require('path');
var concat = require('concat-stream');
var spawn = require('child_process').spawn;

var binPath = path.join(__dirname, '..', 'bin', 'downstagram');

var runBin = function (params, cb) {
  var defaultParams = [];
  var proc = spawn(binPath, defaultParams.concat(params));
  proc.stdout.pipe(concat(function (output) {
    var o = output.toString('utf8');

    proc.on('close', function (code) {
      return cb(null, o, code);
    });
  }));
};

test('spawning the bin', function (t) {
  t.test('calling with no arguments returns usage and error status code', function (t) {
    t.plan(2);
    runBin([], function (err, output, code) {
      t.ok(output.indexOf('Usage:') !== -1);
      t.notEquals(code, 0);
    });
  });

  t.test('calling with --version returns version and 0 status code', function (t) {
    t.plan(2);
    runBin(['--version'], function (err, output, code) {
      var expected = 'Downstagram v' + require('../package.json').version + '\n';
      t.equals(output, expected);
      t.equals(code, 0);
    });
  });
});
