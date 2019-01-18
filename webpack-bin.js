console.log('> Building production bundle');
process.env.NODE_ENV = 'production';

const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

const compiler = webpack(webpackConfig);

compiler.run((err, stats) => {
  // Critical error
  if (err) {
    console.error(err);
    process.exit(1);
  }

  process.exit(stats.hasErrors() ? 1 : 0);
});
