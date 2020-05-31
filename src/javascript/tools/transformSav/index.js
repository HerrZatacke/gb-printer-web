const black = 'FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF';

const transformSav = (raw) => {

  const data = Buffer.from(raw);
  const transformed = [];

  transformed.push('!{"command":"INIT"}\n');
  transformed.push('!{"command":"DATA","compressed":0,"more":1}\n');
  // upper frame
  transformed.push(...[...Array(40)].map(() => black));

  for (let i = 8192; i < 130560; i += 1) {
    if (i % 4096 === 3584) {
      // upper frame
      transformed.push(...[...Array(40)].map(() => black));
    }

    if (i % 4096 <= 3583) {

      if (i % 256 === 0) {
        // left frame
        transformed.push(...[...Array(2)].map(() => black));
      }

      transformed.push(data[i].toString(16).padStart(2, '0'));

      if (i % 16 === 15) {
        transformed.push('\n');
      } else {
        transformed.push(' ');
      }

      if (i % 256 === 255) {
        // right frame
        transformed.push(...[...Array(2)].map(() => black));
      }
    }

    if (i % 4096 === 3583) {
      // lower frame
      transformed.push(...[...Array(2)].map(() => black));
      transformed.push('!{"command":"DATA","compressed":0,"more":0}\n');
      transformed.push('!{"command":"PRNT","sheets":1,"margin_upper":1,"margin_lower":3,"pallet":228,"density":64 }\n');
    }
  }

  return transformed.join('');

};

export default transformSav;
