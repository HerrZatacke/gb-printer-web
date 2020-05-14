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

const save = (lineBuffer) => {
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

  const dataHash = hash(compressed);

  localStorage.setItem(`gbp-web-${dataHash}`, compressed);

  return dataHash;
};

const load = (dataHash) => {
  try {
    const binary = localStorage.getItem(`gbp-web-${dataHash}`);
    const inflated = pako.inflate(binary, { to: 'string' });
    return inflated.split('\n');
  } catch (error) {
    return dummyImage();
  }
};

const del = (dataHash) => {
  localStorage.removeItem(`gbp-web-${dataHash}`);
};

export {
  save,
  load,
  del,
};
