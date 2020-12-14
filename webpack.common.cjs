const path = require('path');

// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
// const smp = new SpeedMeasurePlugin();

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

// module.exports = smp.wrap({
module.exports = {
  entry: './src/react/main.tsx',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        // include: path.resolve(__dirname, 'src'),
        use: [
          'style-loader',
          'css-loader',
          // {
          //   loader: 'typings-for-css-modules-loader',
          //   options: {
          //     importLoaders: 1,
          //     module: true,
          //     localIdentName: '[local]--[hash:base64:5]',
          //     namedExport: true,
          //     camelCase: true,
          //     sourceMap: true,
          //   },
          // }
        ],
      },
      {
        test: /\.tsx?$/,
        use: [
          {loader: 'cache-loader'},
          {
            loader: 'thread-loader',
            options: {
              // there should be 1 cpu for the fork-ts-checker-webpack-plugin
              workers: require('os').cpus().length - 1,
            },
          },
          {
            loader: 'ts-loader',
            options: {
              happyPackMode: true, // IMPORTANT! use happyPackMode mode to speed-up compilation and reduce errors reported to webpack
            },
          },
        ],
        exclude: /node_modules/,
      },

    ],
  },
  plugins: [new ForkTsCheckerWebpackPlugin()],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'imbible',
    libraryTarget: 'umd',
  },
}
// });