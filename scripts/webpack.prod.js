const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const common = require('./webpack.common.js');

module.exports = merge(common(), {
  mode: 'production',
  devtool: false,
  stats: 'errors-warnings',
  performance: {
    maxEntrypointSize: 300000,
    maxAssetSize: 300000,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[hash:4]/[name].css',
      chunkFilename: '[id].css',
    }),
    new webpack.DefinePlugin({
      ENV: '\'production\'',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundles.html',
      openAnalyzer: false,
    }),
  ],
});
