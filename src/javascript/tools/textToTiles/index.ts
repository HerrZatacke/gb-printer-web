import getChars from '../chars';

const black = 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\n';

const textToTiles = (text: string): string[] => {
  const result = [];
  const lines = text.split('\n')
    .map((line) => line.match(/.{1,32}/g))
    .flat()
    .map((line) => line || '')
    .map((line = '') => line.padEnd(32, ' '))
    .map((line) => (
      line.match(/.{1,2}/g)
        ?.map((chars) => getChars(chars)) ||
      []
    ))
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

export default textToTiles;
