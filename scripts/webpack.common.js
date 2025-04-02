import path, { basename } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import getBranch from './getBranch/index.js';
import packageJSON from '../package.json' assert { type: 'json' };

const { version } = packageJSON;

const config = async () => {
  let dropboxAppKey = null;
  try {
    const { default: conf } = await import('../config.json', { assert: { type: 'json' } });
    dropboxAppKey = conf.dropboxAppKey;
  } catch (error) {
    console.error({ error });
  }

  return ({
    resolve: {
      extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
      conditionNames: ['mui-modern', 'webpack', 'browser', 'module', 'import'],
    },
    entry: {
      main: [
        path.join(process.cwd(), 'src', 'javascript', 'index.ts'),
      ],
      remote: [
        path.join(process.cwd(), 'src', 'javascript', 'remote.ts'),
      ],
      db: [
        path.join(process.cwd(), 'src', 'javascript', 'db.ts'),
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
      new HtmlWebpackPlugin({
        title: 'Game Boy Printer Database',
        template: './src/assets/db.html',
        filename: 'db.html',
        chunks: ['pf', 'db'],
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new NodePolyfillPlugin(),
      new webpack.DefinePlugin({
        VERSION: `'${version}'`,
        BRANCH: `'${getBranch()}'`,
        DROPBOX_APP_KEY: dropboxAppKey ? `'${dropboxAppKey}'` : 'null',
      }),
    ],
  });
};

export default config;
