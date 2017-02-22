const path = require('path');

const BUILD_DIR = './dist';
const ASSETS = '/assets';

module.exports = {
  context: path.resolve(__dirname, './build/client/src'),
  entry: {
    app: ['babel-polyfill', 'app.js'],
  },
  output: {
    path: path.resolve(__dirname, BUILD_DIR + ASSETS),
    filename: '[name].bundle.js',
    publicPath: ASSETS,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }, {
        test: /\.js$/,
        exclude: [
          /node_modules/, /bower_components/,
        ],
      }, {
        test: /\.worker\.js$/,
        loader: 'worker-loader?inline=true',
      },
    ],
  },
  devServer: {
    contentBase: path.resolve(__dirname, './build/client/'),
  },
  resolve: {
    modules: [
      path.resolve(__dirname, './build/client/src'),
      'node_modules',
    ],
    extensions: ['.js'],
  },
};
