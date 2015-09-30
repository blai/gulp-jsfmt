'use strict';

/*jshint multistr:true*/
/*globals describe,it */

var es = require('event-stream');
var through = require('through2');
var gutil = require('gulp-util');
var jsfmt = require('../');

describe('formatJSON', function() {

  var unformattedJSON = '{\
 "fieldname":    "value",\
     "second field"   :[1,2,3,4]\
  }';
  var formattedJSON = '{\n  "fieldname": "value",\n  "second field": [1, 2, 3, 4]\n}';

  it('should work in buffer mode with json', function(done) {
    var stream = jsfmt.formatJSON(unformattedJSON),
      n = 0;

    stream.pipe(through.obj(function(file, _, cb) {
      file.contents.toString().should.eql(formattedJSON);
      this.push(file);
      n++;
      cb();
    }, function(cb) {
      n.should.eql(1);
      cb();
      done();
    }));

    stream.write(new gutil.File({
      contents: new Buffer(unformattedJSON)
    }));
    stream.end();
  });

  it('should work in stream mode with json', function(done) {
    var stream = jsfmt.formatJSON();

    stream.once('data', function(file) {
      file.isStream().should.eql(true);
      file.contents.pipe(es.wait(function(err, data) {
        data.toString().should.eql(formattedJSON);
        done();
      }));
    });

    stream.write(new gutil.File({
      contents: es.readArray([unformattedJSON])
    }));
  });

});
