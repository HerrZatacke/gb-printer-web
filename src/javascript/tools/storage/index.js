import dummyImage from './dummyImage';
import applyFrame from '../applyFrame';

const save = (lineBuffer) => (
  import(/* webpackChunkName: "obh" */ 'object-hash')
    .then(({ default: hash }) => (
      import(/* webpackChunkName: "pko" */ 'pako')
        .then(({ default: pako }) => {
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

const load = (dataHash, frame) => {
  if (!dataHash) {
    return Promise.resolve(null);
  }

  return (
    import(/* webpackChunkName: "pko" */ 'pako')
      .then(({ default: pako }) => {

        try {
          let binary;

          if (dataHash.startsWith('base64-')) {
            binary = atob(localStorage.getItem(`gbp-web-${dataHash}`));
          } else {
            binary = localStorage.getItem(`gbp-web-${dataHash}`);
          }

          const inflated = pako.inflate(binary, { to: 'string' });
          return inflated.split('\n');
        } catch (error) {
          return dummyImage(dataHash);
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
  localStorage.removeItem(`gbp-web-${dataHash}`);
};

export {
  save,
  load,
  del,
};
