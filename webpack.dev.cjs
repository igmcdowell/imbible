const path = require('path');
const webpack = require('webpack');

const merge = require('webpack-merge');
const common = require('./webpack.common.cjs');

module.exports = merge.merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dev'),
    library: 'imbible',
    libraryTarget: 'umd',
  },
});
