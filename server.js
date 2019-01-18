const path = require('path');
const fs = require('fs');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const { createElement: h } = require('react');
const { renderToString } = require('react-dom/server');

const webpackConfig = require('./webpack.config.js');
const template = fs.readFileSync('./index.html', { encoding: 'utf8' });

const app = express();

const compiler = webpack(webpackConfig);
const devMiddleware = webpackDevMiddleware(compiler, {
  index: false,
  publicPath: '/_build/'
});

let isValid = false;
const waitUntilValid = new Promise(resolve => {
  devMiddleware.waitUntilValid(() => {
    isValid = true;
    resolve()
  });
});

app.use(devMiddleware);

app.use((req, res, next) => {
  if (isValid) {
    return next();
  }

  waitUntilValid.then(() => next());
});

app.get('*', (req, res) => {
  // const App = require(path.join(webpackConfig.output.path, 'main.js'));
  const html = '' /* renderToString(h(App)); */
  res.send(template.replace('%REACT_HTML', html));
});

app.listen(process.env.PORT || 3000, () => {
  console.log('> Let\'s go!');
});