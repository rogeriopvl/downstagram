var config = require('./config'),
    fs = require('fs'),
    url = require('url'),
    http = require('http'),
    colors = require('colors'),
    instagram = require('instagram-node-lib');

instagram.set('client_id', config.auth.client_id);
instagram.set('client_secret', config.auth.client_secret);
instagram.set('access_token', config.auth.access_token);

var Downloadstagram = function(){
    this.totalPhotos = 0;
    this.currentPercentage = 0;
};

Downloadstagram.prototype.start = function(){
    var self = this;
    instagram.users.info({user_id: 30663989, complete: function(data){
        self.totalPhotos = data.counts.media;
        self.fetchPhotos();
    }});
};

Downloadstagram.prototype.fetchPhotos = function(maxID){
    var self = this;
    instagram.users.recent({
        user_id: 30663989,
        count: 100,
        max_id: typeof maxID != 'undefined' ? maxID : undefined,
        complete: function(data, pagination){
            for (item in data){
                self.downloadFile(data[item].images.standard_resolution.url);
            }
            if (pagination.hasOwnProperty('next_max_id')){
                self.fetchPhotos(pagination.next_max_id);
            }
        }
    });
    return;
};

Downloadstagram.prototype.downloadFile = function(fileURL){
    //console.log('Downloading: ' + fileURL);
    var options = {
        host: url.parse(fileURL).host,
        port: 80,
        path: url.parse(fileURL).pathname
    };

    var fileName = url.parse(fileURL).pathname.split('/').pop();
    var file = fs.createWriteStream('photos/'+ fileName);
    var self = this;
    var req = http.get(options, function(res){
        var content = '';
        res.on('data', function(chunk){
            file.write(chunk);
        });
        res.on('end', function(chunk){
            file.end();
            //console.log('Downloaded and saved photo: ' + fileName);
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

Downloadstagram.prototype.getPercentageBar = function(){
    var str = '[';
    for(var i=0; i<100; i++){
        str += i <= this.currentPercentage ? '|' : '-';
    }
    str += Math.round(this.currentPercentage) >= 100 ? '] ' + 'OK'.green + '\n' : ']';
    return str;
};

var ds = new Downloadstagram();
ds.start();
