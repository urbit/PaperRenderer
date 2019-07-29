module.exports = function (gulp, plugins, src, dest) {
  return function () {
    var stream = gulp
      .src(src)
      .pipe(plugins.rollup({
        plugins: [
          // Applies object rest/spread syntax polyfill
          // plugins.babel({
          //   babelrc: false,
          //   extensions: ['js'],
          //   plugins: [
          //     ["@babel/plugin-proposal-object-rest-spread", { useBuiltIns: true }]
          //   ],
          //   exclude: [
          //     "node_modules/**",
          //     "docs/**",
          //     "bin/**",
          //     "assets/**",
          //   ]
          // }),
          // plugins.json(),
          plugins.commonjs({
            // exclude: ['templates.json'],
            namedExports: {
              // 'node_modules/urbit-keygen/dist/index.js': [
              // 'fullWalletFromSeed'
              // ],
              'node_modules/react/index.js': [
                'Component'
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
          plugins.json(),
          plugins.replace({
            'process.env.NODE_ENV': JSON.stringify('development')
          }),
          plugins.rootImport({
            root: `${__dirname}/dist`,
            useEntry: 'prepend',
            extensions: ['.js']
          }),

          plugins.globals(),
          plugins.builtins(),
          plugins.resolve(),
        ]
      }, 'cjs'))
      .on('error', function(e){
        console.log(e);
        // cb();
      })
      .pipe(gulp.dest(dest))
      // .on('end', cb);
  return stream
  };
};
