const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const contentOptions = {
  socketURL: 'localhost:3001',
};

module.exports = merge(common(contentOptions), {
  mode: 'production',
  devtool: false,
});
