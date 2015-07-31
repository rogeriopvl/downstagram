var test = require('tape');
var Mockery = require('mockery');
var mockFS = require('mock-fs');
var InstagramMock = require('./mock-instagram-node-lib.js');


test('downstagram module', function (t) {
  Mockery.enable({ warnOnUnregistered: false });
  Mockery.registerMock('instagram-node-lib', InstagramMock);

  var Downstagram = require('../lib/downstagram.js');

  mockFS();

  t.test('instance has start method', function (t) {
    t.plan(1);
    var d = new Downstagram('rogeriopvl', {});
    t.equals(typeof d.start, 'function');
  });

  t.test('events start and fetched emitted', function (t) {
    t.plan(3);
    var d = new Downstagram('rogeriopvl', {});
    d.on('start', function (num) { t.equals(num, 2); });
    d.on('fetched', function () { t.pass(); });
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
}).on('end', function () {
  mockFS.restore();
  Mockery.deregisterAll();
});
