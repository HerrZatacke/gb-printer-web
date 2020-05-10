const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const setupServer = require('./setupServer');
const common = require('./webpack.common.js');

const contentOptions = {
  socketURL: 'localhost:3001',
};

module.exports = merge(common(contentOptions), {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    inline: true,
    hot: true,
    stats: {
      colors: true,
      assets: false,
      entrypoints: false,
      modules: false,
    },
    overlay: {
      warnings: false,
      errors: true,
    },
    contentBase: path.join(process.cwd(), 'src', 'assets'),
    port: 3000,
    watchContentBase: true,
    host: '0.0.0.0',
    before: setupServer,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
});
