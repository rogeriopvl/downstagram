# Downstragram

## About

Downstagram is a simple command line tool to download and backup all your [Instagram][0] photos.

## Install

    npm install -g downstagram

## Configure

After installation, Downstagram creates a configuration file in your home directory:

    ~/.downstagram

The file has the following fields and structure:

    {
        "auth": {
            "client_id": "INSERT_HERE",
            "client_secret": "INSERT_HERE",
            "access_token": "INSERT_HERE"
        }
    }

You must change this files with your own values or Downstagram won't work.

### How do I get these values?

To get the values asked in the config file, you need to go to the [Instagram developers page][1] and register a new application. All steps are explained in the website. This will get you the `cliend_id` and the `client_secret` values.

To get the access token you need to build the follwing URL:

    https://instagram.com/oauth/authorize/?client_id=<CLIENT_ID>&redirect_uri=<ANY_URL>&response_type=token

Place your `client_id` in the URL, and a URL to any website (i.e http://google.com).

Copy paste this URL into your browser and log in to Instagram. After this, Instagram will redirect you to the URL you specified, with the access token appended. Copy the token and paste it into your configuration file. And (finally!) you're done.

### Usage

    downstagram <username>

## Development

This project uses `master` branch for development. So if you want to hack on the code, it's suggested that start from a tag commit.

## License

Copyright (c) 2012 Rogério Vicente

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[0]: http://instagram.com
[1]: http://instagram.com/developers
