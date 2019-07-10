module.exports = function (gulp, plugins, src, dest) {
    return function () {
        var stream = gulp.src(src)
            .pipe(plugins.rollup({
              plugins: [

                plugins.commonjs({
                  namedExports: {
                    'node_modules/react/index.js': [ 'Component' ],
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
                plugins.replace({
                  'process.env.NODE_ENV': JSON.stringify('development')
                }),
                plugins.rootImport({
                  root: `${__dirname}/dist`,
                  useEntry: 'prepend',
                  extensions: [ '.js', '.json' ]
                }),
                plugins.resolve({
                  browser: true,
                  extensions: [ '.js', '.json' ]
                }),
                plugins.json(),

                plugins.globals(),
                plugins.builtins(),
              ]
            }, 'umd'))
            .on('error', function(e){
              console.log(e);
              // cb();
            })
            .pipe(gulp.dest(dest))
            // .on('end', cb);
      return stream
    };
};
