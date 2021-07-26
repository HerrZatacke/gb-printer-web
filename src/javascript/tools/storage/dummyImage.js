import getChars from '../chars';

const black = 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\n';

const dummyImage = (hash) => {
  const result = [];

  const text = `
The following hash is missing in
your indexedDb:
${hash}

Either you imported a debug dump
or your browser decided to do a
cleanup.

This image might be recovered if
you set up git or dropbox sync.
`.trim();

  const lines = text.split('\n')
    .map((line) => line.match(/.{1,32}/g))
    .flat()
    .map((line) => line || '')
    .map((line = '') => line.padEnd(32, ' '))
    .map((line) => line.match(/.{1,2}/g).map((chars) => getChars(chars)))
    .map((line) => [black, black, ...line, black, black])
    .flat();

  result.push(...[...Array(40)].map(() => black));

  // Actual Text
  result.push(...lines);

  while (result.length < 360) {
    result.push(black);
  }

  return result;
};

export default dummyImage;
