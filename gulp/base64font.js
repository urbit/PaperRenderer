module.exports = function(gulp, plugins, src, dest) {
  return function() {
    var stream = gulp
      .src(src)
      .pipe(
        plugins.base64({
          debug: true,
          maxImageSize: Infinity,
          extensions: ["ttf", "otf", "woff", "woff2"]
        })
      )
      .pipe(plugins.concat("_fonts.scss"))
      .pipe(gulp.dest(dest));
    return stream;
  };
};
