'use strict';

var jsfmt = require('jsfmt');
var through = require('through2');
var BufferStreams = require('bufferstreams');
var fmt   = require('./fmt');
var util = require('./util');

module.exports = function() {
  var config = jsfmt.getConfig();

  return through.obj(function(file, _, cb) {
    if (file.isBuffer()) {
      file.contents = fmt(file.contents,config,jsfmt.formatJSON);
    }
    else if (file.isStream()) {
      file.contents = file.contents.pipe(new BufferStreams(function(err, buf, cb) {
        cb(null, fmt(buf,config,jsfmt.formatJSON));
      }));

    }

    this.push(file);
    return cb();
  });
};
