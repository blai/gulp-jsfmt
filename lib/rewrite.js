'use strict';

var jsfmt = require('jsfmt');
var through = require('through2');
var BufferStreams = require('bufferstreams');

require('sugar');

module.exports = function () {
  var args = arguments;

  function fmt(buffer) {
    if (args.length > 0) {
      var contents = buffer.toString();
      args.each(function (pattern) {
        jsfmt.rewrite(contents, pattern);
      });
      return new Buffer(contents);
    }

    return buffer;
  }

  return through.obj(function (file, _, cb) {
    if (file.isBuffer()) {
      file.contents = fmt(file.contents);
    } else if (file.isStream()) {
      file.contents = file.contents.pipe(new BufferStreams(function (err, buf, cb) {
        cb(null, fmt(buf));
      }));
      return cb();
    }

    this.push(file);
    return cb();
  });
};
