import { promises as fs } from 'fs';
import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import ESLintPlugin from 'eslint-webpack-plugin';
import setupServer from './setupServer.js';
import common from './webpack.common.js';

const config = async () => {
  const projectConfig = JSON.parse(await fs.readFile(path.join(process.cwd(), 'config.json'), { encoding: 'utf-8' }));
  const packageJSON = JSON.parse(await fs.readFile(path.join(process.cwd(), 'package.json'), { encoding: 'utf-8' }));

  return merge(await common(projectConfig, packageJSON), {
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
      setupMiddlewares: (mw, { app }) => {
        setupServer(app, projectConfig);
        return mw;
      },
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
    },
    target: 'web',
    optimization: {
      moduleIds: 'named',
    },
    plugins: [
      new ESLintPlugin({
        extensions: ['js', 'jsx', 'ts', 'tsx'],
      }),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.DefinePlugin({
        ENV: '\'development\'',
      }),
    ],
  });
};

export default config;
