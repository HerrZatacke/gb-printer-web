import tileIndexIsPartOfFrame from '../tileIndexIsPartOfFrame';

const saveFrameData = (frameId, imageTiles) => (
  import(/* webpackChunkName: "pko" */ 'pako')
    .then(({ default: pako }) => {
      const frameData = imageTiles
        .filter((_, index) => tileIndexIsPartOfFrame(index))
        .map((line) => (
          line.replace(/ /gi, '')
        ))
        .join('\n');

      const compressed = pako.deflate(frameData, {
        to: 'string',
        strategy: 1,
        level: 8,
      });

      try {
        localStorage.setItem(`gbp-web-frame-${frameId}`, compressed);
      } catch (error) {
        localStorage.removeItem(`gbp-web-frame-${frameId}`, compressed);
        localStorage.setItem(`gbp-web-frame-base64-${frameId}`, btoa(compressed));
      }

      return true;
    })
);

const loadFrameData = (frameId) => {
  if (!frameId) {
    return Promise.resolve(null);
  }

  let binary = localStorage.getItem(`gbp-web-frame-${frameId}`);

  if (!binary) {
    binary = localStorage.getItem(`gbp-web-frame-base64-${frameId}`);
    if (binary) {
      binary = atob(binary);
    }
  }

  if (!binary) {
    return Promise.resolve(null);
  }

  return import(/* webpackChunkName: "pko" */ 'pako')
    .then(({ default: pako }) => {
      try {
        const tiles = pako.inflate(binary, { to: 'string' }).split('\n');

        return {
          upper: tiles.slice(0, 40),
          left: Array(14).fill(0).map((_, index) => tiles.slice((index * 4) + 40, (index * 4) + 42)),
          right: Array(14).fill(0).map((_, index) => tiles.slice((index * 4) + 42, (index * 4) + 44)),
          lower: tiles.slice(96, 136),
        };
      } catch (error) {
        return null;
      }
    });
};

export {
  loadFrameData,
  saveFrameData,
};
