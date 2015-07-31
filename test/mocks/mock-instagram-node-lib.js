var userSearchResponseOK = [
  {
    username: 'rogeriopvl',
    first_name: 'Rogerio',
    profile_picture: 'foo',
    id: '13',
    last_name: 'Vicente'
  }
];

var userSearchResponseEmpty = [
  {
    username: 'emptyuser',
    first_name: 'empty',
    profile_picture: 'foo',
    id: '42',
    last_name: 'void'
  }
];

var userRecentResponseOK = [
  {
    type: 'image' ,
    created_time: '1438270800',
    images: {
      standard_resolution: { url: 'http://foobar.image' }
    }
  },
  {
    type: 'video' ,
    created_time: '1438270899',
    videos: {
      standard_resolution: { url: 'http://foobar.video' }
    }
  }
];

module.exports = {
  set: function () { return true; },
  users: {
    search: function (opts) {
      if (opts.q === 'nouser') { return opts.complete([]); }
      if (opts.q === 'emptyuser') { return opts.complete(userSearchResponseEmpty); }
      return opts.complete(userSearchResponseOK);
    },
    info: function (opts) {
      // lets assume user id: 42 has no photos
      if (opts.user_id === '42') { return opts.complete({ counts: { media: 0 }}); }
      return opts.complete({ counts: { media: 2 }});
    },
    recent: function (opts) {
      return opts.complete(userRecentResponseOK, {})
    }
  }
};
