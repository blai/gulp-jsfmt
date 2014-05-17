# gulp-jsfmt

> [`gulp`](http://gulpjs.com/) task for [`jsfmt`](https://github.com/rdio/jsfmt)

## Installation
Install via [npm](https://npmjs.org/package/gulp-jsfmt):
```
npm install gulp-jsfmt --save-dev
```

## Example
```js
var gulp = require('gulp');
var jsfmt  = require('gulp-jsfmt');

gulp.task('default', function() {
  gulp.src('./**/*.js')
    .pipe(jsfmt.rewrite('_.each(a, b) -> a.forEach(b)', '_.reduce(a, b, c) -> a.reduce(b, c)'));
});
```

## License
MIT