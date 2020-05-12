import pako from 'pako';
import hash from 'object-hash';

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
    return [];
  }
};

export {
  save,
  load,
};
