/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { DefinePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const { basename } = require('path');
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
    modules: [
      __dirname,
      'node_modules'
    ],
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
  },
  entry: {
    main: [
      path.join(process.cwd(), 'src', 'javascript', 'index.ts'),
    ],
    remote: [
      path.join(process.cwd(), 'src', 'javascript', 'remote.ts'),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'ts-loader',
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
      title: 'Game Boy Camera Gallery',
      template: './src/assets/index.html',
      filename: 'index.html',
      chunks: ['pf', 'main'],
    }),
    new FaviconsWebpackPlugin({
      logo: './src/assets/images/favicon.png',
      inject: (htmlPlugin) => (
        basename(htmlPlugin.options.filename) === 'index.html'
      ),
      mode: 'auto',
      prefix: 'fav/',
      outputPath: 'fav/',
      favicons: {
        appName: 'GBC Gallery',
        background: '#d6d3dc',
        theme_color: '#000000',
        appleStatusBarStyle: 'black',
        start_url: '/gb-printer-web/#/gallery',
        scope: '/gb-printer-web/',
        icons: {
          android: { offset: 10 },
          appleIcon: { offset: 10 },
          windows: { offset: 10 },
          coast: false,
          yandex: false,
          appleStartup: false,
        },
      },
    }),
    new HtmlWebpackPlugin({
      title: 'Game Boy Printer Remote',
      template: './src/assets/remote.html',
      filename: 'remote.html',
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
