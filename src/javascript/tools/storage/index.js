import dummyImage from './dummyImage';
import applyFrame from '../applyFrame';
import { localforageImages } from '../localforageInstance';

const save = (lineBuffer) => (
  import(/* webpackChunkName: "obh" */ 'object-hash')
    .then(({ default: hash }) => (
      import(/* webpackChunkName: "pko" */ 'pako')
        .then(({ default: pako }) => {

          // eslint-disable-next-line no-alert
          alert('toDo');
          throw new Error('öhöm!');
          // eslint-disable-next-line no-unreachable
          const imageData = lineBuffer
            .map((line) => (
              line.replace(/ /gi, '')
            ))
            .join('\n');

          const compressed = pako.deflate(imageData, {
            to: 'string',
            strategy: 1,
            level: 8,
          });

          let dataHash = hash(compressed);

          try {
            localStorage.setItem(`gbp-web-${dataHash}`, compressed);
          } catch (error) {
            localStorage.removeItem(`gbp-web-${dataHash}`, compressed);
            dataHash = `base64-${dataHash}`;
            localStorage.setItem(`gbp-web-${dataHash}`, btoa(compressed));
          }

          return dataHash;

        })
    ))
);

const load = (dataHash, frame, noDummy) => {
  if (!dataHash) {
    return Promise.resolve(null);
  }

  return (
    import(/* webpackChunkName: "pko" */ 'pako')
      .then(({ default: pako }) => {

        try {
          let getBinary;

          if (dataHash.startsWith('base64-')) {
            getBinary = localforageImages.getItem(dataHash)
              .then((base) => atob(base));
          } else {
            getBinary = localforageImages.getItem(dataHash);
          }

          return getBinary.then((binary) => {
            const inflated = pako.inflate(binary, { to: 'string' });
            return inflated.split('\n');
          });
        } catch (error) {
          return noDummy ? [] : dummyImage(dataHash);
        }
      })
  ).then((tiles) => {
    if (!frame) {
      return tiles;
    }

    return applyFrame(tiles, frame);
  });
};

const del = (dataHash) => {
  localforageImages.removeItem(dataHash);
};

export {
  save,
  load,
  del,
};
