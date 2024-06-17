import { createGzip } from 'zlib';
import { pipeline } from 'stream';
import { createReadStream, createWriteStream } from 'fs';

const copyAndGZ = (source, destination, done) => {
  pipeline(
    createReadStream(source),
    createGzip(),
    createWriteStream(`${destination}.gz`),
    done,
  );
};

export default copyAndGZ;
