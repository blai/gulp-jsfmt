'use strict';

var fs = require('fs');
var path = require('path');
var es = require('event-stream');
var through = require('through2');
var gutil = require('gulp-util');
var jsfmt = require('../');

describe('search', function () {
  it('should work in buffer mode', function (done) {
    var stream = jsfmt.format();
    var s = 'var func = function(test){console.log( test );};';
    var n = 0;
    stream.pipe(through.obj(function (file, _, cb) {
      file.contents.toString().should.eql('var func = function(test) {\n  console.log(test);\n};');
      this.push(file);
      n++;
      cb();
    }, function (cb) {
      n.should.eql(1)
      cb();
      done();
    }));

    stream.write(new gutil.File({
      contents: new Buffer(s)
    }));
    stream.end();
  });

  it('should work in stream mode', function (done) {
    var stream = jsfmt.format();
    stream.once('data', function (file) {
      file.isStream().should.eql(true);
      file.contents.pipe(es.wait(function (err, data) {
        data.should.eql('var func = function(test) {\n  console.log(test);\n};');
        done();
      }))
    });
    stream.write(new gutil.File({
      contents: es.readArray(['var func = function(test) {\n  console.log(test);\n};'])
    }));
  });

});
