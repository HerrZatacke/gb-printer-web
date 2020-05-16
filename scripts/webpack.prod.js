const webpack = require('webpack');
const merge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const common = require('./webpack.common.js');

module.exports = merge(common(), {
  mode: 'production',
  devtool: false,
  plugins: [
    new webpack.DefinePlugin({
      ENV: '\'production\'',
    }),
    new BundleAnalyzerPlugin(),
  ],
});
