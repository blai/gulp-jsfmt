'use strict';

var fs = require('fs');
var path = require('path');
var es = require('event-stream');
var through = require('through2');
var gutil = require('gulp-util');
var jsfmt = require('../');

describe('format', function() {

  var unformattedCode = 'var func = function(test){console.log( test );};',
    formattedCode = 'var func = function(test) {\n  console.log(test);\n};';
  var unformattedImportCode = 'import views from \'views\'',
    formattedImportCode = 'import views from \'views\'';

  it('should work in buffer mode', function(done) {
    var stream = jsfmt.format(unformattedCode),
      n = 0;

    stream.pipe(through.obj(function(file, _, cb) {
      file.contents.toString().should.eql(formattedCode);
      this.push(file);
      n++;
      cb();
    }, function(cb) {
      n.should.eql(1)
      cb();
      done();
    }));

    stream.write(new gutil.File({
      contents: new Buffer(unformattedCode)
    }));
    stream.end();
  });

  it('should work in stream mode', function(done) {
    var stream = jsfmt.format();

    stream.once('data', function(file) {
      file.isStream().should.eql(true);
      file.contents.pipe(es.wait(function(err, data) {
        data.toString().should.eql(formattedCode);
        done();
      }))
    });

    stream.write(new gutil.File({
      contents: es.readArray([unformattedCode])
    }));
  });
  
  it('should not error on an import statement', function(done) {
    var stream = jsfmt.format(unformattedImportCode),
      n = 0;

    stream.pipe(through.obj(function(file, _, cb) {
      file.contents.toString().should.eql(formattedImportCode);
      this.push(file);
      n++;
      cb();
    }, function(cb) {
      n.should.eql(1)
      cb();
      done();
    }));

    stream.write(new gutil.File({
      contents: new Buffer(unformattedImportCode)
    }));
    stream.end();
  });

});
