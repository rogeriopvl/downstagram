var fs = require('fs');
var config = {};

var configPath = process.env.HOME + '/.downstagramrc';
var fileExists = fs.existsSync(configPath, 'utf-8');

if (!fileExists) {
    var emptyConfig = {
        client_id: "7ddab0c3062e463ea63d5c0d179c0308",
        client_secret: "5fa254a44f0e42b7ac19ecd48882c0c8",
        access_token: ""
    };
    fs.writeFileSync(configPath, JSON.stringify(emptyConfig), 'utf-8');
}

config.auth = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

config.save = function(content) {
    fs.writeFileSync(configPath, JSON.stringify(content));
};

module.exports = config;
