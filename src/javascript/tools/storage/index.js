import pako from 'pako';
import hash from 'object-hash';

const dummyImage = () => (
  [...new Array(20 * 18)]
    .map(() => (
      [...new Array(16)]
        .map(() => (
          Math.floor(Math.random() * 256)
            .toString(16)
            .padLeft(2, '0')
        ))
        .join(' ')
    ))
);

const save = (lineBuffer) => (
  new Promise((resolve) => {
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

    resolve(dataHash);
  })
);

const load = (dataHash) => (
  new Promise((resolve) => {
    try {
      let binary;

      if (dataHash.startsWith('base64-')) {
        binary = atob(localStorage.getItem(`gbp-web-${dataHash}`));
      } else {
        binary = localStorage.getItem(`gbp-web-${dataHash}`);
      }

      const inflated = pako.inflate(binary, { to: 'string' });
      resolve(inflated.split('\n'));
    } catch (error) {
      resolve(dummyImage());
    }
  })
);

const del = (dataHash) => {
  localStorage.removeItem(`gbp-web-${dataHash}`);
};

export {
  save,
  load,
  del,
};
