const fs = require('fs');
const path = require('path');
const walkdir = require('walkdir');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const conf = require('../config');
const { output: { path: outputPath } } = require('./webpack.prod');

if (!conf || !conf.deploy || !conf.deploy.dir) {
  process.exit(0);
}

const deployDir = conf.deploy.dir;

rimraf(`${deployDir}/*`, {}, () => {
  walkdir.sync(outputPath, (filePath, stats) => {

    const fileName = path.basename(filePath);

    if (fileName.startsWith('.') || !stats.size) {
      return;
    }

    const destination = path.join(deployDir, path.relative(outputPath, filePath));

    mkdirp.sync(path.dirname(destination));
    fs.copyFileSync(filePath, destination);
  });
});
