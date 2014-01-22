# Downstragram

## About

Downstagram is a simple command line tool to download and backup all your [Instagram][0] photos.

## Install

    npm install -g downstagram

## First run / OAuth Setup

After installation, Downstagram creates a configuration file in your home directory:

    ~/.downstagram

The file has the following fields and structure:

    {
        "auth": {
            "client_id": "xxx",
            "client_secret": "xxx",
            "access_token": "<will be set after oauth setup>"
        }
    }

On the first run, Downstagram runs the OAuth setup. The browser will open up with Instagram's authorization page. Just accept the authorization request and copy paste the resulting access token into the terminal window.

After this step, Downstagram is ready to backup your photos. Just run the command with your username and it's done.


### Usage

    downstagram [-m] <username>

        -m | --metadata     (optional) Also download a json file with all photo's metadata
        -v | --version      show Downstagram's version
        -h | --help         show help info

## Development

This project uses `master` branch for development. So if you want to hack on the code, it's suggested that start from a tag commit.

## License

Copyright (c) 2012 Rogério Vicente

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[0]: http://instagram.com
