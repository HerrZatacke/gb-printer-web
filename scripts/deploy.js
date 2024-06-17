/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const walkdir = require('walkdir');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const copyAndGZ = require('./copyAndGZ');
const conf = require('../config.json');
const { output: { path: outputPath } } = require('./webpack.prod');

if (!conf || !conf.deploy || !conf.deploy.dir) {
  process.exit(0);
}

const { dir, gzip } = conf.deploy;

const coypFunc = gzip ? copyAndGZ : fs.copyFile;

rimraf(`${dir}/*`, {}, () => {
  const wd = walkdir(outputPath);

  const ignored = [
    '.git',
    'bundles.html',
    'data_w.zip',
    'env.json',
  ];

  wd.on('file', (filePath, stats) => {
    const fileName = path.basename(filePath);
    const destination = path.join(dir, path.relative(outputPath, filePath));

    const relFilePath = path.relative(outputPath, filePath);
    const posixRelFilePath = relFilePath.split(path.sep).join(path.posix.sep);

    // Ignore files inside fav folder
    if (posixRelFilePath.startsWith('fav/')) {
      return;
    }

    if (!stats.size || ignored.includes(fileName)) {
      return;
    }

    wd.pause();

    mkdirp(path.dirname(destination))
      .then(() => {
        coypFunc(filePath, destination, (error) => {
          if (error) {
            console.error(error);
            return;
          }

          wd.resume();
        });
      });
  });
});
