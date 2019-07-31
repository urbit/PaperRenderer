module.exports = function (gulp, plugins, src, dest) {
    return function () {
        var stream = gulp.src(src)
          .pipe(plugins.sass.sync().on('error', plugins.sass.logError))
          .pipe(gulp.dest(dest));
        return stream
    };
};
