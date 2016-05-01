var webpack = require('webpack');
// var WebpackDevServer = require('webpack-dev-server');
var wdsMiddleware = require('webpack-dev-middleware');
var config = require('./webpack.config');
var path = require('path');
var express = require('express');
var compression = require('compression');
// var https = require('https');
// var http = require('http');
var fs = require('fs');

const PORT = process.env.PORT || 3000;
const API_ROOT = PORT + 1;

var app = express();
app.use(compression());
app.use(express.static(path.join(__dirname, 'static')));


app.use(wdsMiddleware(webpack(config), {
  // proxy: {
  //   '*': 'http://localhost:3001/'
  // }
  publicPath: path.resolve('/static/'),
  hot: false,
  historyApiFallback: true,
  contentBase: path.resolve('./static'),
  stats: { colors: true, watch: true }
}))

// var sslOptions = {
//   key: fs.readFileSync(path.resolve('./ssl/server.key')),
//   cert: fs.readFileSync(path.resolve('./ssl/server.crt'))
// }


app.listen(3000, function (err) {
  if (err) {
    return console.log(err);
  }

  console.log('Listening at http://localhost:3000/');
});
