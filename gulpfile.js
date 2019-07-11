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

gulp.task('css-bundle', function() {
  return gulp
    .src('src/css/index.css')
    .pipe(cssimport())
    .pipe(cssnano())
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('jsx-transform', function(cb) {
  return gulp.src('src/**/*.js')
    .pipe(sucrase({
      transforms: ['jsx']
    }))
    .pipe(gulp.dest('dist'));
});

/*
  Rollup plugin TLDR:
    - NOTE: THE ORDER OF THESE PLUGINS MATTER

    + commonJS()
      - Parses commonjs-style "require" statements as imported modules
      - Pretty standard dependency required for most NPM-sourced dependency
    + replace()
      - Replace particular strings with other things
    + rootImport ()
      - go from
          "import x from '/src/js/components/thing.js'"
            to
          "import x from '/components/thing'"  (the preferred import style)
    + resolve()
      - allows importing libraries node_modules without specifying path
          eg "import x from '/node_modules/react'" -> "import x from 'react'"
    + json()
      - loads .json files as parsed JSON objects
    + globals()
      - Complimentary library to builtins() that polyfills more node libraries
    + builtins()
      - Many modern NPM repositories are packaged for _node_ environments,
        and they use _node_ standard library primitives, like
          - fs
          - events
          - buffer
          - util
      - This plugin shims those node dependencies to work in the browser
      - WARNING: This plugin is very expensive!
        - Using a library that requires node builtin functions may
          vastly increase your build size and compile times
*/

gulp.task('js-imports', function(cb) {
  return gulp.src('dist/js/index.js')
    .pipe(rollup({
      plugins: [
        commonjs({
          namedExports: {
            'node_modules/react/index.js': [ 'Component' ],
            'node_modules/lodash/lodash.js': [
                     'map',
                     'forEach',
                     'get',
                     'set',
                     'cloneDeep',
                     'entries',
                     'reduce',
                     'filter',
                     'last',
                     'flatten',
                     'size',
                     'groupBy',
                     'head',
                     'uniq',
                     'mergeWith',
                     'chunk',
                     'some',
                     'isEmpty',
                     'isNumber',
                     'isString',
                     'isArray',
                     'isFunction',
                     'isArrayBuffer',
                     'isBoolean',
                     'isUndefined',
                     'isObject',
                     'isRegExp',
                     'isInteger',
                   ],
                   'node_modules/urbit-ob/dist/index.js': [
                     'tierOfadd',
                     'patp'
                   ],
                    'node_modules/sigil-js/dist/bundle.js': [
                     'pour'
                   ]
          }
        }),
        replace({
          'process.env.NODE_ENV': JSON.stringify('development')
        }),
        rootImport({
          root: `${__dirname}/dist/js`,
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
    .pipe(gulp.dest('./dist/js/'))
    .on('end', cb);
});

gulp.task('copy-json', function () {
  return gulp.src('./src/js/*.json')
  .pipe(gulp.dest('./dist/js/'));
})

gulp.task('copy-json', function () {
  return gulp.src('./src/js/sampleWallets/*.json')
  .pipe(gulp.dest('./dist/js/sampleWallets'));
})

gulp.task('js-minify', function () {
  return gulp.src('./dist/js/index.js')
    .pipe(minify())
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('js-cachebust', function(cb) {
  return Promise.resolve(
    exec('git log', function (err, stdout, stderr) {
      let firstLine = stdout.split("\n")[0];
      let commitHash = firstLine.split(' ')[1].substr(0, 10);
      let newFilename = "index-" + commitHash + "-min.js";

      exec('mv ./dist/js/index-min.js ./dist/js/' + newFilename);
    })
  );
})

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

gulp.task('js-bundle-dev', gulp.series('copy-json', 'jsx-transform', 'js-imports'));
gulp.task('js-bundle-prod', gulp.series('jsx-transform', 'js-imports', 'js-minify', 'js-cachebust'))

gulp.task('bundle-dev',
  gulp.series(
    gulp.parallel(
      'css-bundle',
      'js-bundle-dev'
    ),
    // 'urbit-copy'
  )
);

gulp.task('bundle-prod',
  gulp.series(
    gulp.parallel(
      // 'css-bundle',
      'js-bundle-prod',
    ),
    // 'urbit-copy'
  )
);

gulp.task('default', gulp.series('bundle-dev'));
gulp.task('watch', gulp.series('default', function() {
  gulp.watch('src/**/*.js', gulp.parallel('js-bundle-dev'));
  gulp.watch('src/**/*.css', gulp.parallel('css-bundle'));

  // gulp.watch('urbit-code/**/*', gulp.parallel('urbit-copy'));
}));
