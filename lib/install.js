#!/usr/bin/env node

var fs = require('fs'),
    configPath = process.env.HOME + '/.downstagramrc';

if (!fs.existsSync(configPath, 'utf-8')){
    var emptyConfig = {
        auth: {
            client_id: "",
            client_secret: "",
            access_token: ""
        }
    };
    fs.writeFileSync(configPath, JSON.stringify(emptyConfig), 'utf-8');

    console.log('Config file created.');
}
else{
    console.log('Config file already exists. Keeping it.');
}
