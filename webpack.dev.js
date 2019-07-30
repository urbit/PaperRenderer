const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path')

const port = process.env.PORT || 3000;

console.log(port)

const config = {
  mode: 'development',
  entry: {
    app: `./preview/src/js/index.js`,
  },
  output: {
    path: __dirname + '/preview/dist',
    filename: 'index.js',
    // library: libraryName,
    libraryTarget: 'umd',
    // umdNamedDefine: true,
    // globalObject: "typeof self !== 'undefined' ? self : this"
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        options: {
          presets: ['@babel/preset-react']
        }
      },
      // {
      //   test: /\.css$/,
      //   use: [
      //     {
      //       loader: 'style-loader',
      //     },
      //     {
      //       loader: 'css-loader',
      //       options: {
      //         modules: true,
      //         localsConvention: 'camelCase',
      //         sourceMap: true,
      //       },
      //     },
      //   ],
      // },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: `preview/src/index.html`
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'preview/dist'),
    index: 'index.html',
    host: 'localhost',
    port: port,
    historyApiFallback: true,
    hot: true,
    open: true,
  },
};

module.exports = config;
