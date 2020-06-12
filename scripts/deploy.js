const fs = require('fs');
const path = require('path');
const walkdir = require('walkdir');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const copyAndGZ = require('./copyAndGZ');
const conf = require('../config');
const { output: { path: outputPath } } = require('./webpack.prod');

if (!conf || !conf.deploy || !conf.deploy.dir) {
  process.exit(0);
}

const { dir, gzip } = conf.deploy;

const coypFunc = gzip ? copyAndGZ : fs.copyFile;

rimraf(`${dir}/*`, {}, () => {
  const wd = walkdir(outputPath);
  wd.on('file', (filePath, stats) => {
    const fileName = path.basename(filePath);
    const destination = path.join(dir, path.relative(outputPath, filePath));
    if (fileName.startsWith('.') || !stats.size) {
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
