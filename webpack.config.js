const path = require('path');
const { HotModuleReplacementPlugin } = require('webpack');
const WriteFilePlugin = require('write-file-webpack-plugin');

const context = process.cwd();
const buildDir = path.resolve(context, '.build/');

const resourceCondition = {
  include: context,
  exclude: [buildDir, /node_modules/]
};

module.exports = {
  context,
  entry: {
    'main.js': [
      'webpack-hot-middleware/client?overlay=true&path=/_build/hmr',
      require.resolve('./index')
    ]
  },
  mode: 'development',
  module: {
    rules: [
      {
        // Enforce this to run after other rules
        enforce: 'post',
        // We apply this to all files except html, css, scss, sass
        resource: [resourceCondition],
        use: [
          {
            loader: require.resolve('./utils/emitFileLoader.js'),
          }
        ]
      },
      {
        resource: [{ test: /\.js$/ }, resourceCondition],
        use: [
          {
            loader: require.resolve('babel-loader'),
            query: {
              presets: [
                ['@babel/preset-env', {
                  modules: false,
                  useBuiltIns: 'entry',
                  exclude: ['transform-regenerator']
                }],
                '@babel/preset-react'
              ],
              plugins: [
                ['babel-plugin-transform-async-to-promises', {
                  inlineHelpers: true,
                  externalHelpers: false
                }],
                ['babel-plugin-styled-components', {
                  displayName: true,
                  ssr: true,
                  minify: false
                }],
                'react-hot-loader/babel'
              ]
            }
          }
        ]
      }
    ],
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new WriteFilePlugin()
  ],
  resolve: {
    alias: {
      'scripts/app': require.resolve('./app')
    },
    symlinks: true,
    extensions: ['.js', '.json']
  },
  output: {
    path: buildDir,
    filename: '[name]',
    chunkFilename: '[name].js',
    publicPath: '/_build/'
  }
};
