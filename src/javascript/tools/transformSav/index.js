import { upper, lower, side } from '../frame';

const padTiles = (buff, where = 1) => {

  switch (where) {
    case 'upper':
      buff.push(...upper);
      break;
    case 'lower':
      buff.push(...lower);
      break;
    case 'left':
    case 'right':
      buff.push(...side);
      break;
    default:
      break;
  }
};

const transformSav = (raw) => {

  const data = Buffer.from(raw);
  const transformed = [];

  transformed.push('!{"command":"INIT"}\n');
  transformed.push('!{"command":"DATA","compressed":0,"more":1}\n');
  padTiles(transformed, 'upper');

  for (let i = 8192; i < 130560; i += 1) {
    if (i % 4096 === 3584) {
      padTiles(transformed, 'upper');
    }

    if (i % 4096 <= 3583) {

      if (i % 256 === 0) {
        padTiles(transformed, 'left');
      }

      transformed.push(data[i].toString(16).padStart(2, '0'));

      if (i % 16 === 15) {
        transformed.push('\n');
      } else {
        transformed.push(' ');
      }

      if (i % 256 === 255) {
        padTiles(transformed, 'right');
      }
    }

    if (i % 4096 === 3583) {
      padTiles(transformed, 'lower');
      transformed.push('!{"command":"DATA","compressed":0,"more":0}\n');
      transformed.push('!{"command":"PRNT","sheets":1,"margin_upper":1,"margin_lower":3,"pallet":228,"density":64 }\n');
    }
  }

  return transformed.join('');

};

export default transformSav;
