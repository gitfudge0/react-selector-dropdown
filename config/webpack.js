const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: ['babel-polyfill', path.resolve(`${__dirname}/../src/index.js`)],
  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /.(css|scss)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html'),
    }),
  ],
  devServer: {
    historyApiFallback: true,
    disableHostCheck: true,
    contentBase: path.join(__dirname, '../dist'),
    compress: true,
    port: 9000,
    host: '127.0.0.1',
  },
  output: {
    filename: 'bundle.[hash].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};
