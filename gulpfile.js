var gulp = require('gulp');
var cssimport = require('gulp-cssimport');
var cssnano = require('gulp-cssnano');
var rollup = require('gulp-better-rollup');
var sucrase = require('@sucrase/gulp-plugin');
var minify = require('gulp-minify');
var exec = require('child_process').exec;

var commonjs = require('rollup-plugin-commonjs');
var resolve = require('rollup-plugin-node-resolve');
var replace = require('rollup-plugin-replace');
var json = require('rollup-plugin-json');
var builtins = require('rollup-plugin-node-builtins');
var rootImport = require('rollup-plugin-root-import');
var globals = require('rollup-plugin-node-globals');

var browserSync = require('browser-sync');
var run = require('gulp-run');

/***

  MAIN COMMANDS TO RUN:

  `gulp bundle-dev`: Bundle everything for development
  `gulp bundle-prod`:  Bundle everything for production
  `gulp watch`: Watch files, `bundle-dev` on file change

**/

// If you want to copy this app into an Urbit ship, add pier directory here
// var urbitrc = require('./.urbitrc');

/**
  Tasks
**/

const PATHS = {
  src: './lib/src',
  dist: './lib/dist',
  previewSrc: './preview/src',
  previewDist: './preview/dist'
}


gulp.task('serve-preview', function() {
  return browserSync.init({
    server: {
      baseDir: PATHS.previewDist
    },
    notify:false,
    port: 8000
  })
});


gulp.task('css-bundle-preview', function() {
  return gulp
    .src(`${PATHS.previewSrc}/css/index.css`)
    .pipe(cssimport())
    // .pipe(cssnano())
    .pipe(gulp.dest(`${PATHS.previewDist}/css/`));
});


gulp.task('jsx-transpile-lib', function(cb) {
  return gulp.src(`${PATHS.src}/**/*.js`)
    .pipe(sucrase({
      transforms: ['jsx']
    }))
    .pipe(gulp.dest(`${PATHS.dist}`));
});


gulp.task('jsx-transpile-preview', function(cb) {
  return gulp.src(`${PATHS.previewSrc}/js/**/*.js`)
    .pipe(sucrase({
      transforms: ['jsx']
    }))
    .pipe(gulp.dest(`${PATHS.previewDist}/js`));
});


gulp.task('js-imports-lib', function(cb) {
  return gulp.src(`${PATHS.dist}/index.js`)
    .pipe(rollup({
      plugins: [
        commonjs({
          namedExports: {
            'node_modules/react/index.js': [ 'Component' ],
            'node_modules/lodash/lodash.js': ['get'],
            'node_modules/urbit-ob/dist/index.js': [
               'tierOfadd',
               'patp'
             ]
          }
        }),
        replace({
          'process.env.NODE_ENV': JSON.stringify('development')
        }),
        rootImport({
          root: `${__dirname}/${PATHS.dist}`,
          useEntry: 'prepend',
          extensions: '.js'
        }),
        json(),
        globals(),
        builtins(),
        resolve()
        ],
    }, 'umd'))
    .on('error', function(e){
      console.log(e);
      cb();
    })
    .pipe(gulp.dest(`${PATHS.dist}`))
    .on('end', cb);
});

gulp.task('js-imports-preview', function(cb) {
  return gulp.src(`${PATHS.previewDist}/js/index.js`)
    .pipe(rollup({
      plugins: [
        commonjs({
          namedExports: {
            'node_modules/react/index.js': [ 'Component' ],
            'node_modules/lodash/lodash.js': ['get'],
            'node_modules/urbit-ob/dist/index.js': [
               'tierOfadd',
               'patp'
             ]
          }
        }),
        replace({
          'process.env.NODE_ENV': JSON.stringify('development')
        }),
        rootImport({
          root: `${__dirname}/${PATHS.previewDist}/js`,
          useEntry: 'prepend',
          extensions: '.js'
        }),
        json(),
        globals(),
        builtins(),
        resolve()
        ],
    }, 'umd'))
    .on('error', function(e){
      console.log(e);
      cb();
    })
    .pipe(gulp.dest(`${PATHS.previewDist}/js`))
    .on('end', cb);
});



gulp.task('copy-json-wallet', function () {
  return gulp
    .src(`${PATHS.previewSrc}/js/sampleWallets/*.json`)
    .pipe(gulp.dest(`${PATHS.previewDist}/js/sampleWallets`));
})


