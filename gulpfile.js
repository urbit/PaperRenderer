var gulp = require('gulp');
var cssimport = require('gulp-cssimport');
var cssnano = require('gulp-cssnano');

var rollup = require('rollup-stream');
var source = require('vinyl-source-stream');
var typescript = require('rollup-plugin-typescript');

var babel = require('rollup-plugin-babel');
var resolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var sourcemaps = require('rollup-plugin-sourcemaps');
var replace = require('rollup-plugin-replace');
var json = require('rollup-plugin-json');
var builtins = require('rollup-plugin-node-builtins');
var rootImport = require('rollup-plugin-root-import');
var globals = require('rollup-plugin-node-globals');
var uglify = require('rollup-plugin-uglify-es');

/***
  End main config options
***/

gulp.task('bundle-css', function() {
  return gulp
    .src('src/styles/index.css')
    .pipe(cssimport())
    .pipe(cssnano())
    .pipe(gulp.dest('./public/css'));
});

var cache;

gulp.task('bundle-js', function(cb) {
  return rollup({
    input: './src/index.js',
    cache: cache,
    format: 'cjs',
    plugins: [
      json(),
      resolve({
        browser: true,
      }),
      babel({
        ignore: ['src/vendor/**', 'node_modules/**'],
        plugins: ['babel-plugin-lodash']
      }),
      commonjs({
        namedExports: {
          'node_modules/urbit-keygen/dist/index.js': [
            'fullWalletFromSeed'
          ],
          'node_modules/react/index.js': [
            'Component'
          ],
          'node_modules/sigil-js/dist/bundle.js': [
            'pour'
          ],
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
          ]
        }
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development')
      }),
      rootImport({
        root: `${__dirname}/src`,
        useEntry: 'prepend',
        extensions: '.js'
      }),
      // typescript(),
      globals(),
      builtins(),

      // sourcemaps(),
      uglify(),
    ]
  }).on('bundle', function(bundle) {
    if (!cache) {
      cache = bundle;
    }
   })
    .on('error', function(e){
      console.log(e);
      cb();
    })
    .pipe(source('index.js'))
    .pipe(gulp.dest('./public/js/'))
    .on('end', cb);
});

gulp.task('default', gulp.series(
  gulp.parallel('bundle-js'),
));


gulp.task('watch', gulp.series('default', function() {
  gulp.watch('src/**/*.js', gulp.parallel('bundle-js'));
}));



gulp.task('bundle-prod', function(cb) {
  return rollup({
  input: './src/PaperCollateralRenderer.js',
  format: 'cjs',
  plugins: [
    resolve({
      browser: true,
    }),
    babel({
      ignore: ['src/vendor/**', 'node_modules/**'],
      plugins: ['babel-plugin-lodash']
    }),
    commonjs({
      namedExports: {
        'node_modules/urbit-keygen/dist/index.js': [
          'fullWalletFromSeed'
        ],
        'node_modules/react/index.js': [
          'Component'
        ],
        'node_modules/sigil-js/dist/bundle.js': [
          'pour'
        ],
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
        ]
      }
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    rootImport({
      root: `${__dirname}/src`,
      useEntry: 'prepend',
      extensions: '.js'
    }),
    json(),
    globals(),
    builtins(),
    uglify(),
  ]
}).on('bundle', function(bundle) {
 })
  .on('error', function(e){
    console.log(e);
    cb();
  })
  .pipe(source('PaperCollateralRenderer.js'))
  .pipe(gulp.dest('./dist/'))
  .on('end', cb);
});
