const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { DefinePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getBranch = require('./getBranch');
const { version } = require('../package.json');

let dropboxAppKey = null;

try {
  // eslint-disable-next-line global-require
  const conf = require('../config.json');
  dropboxAppKey = conf.dropboxAppKey;
} catch (error) { /**/ }

module.exports = () => ({
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },
  entry: {
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
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'autoprefixer',
                    {},
                  ],
                  [
                    'postcss-pxtorem',
                    {
                      rootValue: 16,
                      unitPrecision: 3,
                      propList: ['*', '!border*'],
                      selectorBlackList: [],
                      replace: true,
                      mediaQuery: true,
                      minPixelValue: 2,
                    },
                  ],
                ],
              },
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
    minimizer: [
      new TerserPlugin({
        extractComments: {
          condition: /^\**!|@preserve|@license|@cc_on/i,
          filename: (fileData) => (
            // The "fileData" argument contains object with "filename", "basename", "query" and "hash"
            `${fileData.filename}.l.txt${fileData.query}`
          ),
          banner: (licenseFile) => (
            `License information can be found in ${licenseFile}`
          ),
        },
      }),
    ],
  },
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: '[fullhash:4]/[name].js',
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['js', 'jsx'],
    }),
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
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new NodePolyfillPlugin(),
    new DefinePlugin({
      VERSION: `'${version}'`,
      BRANCH: `'${getBranch()}'`,
      DROPBOX_APP_KEY: dropboxAppKey ? `'${dropboxAppKey}'` : 'null',
    }),
  ],
});
