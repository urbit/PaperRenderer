module.exports = function (gulp, plugins, src, dest) {
    return function () {
        var stream = gulp
          .src(src)
          .pipe(plugins.babel({
            babelrc: false,
            extensions: ['js'],
            plugins: [
              ["@babel/plugin-proposal-class-properties"]
              ["@babel/plugin-proposal-object-rest-spread", { useBuiltIns: true }]
            ],
            exclude: [
              "node_modules/**",
              "docs/**",
              "bin/**",
              "assets/**",
            ]
          })
          .pipe(gulp.dest(dest)));
        return stream
    };
};
