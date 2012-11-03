var fs = require('fs');

var configPath = process.env.HOME + '/.downstagramrc';
var fileExists = fs.existsSync(configPath, 'utf-8');

var config = fileExists ? JSON.parse(fs.readFileSync(configPath, 'utf-8')) : false;

module.exports = config;
