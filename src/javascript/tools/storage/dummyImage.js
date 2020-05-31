import getChars from '../chars';

const black = 'FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF\n';

const dummyImage = (hash) => {
  const result = [];

  const text = `The following hash is missing in your localStorage:\n${hash}\n\nMaybe you imported a debug dump?`;

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
