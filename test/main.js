var test = require('tape');
var Mockery = require('mockery');
var mockFS = require('mock-fs');
var path = require('path');
var fs = require('fs');
var InstagramMock = require('./mocks/mock-instagram-node-lib.js');
var RequestMock = require('./mocks/mock-request.js');


test('downstagram module', function (t) {
  Mockery.enable({ warnOnUnregistered: false, useCleanCache: true });
  Mockery.registerMock('instagram-node-lib', InstagramMock);
  Mockery.registerMock('request', RequestMock);

  var Downstagram = require('../lib/downstagram.js');

  mockFS({ 'media-mock.jpg': 'just a media file mock', '/tmp': {} });

  t.test('instance has start method', function (t) {
    t.plan(1);
    var d = new Downstagram('rogeriopvl', {});
    t.equals(typeof d.start, 'function');
  });

  t.test('events start, fetched and end are emitted', function (t) {
    t.plan(4);
    var d = new Downstagram('rogeriopvl', {});
    d.on('start', function (num) { t.equals(num, 2); });
    d.on('fetched', function (remaining) { t.pass(); });
    d.on('end', function () { t.pass(); });
    d.start();
  });

  t.test('error is emitted when user is not found', function (t) {
    t.plan(2);
    var d = new Downstagram('nouser', {});
    d.on('error', function (err) {
      t.ok(err instanceof Error);
      t.equals(err.message, 'User not found');
    });
    d.start();
  });

  t.test('error is emitted when user has no photos', function (t) {
    t.plan(2);
    var d = new Downstagram('emptyuser', {});
    d.on('error', function (err) {
      t.ok(err instanceof Error);
      t.equals(err.message, 'Your account doesn\'t seem to have photos');
    });
    d.start();
  });

  t.test('creates save dir and fetched files', function (t) {
    t.plan(3);
    var expectedFolderName = 'rogeriopvl_instagram_photos';

    var d = new Downstagram('rogeriopvl', {});
    d.on('end', function () {
      t.ok(fs.existsSync(expectedFolderName));
      t.ok(fs.existsSync(path.join(expectedFolderName, '1438270800.jpg')));
      t.ok(fs.existsSync(path.join(expectedFolderName, '1438270899.mp4')));
    });
    d.start();
  });

  t.test('when passing --metadata saves json files along with media', function (t) {
    t.plan(5);
    var expectedFolderName = 'rogeriopvl_instagram_photos';

    var d = new Downstagram('rogeriopvl', { metadata: true });
    d.on('end', function () {
      t.ok(fs.existsSync(expectedFolderName));
      t.ok(fs.existsSync(path.join(expectedFolderName, '1438270800.jpg')));
      t.ok(fs.existsSync(path.join(expectedFolderName, '1438270899.mp4')));
      t.ok(fs.existsSync(path.join(expectedFolderName, '1438270800.json')));
      t.ok(fs.existsSync(path.join(expectedFolderName, '1438270899.json')));
    });
    d.start();
  });

  t.test('when passing --output saves files in the custom dir', function (t) {
    t.plan(3);
    var expectedFolderPath = path.join('/tmp', 'rogeriopvl_instagram_photos');

    var d = new Downstagram('rogeriopvl', { output: '/tmp' });
    d.on('end', function () {
      t.ok(fs.existsSync(expectedFolderPath));
      t.ok(fs.existsSync(path.join(expectedFolderPath, '1438270800.jpg')));
      t.ok(fs.existsSync(path.join(expectedFolderPath, '1438270899.mp4')));
    });
    d.start();
  });
}).on('end', function () {
  mockFS.restore();
  Mockery.deregisterAll();
});
