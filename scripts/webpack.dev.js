const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const setupServer = require('./setupServer');
const common = require('./webpack.common');

module.exports = merge(common(), {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    hot: true,
    allowedHosts: 'all',
    static: {
      directory: path.join(process.cwd(), 'src', 'assets'),
    },
    port: 3000,
    host: '0.0.0.0',
    onBeforeSetupMiddleware: ({ app }) => setupServer(app),
  },
  target: 'web',
  optimization: {
    moduleIds: 'named',
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      ENV: '\'development\'',
    }),
  ],
});
