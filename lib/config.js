var Configstore = require('configstore');
var pkg = require('../package.json');

var config = new Configstore(pkg.name, {
  client_id: '7ddab0c3062e463ea63d5c0d179c0308',
  client_secret: '5fa254a44f0e42b7ac19ecd48882c0c8',
  access_token: ''
});

module.exports = config;
