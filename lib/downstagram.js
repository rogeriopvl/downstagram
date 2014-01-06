/**
 * Downstagram
 *
 * @author Rogério Vicente <http://rogeriopvl.com>
 * @license MIT
 */

var config = require('./config'),
    fs = require('fs'),
    url = require('url'),
    http = require('http'),
    colors = require('colors'),
    instagram = require('instagram-node-lib');

instagram.set('client_id', config.auth.client_id);
instagram.set('client_secret', config.auth.client_secret);
instagram.set('access_token', config.auth.access_token);

/**
 * Constructor
 * @param {String} username, the username to download all photos from
 * @param {Boolean} keepMetadata, whether or not to writ the metadata for each photo
 */
var Downstagram = function(username, keepMetadata){
    this.username = username;
    this.userID = 0;
    this.totalPhotos = 0;
    this.currentPercentage = 0;
    this.keepMetadata = keepMetadata;
};

/**
 * Start downstagram. Search user, and get all photos
 */
Downstagram.prototype.start = function(){
    var self = this;
    instagram.users.search({q: this.username, complete: function(users){
        self.userID = users.shift().id;
        instagram.users.info({user_id: self.userID, complete: function(data){
            self.totalPhotos = data.counts.media;
            self.fetchPhotos();
        }});
    }});
};

/**
 * Cycle through all photos and pages and download them
 * @param {Integer} maxID, id to delimit page (optional)
 */
Downstagram.prototype.fetchPhotos = function(maxID){
    var self = this;
    instagram.users.recent({
        user_id: self.userID,
        count: 100,
        max_id: typeof maxID != 'undefined' ? maxID : undefined,
        complete: function(data, pagination){
            for (var item in data){
                self.downloadFile(data[item].images.standard_resolution.url);
                if (self.keepMetadata) {
                  self.saveMetadata(data[item])
                }
            }
            if (pagination.hasOwnProperty('next_max_id')){
                self.fetchPhotos(pagination.next_max_id);
            }
        }
    });
    return;
};

Downstagram.prototype.getFolderPath = function() {
    var folderPath = this.username + '_instagram_photos';

    if (!fs.existsSync(folderPath)){
        fs.mkdirSync(folderPath);
    }

    return folderPath;
}

Downstagram.prototype.filename = function(fileURL, suffix) {
    var fileName = url.parse(fileURL).pathname.split('/').pop();
    fileName = fileName.replace(/\..+$/, suffix)
    return this.getFolderPath() + '/' + fileName;
}

/**
 * Downloads a photo with a given URL
 * @param {String} fileURL, the URL of the photo to download
 */
Downstagram.prototype.downloadFile = function(fileURL){
    var options = {
        host: url.parse(fileURL).host,
        port: 80,
        path: url.parse(fileURL).pathname
    };

    var file = fs.createWriteStream(this.filename(fileURL, '.jpg'));
    var self = this;
    var req = http.get(options, function(res){
        var content = '';
        res.on('data', function(chunk){
            file.write(chunk);
        });
        res.on('end', function(chunk){
            file.end();
            self.currentPercentage += (100/self.totalPhotos);
            process.stdout.write("\r" + Math.round(self.currentPercentage) + '% ' + self.getPercentageBar());
        });
    });

    req.on('error', function(e){
        console.log('Error on request: ' + e);
    });
    req.end();
    return;
};

Downstagram.prototype.saveMetadata = function(metadata) {
  fs.writeFile(this.filename(metadata.images.standard_resolution.url, '.json'), JSON.stringify(metadata));
}

/**
 * Builds and updates the progress bar
 */
Downstagram.prototype.getPercentageBar = function(){
    var str = '[';
    for(var i=0; i<100; i++){
        str += i <= this.currentPercentage ? '|' : '-';
    }
    str += Math.round(this.currentPercentage) >= 100 ? '] ' + 'OK'.green + '\n' : ']';
    return str;
};

module.exports = Downstagram;
