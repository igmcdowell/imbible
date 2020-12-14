const path = require('path');
const webpack = require('webpack');

const merge = require('webpack-merge');
const common = require('./webpack.common.cjs');

module.exports = merge.merge(common, {
  mode: 'production',
  // module: {
  //   rules: [
  //     {
  //       test: /\.css$/,
  //     },
  //   ],
  // },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'imbible',
    libraryTarget: 'umd',
  },
});
