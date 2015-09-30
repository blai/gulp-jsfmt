'use strict';

module.exports = function fmt(buffer,config,formatter) {
  var contents = buffer.toString(),
  formattedContents;

  formattedContents = formatter(contents, config);

  return new Buffer(formattedContents.toString());
};
