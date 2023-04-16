import chunk from 'chunk';
import dummyImage from './dummyImage';
import applyFrame from '../applyFrame';
import { localforageFrames, localforageImages } from '../localforageInstance';

const sha256Hash = async (lines) => {
  const bytes = lines.map((line) => (
    chunk(line, 2).map((byte) => (
      parseInt(byte, 16)
    ))
  )).flat();

  const testHash = await window.crypto.subtle.digest('SHA-256', new Uint8Array(bytes));
  const testArray = new Uint8Array(testHash);
  return [...testArray].map((x) => (x.toString(16).padStart(2, '0'))).join('');
};

const compressAndHash = async (lines) => {
  const { default: hash } = await import(/* webpackChunkName: "obh" */ 'object-hash');
  const { default: pako } = await import(/* webpackChunkName: "pko" */ 'pako');

  const imageDataLines = lines
    .map((line) => (
      line.replace(/ /gi, '').toUpperCase()
    ));

  const compressed = pako.deflate(imageDataLines.join('\n'), {
    to: 'string',
    strategy: 1,
    level: 8,
  });


  const dataHash = await sha256Hash(imageDataLines);

  return {
    dataHash,
    compressed,
  };
};

const save = async (lines) => {
  const {
    dataHash,
    compressed,
  } = await compressAndHash(lines);
  await localforageImages.setItem(dataHash, compressed);
  return dataHash;
};

const load = (dataHash, frameHash, noDummy, recover = false) => {
  if (!dataHash) {
    return Promise.resolve(null);
  }

  return (
    import(/* webpackChunkName: "pko" */ 'pako')
      .then(({ default: pako }) => (
        localforageImages.getItem(dataHash)
          .then((binary) => {
            const inflated = pako.inflate(binary, { to: 'string' });
            return inflated.split('\n');
          })
          .catch(() => {
            if (typeof recover === 'function') {
              // Recovery function is only used by <ImageRender> component
              // it dispatches so that data might get re-loaded from sync storage
              recover(dataHash);
            }

            return noDummy ? [] : dummyImage(dataHash);
          })
      ))
  ).then((tiles) => {
    if (!frameHash) {
      return tiles;
    }

    return applyFrame(tiles, frameHash);
  });
};

const del = (dataHash) => {
  localforageImages.removeItem(dataHash);
};

const delFrame = (dataHash) => {
  localforageFrames.removeItem(dataHash);
};

export {
  compressAndHash,
  save,
  load,
  del,
  delFrame,
};
