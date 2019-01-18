const path = require('path');
const { HotModuleReplacementPlugin } = require('webpack');
const WriteFilePlugin = require('write-file-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV !== 'production';
const context = process.cwd();
const buildDir = path.resolve(context, '.build/');

console.log({ isDev });

const resourceCondition = {
  include: context,
  exclude: [buildDir, /node_modules/]
};

module.exports = {
  context,
  entry: {
    'main.js': [
      isDev && 'webpack-hot-middleware/client?overlay=true&path=/_build/hmr',
      require.resolve('./index')
    ].filter(Boolean)
  },
  mode: isDev ? 'development' : 'production',
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
                isDev && 'react-hot-loader/babel'
              ].filter(Boolean)
            }
          }
        ]
      }
    ],
  },
  plugins: [
    isDev && new HotModuleReplacementPlugin(),
    new WriteFilePlugin()
  ].filter(Boolean),
  resolve: {
    alias: {
      'scripts/app': require.resolve('./app')
    },
    symlinks: true,
    extensions: ['.js', '.json']
  },
  optimization: isDev ? {} : {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true
      })
    ]
  },
  output: {
    path: buildDir,
    filename: '[name]',
    chunkFilename: '[name].js',
    publicPath: '/_build/'
  }
};
