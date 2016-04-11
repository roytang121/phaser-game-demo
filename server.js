var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var path = require('path');

const PORT = process.env.PORT || 3000;
const API_ROOT = PORT + 1;

new WebpackDevServer(webpack(config), {
  // proxy: {
  //   '*': 'http://localhost:3001/'
  // }
  publicPath: path.resolve('/static/'),
  hot: false,
  historyApiFallback: true,
  contentBase: path.resolve('./static'),
  stats: { colors: true, watch: true }
}).listen(3000, 'localhost', function (err, result) {
  if (err) {
    return console.log(err);
  }

  console.log('Listening at http://localhost:3000/');
});
