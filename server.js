const path = require('path');
const fs = require('fs');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const { createElement: h } = require('react');
const { renderToString } = require('react-dom/server');
const { ServerStyleSheet } = require('styled-components');

const { purgeRequireCache } = require('./utils/purgeRequireCache');
const webpackConfig = require('./webpack.config.js');
const template = fs.readFileSync('./index.html', { encoding: 'utf8' });

const app = express();

const compiler = webpack(webpackConfig);
const devMiddleware = webpackDevMiddleware(compiler, {
  index: false,
  publicPath: '/_build/'
});

purgeRequireCache(compiler);

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
  const app = require(path.join(webpackConfig.output.path, 'server/app.js'));
  const sheet = new ServerStyleSheet()
  const html = renderToString(sheet.collectStyles(h(app.default)));
  const css = sheet.getStyleTags();
  res.send(template.replace('%STYLING%', css).replace('%REACT_HTML', html));
});

app.listen(process.env.PORT || 3000, () => {
  console.log('> Let\'s go!');
});
