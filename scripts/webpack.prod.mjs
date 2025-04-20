import { promises as fs } from 'fs';
import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import CopyPlugin from 'copy-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import common from './webpack.common.js';

const config = async () => {
  const projectConfig = JSON.parse(await fs.readFile(path.join(process.cwd(), 'config.json'), { encoding: 'utf-8' }));
  const packageJSON = JSON.parse(await fs.readFile(path.join(process.cwd(), 'package.json'), { encoding: 'utf-8' }));

  return merge(await common(projectConfig, packageJSON), {
    mode: 'production',
    devtool: false,
    stats: 'errors-warnings',
    performance: {
      maxEntrypointSize: 300000,
      maxAssetSize: 300000,
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: path.join(process.cwd(), 'src', 'assets', 'env-pages.json'),
            to: path.join(process.cwd(), 'dist', 'env.json'),
          },
        ],
      }),
      new webpack.DefinePlugin({
        ENV: '\'production\'',
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'bundles.html',
        openAnalyzer: false,
      }),
    ],
  });
};

export default config;
