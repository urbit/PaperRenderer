module.exports = function (gulp, plugins, src, dest) {
    return function () {
        var stream = gulp.src(src)
          .pipe(plugins.gzip({ append: true }))
          .pipe(gulp.dest(dest));
        return stream
    };
};
