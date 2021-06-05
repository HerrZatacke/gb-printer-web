const path = require('path');
const walkdir = require('walkdir');
const chalk = require('chalk');
const { output: { path: outputPath } } = require('./webpack.prod');

walkdir(outputPath, (filePath) => {

  // Bad filename example
  // /w/nnnn/remote.js.LICENSE.txt.gz

  const relFilePath = path.relative(outputPath, filePath);
  const posixRelFilePath = relFilePath.split(path.sep).join(path.posix.sep);
  const spiffsPath = `/${path.posix.join('w', posixRelFilePath)}.gz`;

  // console.log({
  //   filePath,
  //   relFilePath,
  //   posixRelFilePath,
  //   len: spiffsPath.length,
  //   spiffsPath,
  // });

  if (spiffsPath.length >= 32) {
    console.error(chalk.red(`Resulting filename "${spiffsPath}" will be too long for SPIFFS`));
    process.exit(-1);
  }
});
