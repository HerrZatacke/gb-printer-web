const path = require('path');
const walkdir = require('walkdir');
const chalk = require('chalk');
const { output: { path: outputPath } } = require('./webpack.prod');

walkdir(outputPath, (filePath) => {
  if (path.join('w', path.relative(outputPath, filePath)).length >= 32) {
    console.error(chalk.red('Filename too large for SPIFFS'));
    process.exit(-1);
  }
});
