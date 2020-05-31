import getChars from '../chars';
import { upper, lower, black } from '../frame';

const dummyImage = (hash) => {
  const result = [];

  const text = `The following hash is missing in your localStorage:\n${hash}\n\nMaybe you imported a debug dump?`;

  const lines = text.split('\n')
    .map((line) => line.match(/.{1,32}/g))
    .flat()
    .map((line) => line || '')
    .map((line = '') => line.padEnd(32, ' '))
    .map((line) => `    ${line}    `)
    .map((line) => line.match(/.{1,2}/g).map((chars) => getChars(chars)))
    .flat();

  // Upper frame "Nintendo"
  result.push(...upper);

  // Blank black line
  result.push(...[...Array(20)].map(() => black));

  // Actual Text
  result.push(...lines);

  while (result.length < 320) {
    result.push(black);
  }

  // Lower frame "GameBoy"
  result.push(...lower);

  return result;
};

export default dummyImage;
