const path = require('path');
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
    'main.js': require.resolve('./index'),
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
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        ]
      }
    ],
  },
  plugins: [
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
