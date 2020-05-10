const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const contentOptions = {
  socketURL: 'localhost:81',
};

module.exports = merge(common(contentOptions), {
  mode: 'production',
  devtool: false,
});
