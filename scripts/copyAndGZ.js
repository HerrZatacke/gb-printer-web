/* eslint-disable @typescript-eslint/no-var-requires */
const { createGzip } = require('zlib');
const { pipeline } = require('stream');
const { createReadStream, createWriteStream } = require('fs');

const copyAndGZ = (source, destination, done) => {
  pipeline(
    createReadStream(source),
    createGzip(),
    createWriteStream(`${destination}.gz`),
    done,
  );
};

module.exports = copyAndGZ;
