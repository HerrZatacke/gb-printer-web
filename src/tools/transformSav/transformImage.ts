const black = 'FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF';
const white = '00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00';

const transformImage = (data: Uint8Array, baseAddress: number): string[] | null => {
  const transformed: string[] = [];
  let currentLine = '';
  let hasData = false;

  // add black upper frame placeholder
  transformed.push(...[...Array(40)].map(() => black));

  for (let i = 0; i < 0x0E00; i += 1) {
    if (i % 256 === 0) {
      // add left frame placeholder
      transformed.push(...[...Array(2)].map(() => black));
    }

    currentLine += ` ${data[baseAddress + i].toString(16)
      .padStart(2, '0')}`;

    if (i % 16 === 15) {
      transformed.push(currentLine.trim());

      // track if an image has actual data inside to prevent importing the "white" image all the time
      if (!hasData && currentLine.trim() !== white) {
        hasData = true;
      }

      currentLine = '';
    }

    if (i % 256 === 255) {
      // add right frame placeholder
      transformed.push(...[...Array(2)].map(() => black));
    }
  }

  // add lower frame placeholder
  transformed.push(...[...Array(40)].map(() => black));

  return hasData ? transformed : null;
};

export default transformImage;
