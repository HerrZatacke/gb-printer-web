// See https://github.com/dropbox/dropbox-api-content-hasher/blob/master/js-node/dropbox-content-hasher.js
/**
 * Computes a hash using the same algorithm that the Dropbox API uses for the
 * the "content_hash" metadata field.
 *
 * The `digest()` method returns a raw binary representation of the hash.
 * The "content_hash" field in the Dropbox API is a hexadecimal-encoded version
 * of the digest.
 *
 * Example:
 *
 *     const fs = require('fs');
 *     const dch = require('dropbox-content-hasher');
 *
 *     const hasher = dch.create();
 *     const f = fs.createReadStream('some-file');
 *     f.on('data', function(buf) {
 *       hasher.update(buf);
 *     });
 *     f.on('end', function(err) {
 *       const hexDigest = hasher.digest('hex');
 *       console.log(hexDigest);
 *     });
 *     f.on('error', function(err) {
 *       console.error("Error reading from file: " + err);
 *       process.exit(1);
 *     });
 */

import crypto from 'crypto-browserify';

const BLOCK_SIZE = 4 * 1024 * 1024;

function DropboxContentHasher(overallHasher, blockHasher, blockPos) {
  this.overallHasher = overallHasher;
  this.blockHasher = blockHasher;
  this.blockPos = blockPos;
}

DropboxContentHasher.prototype.update = function update(data, inputEncoding) {
  if (this.overallHasher === null) {
    throw new Error(
      "can't use this object anymore; you already called digest()",
    );
  }

  let bufferData = data;
  if (!Buffer.isBuffer(bufferData)) {
    if (inputEncoding !== undefined &&
      inputEncoding !== 'utf8' && inputEncoding !== 'ascii' && inputEncoding !== 'latin1') {
      // The docs for the standard hashers say they only accept these three encodings.
      throw new Error(`Invalid 'inputEncoding': ${JSON.stringify(inputEncoding)}`);
    }

    bufferData = Buffer.from(data, inputEncoding);
  }

  let offset = 0;
  while (offset < bufferData.length) {
    if (this.blockPos === BLOCK_SIZE) {
      this.overallHasher.update(this.blockHasher.digest());
      this.blockHasher = crypto.createHash('sha256');
      this.blockPos = 0;
    }

    const spaceInBlock = BLOCK_SIZE - this.blockPos;
    const inputPartEnd = Math.min(bufferData.length, offset + spaceInBlock);
    const inputPartLength = inputPartEnd - offset;
    this.blockHasher.update(bufferData.slice(offset, inputPartEnd));

    this.blockPos += inputPartLength;
    offset = inputPartEnd;
  }
};

DropboxContentHasher.prototype.digest = function digest(encoding) {
  if (this.overallHasher === null) {
    throw new Error(
      "can't use this object anymore; you already called digest()",
    );
  }

  if (this.blockPos > 0) {
    this.overallHasher.update(this.blockHasher.digest());
    this.blockHasher = null;
  }

  const r = this.overallHasher.digest(encoding);
  this.overallHasher = null; // Make sure we can't use this object anymore.
  return r;
};

export default () => (
  new DropboxContentHasher(crypto.createHash('sha256'), crypto.createHash('sha256'), 0)
);
