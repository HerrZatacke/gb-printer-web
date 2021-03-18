const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const pxtorem = require('postcss-pxtorem');
const autoprefixer = require('autoprefixer');
const getBranch = require('./getBranch');
const { version } = require('../package');

let dropboxAppKey = null;

try {
  // eslint-disable-next-line global-require
  const conf = require('../config');
  dropboxAppKey = conf.dropboxAppKey;
} catch (error) { /**/ }

module.exports = () => ({
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },
  entry: {
    pf: [
      'babel-polyfill/dist/polyfill',
      'whatwg-fetch',
    ],
    main: [
      path.join(process.cwd(), 'src', 'javascript', 'index.js'),
    ],
    remote: [
      path.join(process.cwd(), 'src', 'javascript', 'remote.js'),
    ],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        include: path.join(process.cwd(), 'src'),
      },
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
        include: path.join(process.cwd(), 'src'),
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: true,
              reload: 'all', // Fallback
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                pxtorem({
                  rootValue: 16,
                  unitPrecision: 3,
                  propList: ['*', '!border*'],
                  selectorBlackList: [],
                  replace: true,
                  mediaQuery: true,
                  minPixelValue: 2,
                }),
                autoprefixer(),
              ],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                sourceMap: true,
                includePaths: [path.join(process.cwd(), 'src')],
              },
            },
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                path.join(process.cwd(), 'src', 'scss', 'auto-imports', '**', '*.scss'),
              ],
            },
          },
        ],
      },
      {
        test: /\.(txt|md)$/i,
        use: 'raw-loader',
      },
    ],
  },
  optimization: {
    splitChunks: {
      automaticNameDelimiter: '/',
      cacheGroups: {
        v: {
          test: /[\\/]node_modules[\\/]/,
        },
      },
    },
  },
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: '[hash:4]/[name].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Gameboy Printer Web',
      template: './src/assets/index.html',
      filename: 'index.html',
      favicon: './src/assets/images/favicon.png',
      chunks: ['pf', 'main'],
    }),
    new HtmlWebpackPlugin({
      title: 'Gameboy Printer Remote',
      template: './src/assets/remote.html',
      filename: 'remote.html',
      favicon: './src/assets/images/favicon.png',
      chunks: ['pf', 'remote'],
    }),
    new DefinePlugin({
      VERSION: `'${version}'`,
      BRANCH: `'${getBranch()}'`,
      DROPBOX_APP_KEY: dropboxAppKey ? `'${dropboxAppKey}'` : 'null',
    }),
  ],
});
