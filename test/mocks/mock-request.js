var fs = require('fs');

module.exports = function (opts) {
  return fs.createReadStream('media-mock.jpg');
};