gulp.task('copy-template-json', function () {
  return gulp
    .src(`${PATHS.src}/templates.json`)
    .pipe(gulp.dest(`${PATHS.dist}`));
})

gulp.task('copy-preview-html', function () {
  return gulp
    .src(`${PATHS.previewSrc}/index.html`)
    .pipe(gulp.dest(`${PATHS.previewDist}/`));
})

// gulp.task('js-minify', function () {
//   return gulp
//     .src('./dist/js/index.js')
//     .pipe(minify())
//     .pipe(gulp.dest('./dist/js/'));
// });

// copy fonts to dist folder
// gulp.task('js-minify', function () {
//   return gulp.src('./dist/js/index.js')
//     .pipe(minify())
//     .pipe(gulp.dest('./dist/js/'));
// });


// gulp.task('js-cachebust', function(cb) {
//   return Promise.resolve(
//     exec('git log', function (err, stdout, stderr) {
//       let firstLine = stdout.split("\n")[0];
//       let commitHash = firstLine.split(' ')[1].substr(0, 10);
//       let newFilename = "index-" + commitHash + "-min.js";
//
//       exec('mv ./dist/js/index-min.js ./dist/js/' + newFilename);
//     })
//   );
// })

/* This is an example function.
   If you want to actually use this, you need to pipe /dist to /web/landscape (or similar).
   Sorry this isn't documented fully.
 */
// gulp.task('urbit-copy', function () {
//   let ret = gulp.src('urbit-code/**/*');
//
//   urbitrc.URBIT_PIERS.forEach(function(pier) {
//     ret = ret.pipe(gulp.dest(path.join(pier, "web/landscape")));
//   });
//
//   return ret;
// });

gulp.task('js-bundle-lib', gulp.series(
  'copy-template-json',
  'jsx-transpile-lib',
  'js-imports-lib'
));


gulp.task('js-bundle-preview', gulp.series(
  'js-bundle-lib',
  'copy-json-wallet',
  'jsx-transpile-preview',
  'js-imports-preview'
));

// gulp.task('js-bundle-dev', gulp.series(
//   'copy-template-json',
//   'copy-json-wallet',
//   'jsx-transform',
//   'js-imports'
// ));
//
// gulp.task('js-bundle-prod', gulp.series(
//   'copy-template-json',
//   'jsx-transform',
//   'js-imports',
//   'js-minify',
//   'js-cachebust'
// ))


// gulp.task('bundle-dev',
//   gulp.series(
//     gulp.parallel(
//       'css-bundle',
//       'js-bundle-dev'
//     ),
//     // 'urbit-copy'
//   )
// );

// gulp.task('bundle-prod',
//   gulp.series(
//     gulp.parallel(
//       // 'css-bundle',
//       'js-bundle-prod',
//     ),
//     // 'urbit-copy'
//   )
// );


//
// gulp.task('watch',
//   gulp.series('default', function() {
//   gulp.watch('src/**/*.js', gulp.parallel('js-bundle-dev'));
//   // gulp.watch('src/**/*.css', gulp.parallel('css-bundle'));
//   // gulp.watch('urbit-code/**/*', gulp.parallel('urbit-copy'));
// }));


// gulp.task('run', gulp.parallel('watch', 'serve'));


gulp.task("watch-lib-js", function() {
  gulp.watch(
    `${PATHS.src}/**/*.{js,json}`,
    gulp.series("js-bundle-lib")
  );
});

gulp.task("watch-preview-js", function() {
  gulp.watch(
    `${PATHS.previewSrc}/js/**/*.{js,json}`,
    gulp.series("js-bundle-preview")
  );
});

gulp.task("watch-preview-css", function() {
  gulp.watch(
    `${PATHS.previewSrc}/css/**/*.{css}`,
    gulp.series("css-bundle-preview")
  );
});

gulp.task("watch-preview-html", function() {
  gulp.watch(
    `${PATHS.previewSrc}/*.{html}`,
    gulp.series("copy-preview-html")
  );
});


gulp.task(
  "run",
  gulp.series(
    gulp.series(
      "js-bundle-preview",
      "copy-preview-html",
      "css-bundle-preview"
    ),
    gulp.parallel(
      "watch-preview-js",
      "watch-preview-css",
      "watch-lib-js",
      "serve-preview"
    )
  )
);

gulp.task('default', gulp.series('run'));

gulp.task('bundle-prod', gulp.series('js-bundle-lib'));
