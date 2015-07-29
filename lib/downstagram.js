var fs = require('fs');
var path = require('path');
var request = require('request');
var inherits = require('inherits');
var Instagram = require('instagram-node-lib');
var EventEmitter = require('events').EventEmitter;
var config = require('./config');

module.exports = Downstagram;
inherits(Downstagram, EventEmitter);

function Downstagram(username, opts) {
  this._userID = 0;
  this._totalPhotos = 0;
  this._username = username;
  this._opts = opts || {};

  opts.output = opts.output || '.'; // default to current dir
  this._FOLDER_NAME = this._username + '_instagram_photos';
  this._FOLDER_PATH = path.join(opts.output, this._FOLDER_NAME);

  Instagram.set('client_id', config.get('client_id'));
  Instagram.set('client_secret', config.get('client_secret'));
  Instagram.set('access_token', config.get('access_token'));
};

/**
 * Start downstagram. Search user, and get all photos
 */
Downstagram.prototype.start = function () {
  var self = this;
  Instagram.users.search({ q: this._username, complete: function (users) {
    self._userID = users.shift().id;

    Instagram.users.info({ user_id: self._userID, complete: function (data) {
      self._totalPhotos = data.counts.media || 0;
      if (!self._totalPhotos) {
        console.log('Your account doesn\'t seem to have photos');
        process.exit(0);
      }

      self.emit('total', self._totalPhotos);

      self._createFolder();
      self._fetchPhotos();
    }});
  }});
};

Downstagram.prototype._fetchPhotos = function (maxID) {
  var self = this;
  Instagram.users.recent({
    user_id: self._userID,
    count: 100,
    max_id: typeof maxID != 'undefined' ? maxID : undefined,
      complete: function (data, pagination) {
      for (var item in data) {
        var itemURL, itemExt;
        if (data[item].type === 'image') {
          itemURL = data[item].images.standard_resolution.url;
        } else {
          itemURL = data[item].videos.standard_resolution.url;
          itemExt = '.mp4';
        }

        var newFileName = data[item].created_time;

        self._downloadFile(itemURL, self._filename(newFileName, itemExt));
        if (self._opts.keepMetadata) {
          self._saveMetadata(data[item]);
        }
      }
      if (pagination.hasOwnProperty('next_max_id')) {
        self._fetchPhotos(pagination.next_max_id);
      }
    }
  });
  return;
};

Downstagram.prototype._createFolder = function () {
  if (!fs.existsSync(this._FOLDER_PATH)) {
    fs.mkdirSync(this._FOLDER_PATH);
  }
  return;
};

Downstagram.prototype._filename = function (name, extension) {
  var fileName = name + (extension ? extension : '.jpg');
  return path.join(this._FOLDER_PATH, fileName);
};

Downstagram.prototype._downloadFile = function (fileURL, destPath) {
  var self = this;
  var options = {
    uri: fileURL,
    method: 'GET',
    encoding: null
  };

  request(options)
  .pipe(fs.createWriteStream(destPath))
  .on('close', function () {
    self.emit('fetched');
  });
  return;
};

Downstagram.prototype._saveMetadata = function (metadata) {
  fs.writeFile(
    this._filename(metadata.created_time, '.json'),
    JSON.stringify(metadata)
  );
};
