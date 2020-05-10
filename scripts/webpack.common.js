const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const pxtorem = require('postcss-pxtorem');
const autoprefixer = require('autoprefixer');
const { projectConfig } = require('../package.json');
const jsonScss = require('./jsonScss');

module.exports = ({
  socketURL,
}) => ({
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },
  entry: {
    main: [
      path.join(process.cwd(), 'src', 'javascript', 'index.js'),
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
                jsonScss({
                  config: projectConfig,
                }),
                path.join(process.cwd(), 'src', 'scss', 'auto-imports', '**', '*.scss'),
              ],
            },
          },
        ],
      },
    ],
  },
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: '[name].bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Gameboy Printer Web',
      socketURL,
      template: './src/assets/index.html',
      filename: 'index.html',
      chunks: ['main'],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new webpack.DefinePlugin({
      CONFIG: JSON.stringify(projectConfig),
    }),
  ],
});
